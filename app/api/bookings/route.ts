import { promises as fs } from "node:fs";
import path from "node:path";

import {
  BOOKING_STATUSES,
  type Booking,
  type BookingDraft,
  type BookingStatus,
  BookingError,
} from "@/lib/booking";
import { createId } from "@/lib/utils";

/**
 * Demo persistence layer.
 *
 * Bookings are appended to `.data/bookings.json` so the admin screen survives a
 * server restart during a demo. Replace the two helpers below with real database
 * queries when the project goes to production — the HTTP contract stays the same:
 *
 *   GET    /api/bookings          -> { bookings: Booking[] }
 *   POST   /api/bookings          -> Booking
 *   PATCH  /api/bookings?id=<id>  -> Booking
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

/** Serialises writes so two parallel POSTs cannot overwrite each other. */
let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<Booking[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeAll(bookings: Booking[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), "utf8");
}

function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

function isDraft(value: unknown): value is BookingDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<BookingDraft>;
  const required: Array<keyof BookingDraft> = [
    "serviceId",
    "serviceLabel",
    "carMake",
    "carModel",
    "carYear",
    "date",
    "time",
    "name",
    "phone",
  ];
  return required.every(
    (key) => typeof draft[key] === "string" && (draft[key] as string).trim() !== "",
  );
}

export async function GET(): Promise<Response> {
  try {
    const bookings = await withLock(readAll);
    bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return Response.json({ bookings });
  } catch {
    return jsonError("Не удалось прочитать заявки", 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Некорректный формат запроса", 400);
  }

  if (!isDraft(payload)) {
    return jsonError("Заполните услугу, автомобиль, дату, время и контакты", 400);
  }

  const draft = payload;
  const booking: Booking = {
    ...draft,
    id: createId(),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  try {
    await withLock(async () => {
      const bookings = await readAll();
      bookings.unshift(booking);
      await writeAll(bookings);
    });
    return Response.json(booking, { status: 201 });
  } catch {
    return jsonError("Не удалось сохранить заявку", 500);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Не указан идентификатор заявки", 400);

  let body: { status?: string };
  try {
    body = (await request.json()) as { status?: string };
  } catch {
    return jsonError("Некорректный формат запроса", 400);
  }

  const status = body.status as BookingStatus | undefined;
  if (!status || !BOOKING_STATUSES.includes(status)) {
    return jsonError("Неизвестный статус заявки", 400);
  }

  try {
    const updated = await withLock(async () => {
      const bookings = await readAll();
      const index = bookings.findIndex((booking) => booking.id === id);
      if (index === -1) throw new BookingError("Заявка не найдена");
      const next = { ...bookings[index], status };
      bookings[index] = next;
      await writeAll(bookings);
      return next;
    });
    return Response.json(updated);
  } catch (error) {
    if (error instanceof BookingError) return jsonError(error.message, 404);
    return jsonError("Не удалось обновить заявку", 500);
  }
}

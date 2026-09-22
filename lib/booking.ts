/**
 * Booking domain + storage layer.
 *
 * The UI never talks to a storage mechanism directly — it goes through
 * `getBookingStore()`. Two implementations exist behind one interface:
 *
 *  1. `ApiBookingStore`   – POST/GET/PATCH `/api/bookings` (works with the
 *                           built-in Next.js route handler, and later with any
 *                           real backend: the contract is documented below).
 *  2. `LocalBookingStore` – `localStorage`, used only when the API is
 *                           unreachable (e.g. the demo is opened as a static
 *                           export). The admin screen shows which one is active.
 *
 * Swapping in a database later means changing `app/api/bookings/route.ts` only.
 *
 * REST contract:
 *   GET    /api/bookings            -> Booking[]
 *   POST   /api/bookings            -> Booking          body: BookingDraft
 *   PATCH  /api/bookings?id=<id>    -> Booking          body: { status }
 */

import { createId, isPhoneComplete } from "./utils";

export const BOOKING_STATUSES = [
  "new",
  "confirmed",
  "in_progress",
  "done",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  in_progress: "В работе",
  done: "Завершена",
  cancelled: "Отменена",
};

/** Status styling used by the admin table (kept out of the components). */
export const STATUS_STYLES: Record<BookingStatus, string> = {
  new: "border-accent-500/40 bg-accent-500/12 text-accent-300",
  confirmed: "border-sky-400/35 bg-sky-400/10 text-sky-200",
  in_progress: "border-violet-400/35 bg-violet-400/10 text-violet-200",
  done: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
  cancelled: "border-white/12 bg-white/5 text-white/45",
};

export type Booking = {
  id: string;
  createdAt: string;
  status: BookingStatus;
  serviceId: string;
  serviceLabel: string;
  carMake: string;
  carModel: string;
  carYear: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  comment: string;
  /** True for bookings created by the "load demo data" button in the admin. */
  demo?: boolean;
  /** Set by `list()` only: whether this row came from the API or the browser. */
  origin?: BookingOrigin;
};

/**
 * Where a row in the merged admin list came from. Assigned by `list()` only,
 * never persisted.
 */
export type BookingOrigin = "server" | "local";

export type BookingDraft = Omit<
  Booking,
  "id" | "createdAt" | "status" | "origin"
> & {
  demo?: boolean;
};

export type BookingStoreKind = "api" | "local";

export interface BookingStore {
  kind: BookingStoreKind;
  create(draft: BookingDraft): Promise<Booking>;
  list(): Promise<Booking[]>;
  /**
   * `localOnly` skips the API round-trip for rows that only exist in this
   * browser's mirror (serverless instances are ephemeral), so the request log is
   * not polluted with pointless 404s.
   */
  updateStatus(
    id: string,
    status: BookingStatus,
    options?: { localOnly?: boolean },
  ): Promise<Booking>;
}

/** Opening hours confirmed on the 2GIS card: daily 09:00–23:00. */
export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

/** How far ahead a client can book. */
export const BOOKING_HORIZON_DAYS = 60;

export class BookingError extends Error {
  /** HTTP status when the error came from the API (undefined for network errors). */
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "BookingError";
    this.status = status;
  }
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export type ContactErrors = {
  name?: string;
  phone?: string;
};

export function validateContact(values: {
  name: string;
  phone: string;
}): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = "Укажите имя";
  } else if (name.length < 2) {
    errors.name = "Слишком короткое имя";
  }

  if (!values.phone.trim()) {
    errors.phone = "Укажите телефон";
  } else if (!isPhoneComplete(values.phone)) {
    errors.phone = "Формат: +7 (777) 000-00-00";
  }

  return errors;
}

export function validateCar(values: {
  carMake: string;
  carModel: string;
  carYear: string;
}): Partial<Record<"carMake" | "carModel" | "carYear", string>> {
  const errors: Partial<Record<"carMake" | "carModel" | "carYear", string>> = {};
  const maxYear = new Date().getFullYear() + 1;

  if (!values.carMake.trim()) errors.carMake = "Укажите марку";
  if (!values.carModel.trim()) errors.carModel = "Укажите модель";

  const year = Number(values.carYear);
  if (!values.carYear.trim()) {
    errors.carYear = "Укажите год";
  } else if (!Number.isInteger(year) || year < 1950 || year > maxYear) {
    errors.carYear = `Год от 1950 до ${maxYear}`;
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/* Storage implementations                                             */
/* ------------------------------------------------------------------ */

const LOCAL_KEY = "luxcar:bookings:v1";

function readLocal(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(bookings: Booking[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(bookings));
}

const localStore: BookingStore = {
  kind: "local",
  async create(draft) {
    const booking: Booking = {
      ...draft,
      id: createId(),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    writeLocal([booking, ...readLocal()]);
    return booking;
  },
  async list() {
    return readLocal();
  },
  async updateStatus(id, status) {
    const bookings = readLocal();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) throw new BookingError("Заявка не найдена");
    const updated = { ...bookings[index], status };
    bookings[index] = updated;
    writeLocal(bookings);
    return updated;
  },
};

/** Keeps the local mirror in sync after a row changed on the server. */
function patchLocal(updated: Booking): void {
  const bookings = readLocal();
  const index = bookings.findIndex((booking) => booking.id === updated.id);
  if (index === -1) return;
  bookings[index] = { ...bookings[index], status: updated.status };
  writeLocal(bookings);
}

/**
 * Server rows win; mirrored local rows are appended for this browser. This is
 * what makes the demo admin show a booking even when the serverless API is
 * ephemeral (each Vercel instance keeps its own /tmp).
 */
function mergeBookings(server: Booking[], local: Booking[]): Booking[] {
  const byId = new Map<string, Booking>();

  local.forEach((booking) => byId.set(booking.id, { ...booking, origin: "local" }));
  server.forEach((booking) => byId.set(booking.id, { ...booking, origin: "server" }));

  return Array.from(byId.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Не удалось выполнить запрос";
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload?.error) message = payload.error;
    } catch {
      /* keep the generic message */
    }
    throw new BookingError(message, response.status);
  }

  return (await response.json()) as T;
}

const apiStore: BookingStore = {
  kind: "api",
  create(draft) {
    return request<Booking>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(draft),
    });
  },
  async list() {
    const payload = await request<{ bookings: Booking[] }>("/api/bookings");
    return payload.bookings ?? [];
  },
  updateStatus(id, status) {
    return request<Booking>(`/api/bookings?id=${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

/**
 * Prefers the API and transparently degrades to localStorage, so the demo keeps
 * working even when it is opened without a Node server. `kind` always reports
 * the storage that actually served the last operation.
 */
class ResilientBookingStore implements BookingStore {
  kind: BookingStoreKind = "api";

  private degraded = false;

  private get active(): BookingStore {
    return this.degraded || typeof window === "undefined" ? localStore : apiStore;
  }

  /**
   * A missing API (e.g. the demo opened as a static export) is an expected
   * condition, not an application error: we switch to local storage once and
   * report the active storage back to the admin screen.
   */
  private fallback(): void {
    this.degraded = true;
    this.kind = "local";
  }

  async create(draft: BookingDraft): Promise<Booking> {
    if (!this.degraded) {
      try {
        const booking = await apiStore.create(draft);
        this.kind = "api";
        // Mirror locally as well: serverless storage is per-instance, so the
        // admin panel on the device that made the booking must still see it.
        writeLocal([booking, ...readLocal()]);
        return booking;
      } catch {
        this.fallback();
      }
    }
    return localStore.create(draft);
  }

  async list(): Promise<Booking[]> {
    if (!this.degraded) {
      try {
        const server = await apiStore.list();
        this.kind = "api";
        return mergeBookings(server, readLocal());
      } catch {
        this.fallback();
      }
    }
    return mergeBookings([], readLocal());
  }

  async updateStatus(
    id: string,
    status: BookingStatus,
    options?: { localOnly?: boolean },
  ): Promise<Booking> {
    if (options?.localOnly) return localStore.updateStatus(id, status);

    if (!this.degraded) {
      try {
        const updated = await apiStore.updateStatus(id, status);
        patchLocal(updated);
        return updated;
      } catch (error) {
        // 404 means the server no longer has this row (each serverless instance
        // keeps its own ephemeral store): update the mirror instead of failing,
        // and report the row as browser-only so the admin badge stays accurate
        // and later edits skip the pointless request.
        const notOnServer = error instanceof BookingError && error.status === 404;
        if (!notOnServer && error instanceof BookingError) throw error;
        const updated = await localStore.updateStatus(id, status);
        return { ...updated, origin: "local" };
      }
    }
    return localStore.updateStatus(id, status);
  }
}

let store: BookingStore | null = null;

export function getBookingStore(): BookingStore {
  if (!store) store = new ResilientBookingStore();
  return store;
}

/* ------------------------------------------------------------------ */
/* Demo data                                                           */
/* ------------------------------------------------------------------ */

function offsetISODate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Clearly flagged sample bookings so the admin screen can be demonstrated. */
export function buildDemoBookings(): BookingDraft[] {
  return [
    {
      serviceId: "lpg",
      serviceLabel: "ГБО",
      carMake: "Toyota",
      carModel: "Camry",
      carYear: "2018",
      date: offsetISODate(0),
      time: "10:00",
      name: "Айдос",
      phone: "+7 (707) 000-00-01",
      comment: "Троит на газу, нужна диагностика ГБО.",
      demo: true,
    },
    {
      serviceId: "diagnostics",
      serviceLabel: "Диагностика",
      carMake: "Audi",
      carModel: "A6",
      carYear: "2015",
      date: offsetISODate(0),
      time: "14:00",
      name: "Марина",
      phone: "+7 (705) 000-00-02",
      comment: "Загорелся «чек», тянет хуже.",
      demo: true,
    },
    {
      serviceId: "maintenance",
      serviceLabel: "ТО",
      carMake: "Lexus",
      carModel: "RX 350",
      carYear: "2020",
      date: offsetISODate(2),
      time: "11:00",
      name: "Ерлан",
      phone: "+7 (747) 000-00-03",
      comment: "Плановое ТО, замена масла и фильтров.",
      demo: true,
    },
    {
      serviceId: "brakes",
      serviceLabel: "Тормоза",
      carMake: "BMW",
      carModel: "X5",
      carYear: "2016",
      date: offsetISODate(4),
      time: "16:00",
      name: "Сергей",
      phone: "+7 (771) 000-00-04",
      comment: "Скрип при торможении сзади.",
      demo: true,
    },
    {
      serviceId: "electric",
      serviceLabel: "Электрика",
      carMake: "Toyota",
      carModel: "Land Cruiser 200",
      carYear: "2013",
      date: offsetISODate(6),
      time: "09:00",
      name: "Нурлан",
      phone: "+7 (702) 000-00-05",
      comment: "Не работает обогрев зеркал.",
      demo: true,
    },
  ];
}


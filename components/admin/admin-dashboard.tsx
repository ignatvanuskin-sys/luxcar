"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Database,
  Inbox,
  RefreshCw,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { CountUp } from "@/components/count-up";
import { Badge, Button, DemoChip, DotLoader, Skeleton } from "@/components/ui";
import {
  BOOKING_STATUSES,
  STATUS_LABELS,
  STATUS_STYLES,
  buildDemoBookings,
  getBookingStore,
  type Booking,
  type BookingStatus,
} from "@/lib/booking";
import { cn, formatShortDate, parseISODate, startOfToday, toISODate } from "@/lib/utils";

type RangeFilter = "all" | "today" | "week";

const RANGE_LABELS: Record<RangeFilter, string> = {
  all: "Все записи",
  today: "Сегодня",
  week: "Неделя",
};

export function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [storage, setStorage] = useState<"api" | "local">("api");
  const [range, setRange] = useState<RangeFilter>("all");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [rowError, setRowError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* Confirmation toast for a saved status change, dismissed automatically. */
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const store = getBookingStore();
    try {
      const data = await store.list();
      setBookings(data);
      setStorage(store.kind);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось загрузить заявки. Проверьте соединение и повторите.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const today = useMemo(() => startOfToday(), []);

  const stats = useMemo(() => {
    const weekLimit = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const active = bookings.filter((booking) => booking.status !== "cancelled");

    return {
      incoming: active.filter((booking) => booking.status === "new").length,
      today: active.filter((booking) => booking.date === toISODate(today)).length,
      week: active.filter((booking) => {
        const date = parseISODate(booking.date);
        return date >= today && date <= weekLimit;
      }).length,
      total: bookings.length,
    };
  }, [bookings, today]);

  const filtered = useMemo(() => {
    const weekLimit = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const normalizedQuery = query.trim().toLowerCase();

    return bookings.filter((booking) => {
      if (status !== "all" && booking.status !== status) return false;

      if (range !== "all") {
        const date = parseISODate(booking.date);
        if (range === "today" && booking.date !== toISODate(today)) return false;
        if (range === "week" && (date < today || date > weekLimit)) return false;
      }

      if (!normalizedQuery) return true;

      return [
        booking.name,
        booking.phone,
        `${booking.carMake} ${booking.carModel}`,
        booking.serviceLabel,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [bookings, query, range, status, today]);

  const changeStatus = async (booking: Booking, nextStatus: BookingStatus) => {
    const previous = bookings;
    setRowError(null);
    setBookings((current) =>
      current.map((item) =>
        item.id === booking.id ? { ...item, status: nextStatus } : item,
      ),
    );

    try {
      const updated = await getBookingStore().updateStatus(booking.id, nextStatus);
      setBookings((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setToast(
        `${booking.name}: статус — «${STATUS_LABELS[nextStatus]}»`,
      );
    } catch (cause) {
      setBookings(previous);
      setRowError(
        cause instanceof Error
          ? cause.message
          : "Не удалось изменить статус заявки.",
      );
    }
  };

  const seedDemoData = async () => {
    setSeeding(true);
    setError(null);
    try {
      const store = getBookingStore();
      for (const draft of buildDemoBookings()) {
        await store.create(draft);
      }
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Не удалось добавить демо-заявки.",
      );
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-dvh bg-ink-950 pb-20">
      <header className="border-b border-white/[0.07] bg-ink-900/60 backdrop-blur-xl">
        <div className="container-page flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[12px] text-white/45 transition hover:text-white"
            >
              <ArrowLeft aria-hidden className="size-3.5" />
              На сайт
            </Link>
            <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Панель заявок
            </h1>
            <p className="mt-1 text-[13px] text-white/45">
              Демонстрационная админка онлайн-записи Lux car.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Badge
              tone="outline"
              className="gap-2 border-white/12 text-white/55"
              title="Источники, из которых собрана таблица"
            >
              <Database aria-hidden className="size-3.5" />
              {storage === "api" ? "Сервер + этот браузер" : "Только этот браузер"}
            </Badge>
            <Button variant="secondary" onClick={() => void seedDemoData()} loading={seeding}>
              <Sparkles aria-hidden className="size-4" />
              Демо-заявки
            </Button>
            <Button variant="secondary" onClick={() => void load()} loading={loading}>
              <RefreshCw aria-hidden className="size-4" />
              Обновить
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page py-8">
        {/* Dashboard cards */}
        <section aria-label="Сводка" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Новые заявки", value: stats.incoming, icon: Inbox },
            { label: "Записи сегодня", value: stats.today, icon: CalendarCheck },
            { label: "Записи на неделю", value: stats.week, icon: CalendarDays },
            { label: "Всего в базе", value: stats.total, icon: Users },
          ].map((card) => (
            <div key={card.label} className="panel rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] tracking-wide text-white/45 uppercase">
                  {card.label}
                </p>
                <card.icon aria-hidden className="size-4 text-accent-400" />
              </div>
              {loading ? (
                <Skeleton className="mt-4 h-9 w-14" />
              ) : (
                <p className="font-display mt-3 text-3xl font-bold text-white">
                  <CountUp value={card.value} />
                </p>
              )}
            </div>
          ))}
        </section>

        {/* Filters */}
        <section
          aria-label="Фильтры"
          className="panel mt-6 flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div
            role="group"
            aria-label="Период"
            className="no-scrollbar flex gap-2 overflow-x-auto"
          >
            {(Object.keys(RANGE_LABELS) as RangeFilter[]).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={range === item}
                onClick={() => setRange(item)}
                className={cn(
                  "h-9 shrink-0 rounded-lg border px-3.5 text-[13px] font-medium transition",
                  range === item
                    ? "border-accent-500/50 bg-accent-500/12 text-accent-300"
                    : "border-white/10 text-white/55 hover:border-white/22 hover:text-white",
                )}
              >
                {RANGE_LABELS[item]}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex items-center">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 size-4 text-white/35"
              />
              <span className="sr-only">Поиск по имени, телефону или автомобилю</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск: имя, телефон, авто"
                className="h-9 w-full rounded-lg border border-white/10 bg-ink-900/80 pr-3 pl-9 text-[13px] text-white placeholder:text-white/25 focus:border-accent-500/60 focus:outline-none sm:w-64"
              />
            </label>

            <label className="flex items-center gap-2 text-[13px] text-white/45">
              <span className="sr-only">Статус заявки</span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as BookingStatus | "all")
                }
                className="h-9 rounded-lg border border-white/10 bg-ink-900/80 px-3 text-[13px] text-white focus:border-accent-500/60 focus:outline-none"
              >
                <option value="all">Все статусы</option>
                {BOOKING_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {STATUS_LABELS[item]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {rowError ? (
          <p
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            <CircleAlert aria-hidden className="size-4" />
            {rowError}
          </p>
        ) : null}

        {/* Table / list */}
        <section aria-label="Заявки" className="mt-6">
          {loading ? (
            <div className="panel space-y-3 rounded-2xl p-5">
              <p className="flex items-center gap-3 text-[13px] text-white/45">
                <DotLoader />
                Загружаем заявки…
              </p>
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="panel flex flex-col items-start gap-4 rounded-2xl p-8">
              <p className="flex items-center gap-2 text-sm text-red-200">
                <CircleAlert aria-hidden className="size-4" />
                {error}
              </p>
              <Button variant="secondary" onClick={() => void load()}>
                <RefreshCw aria-hidden className="size-4" />
                Повторить загрузку
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="panel flex flex-col items-center gap-4 rounded-2xl px-6 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <Inbox aria-hidden className="size-5 text-white/45" />
              </span>
              <div>
                <p className="text-base font-medium text-white">Заявок пока нет</p>
                <p className="mt-1 max-w-md text-[13px] leading-relaxed text-white/45">
                  Оформите запись через форму на сайте — заявка появится здесь.
                  Либо загрузите демонстрационные заявки, чтобы посмотреть, как
                  выглядит заполненная панель.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => void seedDemoData()} loading={seeding}>
                  <Sparkles aria-hidden className="size-4" />
                  Загрузить демо-заявки
                </Button>
                <Link
                  href="/booking"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/14 px-5 text-sm font-medium text-white transition hover:border-white/30"
                >
                  Открыть форму записи
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="panel hidden overflow-hidden rounded-2xl lg:block">
                <table className="w-full border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Заявки на обслуживание: имя, телефон, автомобиль, услуга, дата,
                    время и статус
                  </caption>
                  <thead>
                    <tr className="border-b border-white/[0.07] text-[11px] tracking-[0.12em] text-white/40 uppercase">
                      <th scope="col" className="px-4 py-3 font-medium">Имя</th>
                      <th scope="col" className="px-4 py-3 font-medium">Телефон</th>
                      <th scope="col" className="px-4 py-3 font-medium">Автомобиль</th>
                      <th scope="col" className="px-4 py-3 font-medium">Услуга</th>
                      <th scope="col" className="px-4 py-3 font-medium">Дата</th>
                      <th scope="col" className="px-4 py-3 font-medium">Время</th>
                      <th scope="col" className="px-4 py-3 font-medium">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-white/[0.05] transition hover:bg-white/[0.02] last:border-0"
                      >
                        <td className="px-4 py-4">
                          <span className="flex items-center gap-2 font-medium text-white">
                            {booking.name}
                            {booking.demo ? <DemoChip /> : null}
                            {booking.origin === "local" ? (
                              <Badge
                                tone="outline"
                                className="px-1.5 py-0.5 text-[10px] text-white/40"
                                title="Заявка сохранена в этом браузере: серверный экземпляр её не содержит"
                              >
                                в браузере
                              </Badge>
                            ) : null}
                          </span>
                          {booking.comment ? (
                            <span className="mt-1 block max-w-[16rem] truncate text-[12px] text-white/35">
                              {booking.comment}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-white/70">
                          <a
                            href={`tel:${booking.phone.replace(/[^\d+]/g, "")}`}
                            className="transition hover:text-accent-400"
                          >
                            {booking.phone}
                          </a>
                        </td>
                        <td className="px-4 py-4 text-white/70">
                          {booking.carMake} {booking.carModel}
                          <span className="block text-[12px] text-white/35">
                            {booking.carYear}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-white/70">
                          {booking.serviceLabel}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-white/70">
                          {formatShortDate(booking.date)}
                        </td>
                        <td className="px-4 py-4 tabular-nums text-white/70">
                          {booking.time}
                        </td>
                        <td className="px-4 py-4">
                          <label className="sr-only" htmlFor={`status-${booking.id}`}>
                            Статус заявки {booking.name}
                          </label>
                          <select
                            id={`status-${booking.id}`}
                            value={booking.status}
                            onChange={(event) =>
                              void changeStatus(
                                booking,
                                event.target.value as BookingStatus,
                              )
                            }
                            className={cn(
                              "h-9 w-full min-w-[9.5rem] rounded-lg border px-2.5 text-[13px] font-medium focus:outline-none",
                              STATUS_STYLES[booking.status],
                            )}
                          >
                            {BOOKING_STATUSES.map((item) => (
                              <option key={item} value={item} className="bg-ink-900">
                                {STATUS_LABELS[item]}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="grid gap-3 lg:hidden">
                {filtered.map((booking) => (
                  <li key={booking.id} className="panel rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 font-medium text-white">
                          {booking.name}
                          {booking.demo ? <DemoChip /> : null}
                        </p>
                        <a
                          href={`tel:${booking.phone.replace(/[^\d+]/g, "")}`}
                          className="mt-1 block text-[13px] text-white/60"
                        >
                          {booking.phone}
                        </a>
                      </div>
                      <span className="text-right text-[12px] text-white/45">
                        {formatShortDate(booking.date)}
                        <span className="block tabular-nums">{booking.time}</span>
                      </span>
                    </div>

                    <dl className="mt-3 space-y-1 text-[13px]">
                      <div className="flex justify-between gap-3">
                        <dt className="text-white/40">Автомобиль</dt>
                        <dd className="text-right text-white/75">
                          {booking.carMake} {booking.carModel}, {booking.carYear}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-white/40">Услуга</dt>
                        <dd className="text-right text-white/75">
                          {booking.serviceLabel}
                        </dd>
                      </div>
                      {booking.comment ? (
                        <div className="flex justify-between gap-3">
                          <dt className="text-white/40">Комментарий</dt>
                          <dd className="max-w-[60%] text-right text-white/60">
                            {booking.comment}
                          </dd>
                        </div>
                      ) : null}
                    </dl>

                    <label
                      className="mt-4 block text-[12px] text-white/40"
                      htmlFor={`status-mobile-${booking.id}`}
                    >
                      Статус
                    </label>
                    <select
                      id={`status-mobile-${booking.id}`}
                      value={booking.status}
                      onChange={(event) =>
                        void changeStatus(booking, event.target.value as BookingStatus)
                      }
                      className={cn(
                        "mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-medium focus:outline-none",
                        STATUS_STYLES[booking.status],
                      )}
                    >
                      {BOOKING_STATUSES.map((item) => (
                        <option key={item} value={item} className="bg-ink-900">
                          {STATUS_LABELS[item]}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-[12px] leading-relaxed text-white/35">
                Показано {filtered.length} из {bookings.length}. Таблица объединяет
                заявки с сервера и из этого браузера, поэтому заявка, оформленная
                здесь, видна сразу. В демо-режиме серверная часть хранит данные
                только до перезапуска — для боевой работы подключается база данных
                (интерфейс <span className="font-mono text-white/50">BookingStore</span>{" "}
                уже готов).
              </p>
            </>
          )}
        </section>
      </main>

      {/* Confirmation toast: rises in, then fades out on its own. */}
      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-100 flex justify-center px-4">
          <p
            role="status"
            aria-live="polite"
            className="animate-pop-in flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-ink-850/95 px-4 py-3 text-[13px] text-emerald-100 shadow-lift backdrop-blur-md"
          >
            <CheckCircle2 aria-hidden className="size-4 text-emerald-300" />
            {toast}
          </p>
        </div>
      ) : null}
    </div>
  );
}

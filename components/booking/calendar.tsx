"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buildMonthGrid, cn, isSameDay, startOfToday, toISODate } from "@/lib/utils";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function Calendar({
  value,
  onChange,
  horizonDays,
}: {
  value: string;
  onChange: (iso: string) => void;
  horizonDays: number;
}) {
  const today = useMemo(() => startOfToday(), []);
  const maxDate = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate() + horizonDays),
    [today, horizonDays],
  );

  const [cursor, setCursor] = useState(() => {
    const base = value ? new Date(`${value}T00:00:00`) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const days = useMemo(
    () => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  );

  const monthLabel = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(cursor);

  const canGoBack =
    cursor.getFullYear() > today.getFullYear() ||
    (cursor.getFullYear() === today.getFullYear() &&
      cursor.getMonth() > today.getMonth());

  const canGoForward =
    cursor.getFullYear() < maxDate.getFullYear() ||
    (cursor.getFullYear() === maxDate.getFullYear() &&
      cursor.getMonth() < maxDate.getMonth());

  const shiftMonth = (delta: number) => {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const fullDateFormatter = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="panel rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoBack}
          aria-label="Предыдущий месяц"
          className="grid size-10 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:border-white/25 hover:text-white disabled:opacity-30 disabled:hover:border-white/10"
        >
          <ChevronLeft aria-hidden className="size-4" />
        </button>

        <p aria-live="polite" className="text-sm font-medium text-white first-letter:uppercase">
          {monthLabel}
        </p>

        <button
          type="button"
          onClick={() => shiftMonth(1)}
          disabled={!canGoForward}
          aria-label="Следующий месяц"
          className="grid size-10 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:border-white/25 hover:text-white disabled:opacity-30 disabled:hover:border-white/10"
        >
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium tracking-wide text-white/35 uppercase">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = toISODate(day);
          const inMonth = day.getMonth() === cursor.getMonth();
          const disabled = day < today || day > maxDate;
          const selected = value === iso;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-label={fullDateFormatter.format(day)}
              onClick={() => onChange(iso)}
              className={cn(
                "grid h-11 place-items-center rounded-lg text-sm transition-colors duration-150",
                !inMonth && "text-white/20",
                inMonth && !disabled && "text-white/80 hover:bg-white/[0.08]",
                disabled && "cursor-not-allowed text-white/15",
                selected &&
                  "bg-accent-500 font-semibold text-ink-950 hover:bg-accent-400",
              )}
            >
              {day.getDate()}
              {isSameDay(day, today) && !selected ? (
                <span
                  aria-hidden
                  className="mt-0.5 size-1 rounded-full bg-accent-500"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

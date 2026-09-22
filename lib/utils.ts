import type { CSSProperties } from "react";

/** Tiny class-name helper (keeps the bundle free of extra dependencies). */
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

/**
 * Number formatting for animated counters: Russian digit grouping, but a dot as
 * the decimal separator so the rating reads exactly like it does in 2ГИС ("4.8").
 */
export function formatCount(value: number, decimals = 0): string {
  const formatted = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return decimals > 0 ? formatted.replace(",", ".") : formatted;
}

/** Stagger for scroll-reveal animations. */
export function revealDelay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}

/** Stagger for the above-the-fold entrance animations. */
export function riseDelay(ms: number): CSSProperties {
  return { "--rise-delay": `${ms}ms` } as CSSProperties;
}

export function digitsOnly(value: string): string {
  return value.replace(/\D+/g, "");
}

export const KZ_PHONE_DIGITS = 10;

/**
 * Formats only the national part of a KZ number: 700 123-45-67.
 *
 * The country code is deliberately NOT part of the editable value — it is
 * rendered as a static "+7" prefix next to the input. Otherwise the prefix
 * would be re-read on every keystroke and corrupt the digits (the classic
 * phone-mask bug). A pasted full number is normalised by dropping the
 * leading 7 or 8 trunk/country prefix.
 */
export function formatPhoneInput(raw: string): string {
  let digits = digitsOnly(raw);

  if (digits.length > KZ_PHONE_DIGITS && (digits.startsWith("7") || digits.startsWith("8"))) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, KZ_PHONE_DIGITS);

  const groups = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ];

  let formatted = groups[0];
  if (groups[1]) formatted += ` ${groups[1]}`;
  if (groups[2]) formatted += `-${groups[2]}`;
  if (groups[3]) formatted += `-${groups[3]}`;

  return formatted;
}

/** "700 123-45-67" → "+7 (700) 123-45-67" (used for storage and display). */
export function toInternationalPhone(raw: string): string {
  const national = formatPhoneInput(raw);
  if (!national) return "";

  const digits = digitsOnly(national);
  const parts = [
    `+7`,
    digits.slice(0, 3) ? ` (${digits.slice(0, 3)}` : "",
    digits.length >= 3 ? ")" : "",
    digits.slice(3, 6) ? ` ${digits.slice(3, 6)}` : "",
    digits.slice(6, 8) ? `-${digits.slice(6, 8)}` : "",
    digits.slice(8, 10) ? `-${digits.slice(8, 10)}` : "",
  ];

  return parts.join("");
}

export function isPhoneComplete(value: string): boolean {
  return digitsOnly(value).length === KZ_PHONE_DIGITS;
}

/** "2026-09-24" -> Date at local midnight (avoids UTC shifts). */
export function parseISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function toISODate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "2026-09-24" -> "24 сентября 2026" */
export function formatDisplayDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseISODate(iso));
}

/** "2026-09-24" -> "24 сент., чт" */
export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    weekday: "short",
  }).format(parseISODate(iso));
}

/** Month grid (Monday-first) for the booking calendar. */
export function buildMonthGrid(year: number, month: number): Array<Date> {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday = 0
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

export function pluralize(count: number, forms: [string, string, string]): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

/** Keeps ids sortable and readable for a hand-off to a real backend. */
export function createId(prefix = "bk"): string {
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 7);
  return `${prefix}_${stamp}${random}`;
}

"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Menu, Phone, X } from "lucide-react";

import { useBooking } from "@/components/booking/booking-provider";
import { VERIFIED } from "@/lib/company";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#about", label: "О компании" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-90 transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent",
      )}
    >
      {/* Desktop utility strip */}
      <div
        className={cn(
          "hidden overflow-hidden border-b border-white/[0.06] transition-all duration-300 lg:block",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <div className="container-page flex h-10 items-center justify-between text-[12px] text-white/45">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden className="size-3.5" />
              {VERIFIED.city}, {VERIFIED.address}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5" />
              {VERIFIED.hours}
            </span>
          </div>
          <span>
            Рейтинг {VERIFIED.rating} в 2ГИС · {VERIFIED.reviewsCount} отзывов
          </span>
        </div>
      </div>

      <div
        className={cn(
          "container-page flex items-center justify-between gap-4 transition-all duration-300",
          scrolled ? "h-16" : "h-18",
        )}
      >
        <a href="#top" className="group flex items-center gap-3" aria-label="Lux Car — на главную">
          <span className="relative grid size-10 place-items-center rounded-xl border border-white/12 bg-white/[0.04]">
            <span
              aria-hidden
              className="font-display text-[15px] leading-none font-bold tracking-tight text-white"
            >
              LC
            </span>
            <span
              aria-hidden
              className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[17px] font-bold tracking-[0.16em] text-white">
              LUX<span className="text-accent-500">CAR</span>
            </span>
            <span className="mt-1 text-[10px] tracking-[0.22em] text-white/35 uppercase">
              Автосервис · Семей
            </span>
          </span>
        </a>

        <nav aria-label="Основная навигация" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-white/65 transition hover:bg-white/[0.05] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={VERIFIED.phoneHref}
            className="press hidden h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-sm font-medium text-white/85 transition hover:border-white/28 hover:text-white sm:inline-flex"
          >
            <Phone aria-hidden className="size-4 text-accent-400" />
            {VERIFIED.phone}
          </a>

          <button
            type="button"
            onClick={() => openBooking()}
            aria-haspopup="dialog"
            className="sheen press hidden h-11 items-center rounded-xl bg-accent-500 px-5 text-sm font-semibold text-ink-950 shadow-[0_16px_40px_-18px_rgba(255,122,26,0.75)] transition hover:bg-accent-400 sm:inline-flex"
          >
            Записаться
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            className="press grid size-11 place-items-center rounded-xl border border-white/12 text-white transition hover:border-white/28 lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen ? (
        <div className="animate-fade-in fixed inset-0 z-100 bg-ink-950/97 backdrop-blur-xl lg:hidden">
          <div className="container-page flex h-18 items-center justify-between">
            <span className="font-display text-[17px] font-bold tracking-[0.16em] text-white">
              LUX<span className="text-accent-500">CAR</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Закрыть меню"
              className="grid size-11 place-items-center rounded-xl border border-white/12 text-white"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <nav
            aria-label="Мобильная навигация"
            className="container-page flex flex-col gap-1 pt-4"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/[0.06] py-4 text-lg font-medium text-white/85 transition hover:text-accent-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="container-page mt-6 space-y-3">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openBooking();
              }}
              className="press h-14 w-full rounded-xl bg-accent-500 text-[15px] font-semibold text-ink-950"
            >
              Записаться на обслуживание
            </button>
            <a
              href={VERIFIED.phoneHref}
              className="press flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/14 text-[15px] font-medium text-white"
            >
              <Phone aria-hidden className="size-4 text-accent-400" />
              {VERIFIED.phone}
            </a>
            <p className="pt-2 text-center text-xs text-white/40">
              {VERIFIED.address} · {VERIFIED.hours}
            </p>
          </div>
        </div>
      ) : null}
    </header>
  );
}

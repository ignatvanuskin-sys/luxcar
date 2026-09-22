"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, Phone } from "lucide-react";

import { useBooking } from "@/components/booking/booking-provider";
import { VERIFIED } from "@/lib/company";
import { cn } from "@/lib/utils";

/**
 * Sticky bottom action bar for phones: calling stays one tap away and booking
 * remains the visually dominant action.
 */
export function MobileCtaBar() {
  const { openBooking, isOpen } = useBooking();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-80 border-t border-white/[0.08] bg-ink-950/92 px-3 pt-2.5 backdrop-blur-xl transition-transform duration-300 sm:hidden",
        "pb-[max(0.625rem,env(safe-area-inset-bottom))]",
        visible && !isOpen ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center gap-2.5">
        <a
          href={VERIFIED.phoneHref}
          className="press flex h-12 shrink-0 items-center gap-2 rounded-xl border border-white/14 px-4 text-sm font-medium text-white"
          aria-label={`Позвонить по номеру ${VERIFIED.phone}`}
        >
          <Phone aria-hidden className="size-4 text-accent-400" />
          Позвонить
        </a>
        <button
          type="button"
          onClick={() => openBooking()}
          aria-haspopup="dialog"
          className="sheen press flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-accent-500 text-sm font-semibold text-ink-950 shadow-[0_14px_34px_-16px_rgba(255,122,26,0.85)]"
        >
          <CalendarPlus aria-hidden className="size-4" />
          Записаться
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { Phone, X } from "lucide-react";

import { BookingFlow } from "@/components/booking/booking-flow";
import { VERIFIED } from "@/lib/company";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function BookingModal({
  initialServiceId,
  onClose,
}: {
  initialServiceId?: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  /* Lock page scroll while the dialog is open. */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  /* Focus management: move focus in, keep Tab inside, restore focus on close. */
  useEffect(() => {
    const previousActive = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;

    const items = () =>
      node
        ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (element) => element.offsetParent !== null,
          )
        : [];

    items()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = items();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActive?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-100 flex items-end justify-center overflow-y-auto overscroll-contain bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
        /* min-w-0 is required: without it this flex item grows to the
           min-content width of the time-slot row (~940px) and gets clipped on
           narrow phones instead of scrolling internally. */
        className="animate-pop-in panel relative my-0 min-w-0 w-full max-w-2xl rounded-t-3xl border-x-0 border-b-0 sm:my-8 sm:rounded-3xl sm:border-x sm:border-b"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-7 sm:py-5">
          <div className="space-y-1">
            <h2 id="booking-dialog-title" className="text-lg font-semibold sm:text-xl">
              Запись в Lux Car
            </h2>
            <p className="text-[13px] text-white/50">
              {VERIFIED.category} · {VERIFIED.city} · {VERIFIED.address}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={VERIFIED.phoneHref}
              aria-label={`Позвонить в сервис ${VERIFIED.phone}`}
              className="grid size-10 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:border-white/25 hover:text-white"
            >
              <Phone aria-hidden className="size-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть окно записи"
              className="grid size-10 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:border-white/25 hover:text-white"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>
        </div>

        <BookingFlow initialServiceId={initialServiceId} onClose={onClose} compact />
      </div>
    </div>
  );
}

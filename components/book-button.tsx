"use client";

import type { ReactNode } from "react";

import { useBooking } from "@/components/booking/booking-provider";
import { ButtonLink, buttonClass } from "@/components/ui";

/**
 * Single entry point for the primary conversion action, so every CTA on the page
 * behaves identically: it opens the booking dialog with the relevant service
 * pre-selected. Renders a plain link when `href` is provided.
 *
 * `sheen` adds the slow light sweep reserved for the main CTA (at most one per
 * screen), so the page never turns into a light show.
 */
export function BookButton({
  children,
  serviceId,
  variant = "primary",
  size = "md",
  className,
  href,
  sheen = false,
  wrap = false,
}: {
  children: ReactNode;
  serviceId?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  sheen?: boolean;
  /** Let a long label break onto a second line inside narrow containers. */
  wrap?: boolean;
}) {
  const { openBooking } = useBooking();
  const classes = buttonClass(
    variant,
    size,
    sheen ? `sheen ${className ?? ""}` : className,
    wrap,
  );

  if (href) {
    return (
      <ButtonLink href={href} variant={variant} size={size} className={classes}>
        {children}
      </ButtonLink>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openBooking(serviceId)}
      aria-haspopup="dialog"
      className={classes}
    >
      {children}
    </button>
  );
}

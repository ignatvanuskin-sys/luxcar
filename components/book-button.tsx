"use client";

import type { ReactNode } from "react";

import { useBooking } from "@/components/booking/booking-provider";
import { ButtonLink, buttonClass } from "@/components/ui";

/**
 * Single entry point for the primary conversion action, so every CTA on the page
 * behaves identically: it opens the booking dialog with the relevant service
 * pre-selected. Renders a plain link when `href` is provided.
 */
export function BookButton({
  children,
  serviceId,
  variant = "primary",
  size = "md",
  className,
  href,
}: {
  children: ReactNode;
  serviceId?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}) {
  const { openBooking } = useBooking();

  if (href) {
    return (
      <ButtonLink href={href} variant={variant} size={size} className={className}>
        {children}
      </ButtonLink>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openBooking(serviceId)}
      aria-haspopup="dialog"
      className={buttonClass(variant, size, className)}
    >
      {children}
    </button>
  );
}

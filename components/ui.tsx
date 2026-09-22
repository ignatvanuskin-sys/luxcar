import type { ComponentProps, ReactNode } from "react";
import { Loader2, Star } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-500 text-ink-950 shadow-[0_16px_40px_-18px_rgba(255,122,26,0.75)] hover:bg-accent-400 active:bg-accent-600 font-semibold",
  secondary:
    "border border-white/14 bg-white/[0.04] text-white hover:border-white/28 hover:bg-white/[0.08] font-medium",
  ghost: "text-white/70 hover:text-white hover:bg-white/[0.06] font-medium",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13px] rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-14 px-7 text-[15px] rounded-xl gap-2.5",
};

/**
 * Shared with the client-side booking CTA so every button stays identical.
 *
 * `wrap` drops `whitespace-nowrap`. It exists because a nowrap label raises the
 * min-content width of everything above it, which pushes grid/flex tracks wider
 * than the viewport on narrow phones (that is how the contacts cards ended up
 * bleeding 9px off a 320px screen). Use it in tight containers so the label can
 * break onto a second line instead.
 */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
  wrap = false,
): string {
  return cn(
    "inline-flex select-none items-center justify-center",
    !wrap && "whitespace-nowrap",
    "press disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, size, className)}
    >
      {loading ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : null}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<"a"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a {...props} className={buttonClass(variant, size, className)}>
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

type BadgeProps = ComponentProps<"span"> & {
  tone?: "neutral" | "accent" | "outline";
};

export function Badge({ children, className, tone = "neutral", ...props }: BadgeProps) {
  const tones = {
    neutral: "border-white/10 bg-white/[0.05] text-white/70",
    accent: "border-accent-500/35 bg-accent-500/12 text-accent-300",
    outline: "border-white/12 bg-transparent text-white/55",
  } as const;

  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Badge tone="accent">{eyebrow}</Badge> : null}
      <h2 className="max-w-3xl text-3xl leading-[1.1] font-semibold sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-[15px] leading-relaxed text-white/60 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Stars({
  rating,
  className,
  size = 14,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Оценка ${rating} из 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          style={{ width: size, height: size }}
          className={
            index < Math.round(rating)
              ? "fill-accent-500 text-accent-500"
              : "text-white/20"
          }
        />
      ))}
    </span>
  );
}

/** Discreet marker for anything that is template content, not a fact. */
export function DemoChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-dashed border-white/20 px-1.5 py-0.5 text-[10px] leading-none font-medium tracking-wider text-white/45 uppercase",
        className,
      )}
      title="Демонстрационный элемент. Требует подтверждения владельцем."
    >
      Демо
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton", className)} />;
}

/** 3x3 dot-matrix loader used while a request is in flight. */
export function DotLoader({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("dot-loader", className)}>
      {Array.from({ length: 9 }, (_, index) => (
        <span key={index} />
      ))}
    </span>
  );
}

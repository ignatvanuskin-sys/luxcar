import { cn, formatCount } from "@/lib/utils";

/**
 * Number that counts up the first time it scrolls into view.
 *
 * The final value is rendered on the server (so it is correct for SEO, for
 * readers without JS and before hydration); `components/motion-observer.tsx`
 * animates from zero only when motion is allowed — see the pre-paint flag in
 * `app/layout.tsx`, which prevents any flash of the final number.
 */
export function CountUp({
  value,
  decimals = 0,
  durationMs = 900,
  className,
}: {
  value: number;
  decimals?: number;
  durationMs?: number;
  className?: string;
}) {
  const formatted = formatCount(value, decimals);

  return (
    <span
      data-count-to={value}
      data-count-decimals={decimals}
      data-count-duration={durationMs}
      className={cn("tabular-nums", className)}
    >
      {formatted}
    </span>
  );
}

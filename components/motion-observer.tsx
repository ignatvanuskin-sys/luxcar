"use client";

import { useEffect } from "react";

import { formatCount } from "@/lib/utils";

/**
 * One client component driving every scroll-dependent piece of motion:
 *
 * 1. Counters (`[data-count-to]`) count up the first time they become visible.
 *    They are server-rendered with their final value and only hidden while the
 *    pre-paint flag `html[data-motion="on"]` is set, so there is never a flash
 *    of the final number, and without JS the plain value stays on screen.
 * 2. Ambient border beams (`.beam`) pause while off-screen, so a phone never
 *    repaints an invisible gradient.
 *
 * Content that arrives later (the admin table after its fetch) is picked up by
 * a MutationObserver, otherwise such elements would stay hidden forever.
 *
 * Everything is a no-op under `prefers-reduced-motion: reduce`.
 */
export function MotionObserver() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsObserver = typeof IntersectionObserver !== "undefined";
    const animate = !prefersReduced && supportsObserver;

    const animateCounter = (element: HTMLElement) => {
      const target = Number(element.dataset.countTo ?? "0");
      const decimals = Number(element.dataset.countDecimals ?? "0");
      const duration = Number(element.dataset.countDuration ?? "900");

      element.classList.add("is-counted");

      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutExpo: quick off the mark, settles gently on the value.
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        element.textContent = formatCount(target * eased, decimals);
        if (progress < 1) requestAnimationFrame(tick);
        else element.textContent = formatCount(target, decimals);
      };

      element.textContent = formatCount(0, decimals);
      requestAnimationFrame(tick);
    };

    const counterObserver = animate
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              animateCounter(entry.target as HTMLElement);
              counterObserver?.unobserve(entry.target);
            });
          },
          { threshold: 0.4 },
        )
      : undefined;

    const beamObserver = animate
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const element = entry.target as HTMLElement;
              element.dataset.motionPaused = entry.isIntersecting ? "false" : "true";
            });
          },
          { rootMargin: "120px" },
        )
      : undefined;

    const registered = new WeakSet<Element>();

    const register = () => {
      document
        .querySelectorAll<HTMLElement>("[data-count-to]")
        .forEach((counter) => {
          if (registered.has(counter)) return;
          registered.add(counter);
          if (counterObserver) counterObserver.observe(counter);
          else counter.classList.add("is-counted");
        });

      document.querySelectorAll<HTMLElement>(".beam").forEach((beam) => {
        if (registered.has(beam)) return;
        registered.add(beam);
        if (beamObserver) {
          beam.dataset.motionPaused = "true";
          beamObserver.observe(beam);
        }
      });
    };

    register();

    /* Later-mounted content (skeletons replaced by data, opened dialogs) */
    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(register);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      counterObserver?.disconnect();
      beamObserver?.disconnect();
    };
  }, []);

  return null;
}

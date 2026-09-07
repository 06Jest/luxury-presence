"use client";

import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/** Counts up from 0 to `value` once it scrolls into view. Renders the final value up front for SSR/no-JS. */
export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

    if (prefersReducedMotion()) {
      el.textContent = format(value);
      return;
    }

    el.textContent = format(0);
    const counter = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        value,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = format(counter.value);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
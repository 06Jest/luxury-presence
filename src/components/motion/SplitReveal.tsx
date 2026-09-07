"use client";

import { useRef, type ReactNode } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type SplitRevealProps = {
  children: ReactNode;
  className?: string;
  by?: "lines" | "words";
  delay?: number;
};

/**
 * Masks each line/word behind an overflow-hidden clip and slides it up into place —
 * a step beyond Reveal's block fade, used for the serif section headings.
 */
export function SplitReveal({
  children,
  className,
  by = "lines",
  delay = 0,
}: SplitRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      split = new SplitText(el, { type: by, mask: by });
      const targets = by === "words" ? split.words : split.lines;
      if (targets.length === 0) return;

      gsap.set(targets, { yPercent: 110 });
      gsap.to(targets, {
        yPercent: 0,
        duration: 1,
        delay,
        ease: "power4.out",
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [by, delay]);

    return (
    <h2 ref={ref} className={className}>
      {children}
    </h2>
  );
}
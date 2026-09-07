"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: boolean;
};

export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  stagger = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets = stagger ? Array.from(el.children) : [el];
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 16 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: "power2.out",
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [delay, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

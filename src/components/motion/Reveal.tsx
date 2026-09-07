"use client";

import { useRef, type ReactNode } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  as?: "div" | "section" | "article" | "main" | "span";
  className?: string;
  delay?: number;
  stagger?: boolean;
};

export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  stagger = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

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
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [delay, stagger]);

  if (as === "section") {
    return (
      <section ref={ref as React.RefObject<HTMLElement>} className={className}>
        {children}
      </section>
    );
  }

  if (as === "article") {
    return (
      <article ref={ref as React.RefObject<HTMLElement>} className={className}>
        {children}
      </article>
    );
  }

  if (as === "main") {
    return (
      <main ref={ref as React.RefObject<HTMLElement>} className={className}>
        {children}
      </main>
    );
  }

  if (as === "span") {
    return (
      <span ref={ref as React.RefObject<HTMLElement>} className={className}>
        {children}
      </span>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
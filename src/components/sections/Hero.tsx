"use client";

import Image from "next/image";
import { useRef } from "react";

import { HeroHouse } from "@/components/motion/HeroHouse";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { site } from "@/lib/site";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.fromTo(
        "[data-hero-image]",
        { scale: 1.08 },
        {
          scale: 1,
          duration: 2.4,
          ease: "power2.out",
        },
        0,
      )
        .fromTo(
          lines,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.12,
          },
          0.25,
        )
        .fromTo(
          "[data-hero-fade]",
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
          },
          0.9,
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative isolate min-h-[92svh] overflow-hidden"
    >
      {/* Hero background */}
      <div className="absolute inset-0 -z-10">
        <div
          data-hero-image
          className="relative h-full w-full will-change-transform"
        >
          <Image
            src="/images/pahrump-mountain-falls-pond.jpg"
            alt="Pahrump homes along a green fairway and pond, with the Nevada mountains behind"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/45 via-ink-900/20 to-ink-900/65" />
      </div>

      <Container className="flex min-h-[92svh] flex-col justify-end pb-16 pt-32 sm:pb-24 lg:pb-28">
       <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(480px,600px)] lg:gap-12">
          {/* Hero copy */}
          <div className="max-w-3xl text-sand-50">
            <p
              data-hero-fade
              className="eyebrow text-sand-50/80"
            >
              {site.agent} · {site.brokerage}
            </p>

            <h1 className="mt-6 font-serif text-[clamp(2.25rem,7vw,4.75rem)] leading-[1.08] tracking-tight">
              <span data-hero-line className="block">
                A home in Pahrump
              </span>

              <span data-hero-line className="block">
                you&rsquo;ll stay in for years.
              </span>
            </h1>

            <p
              data-hero-fade
              className="mt-8 max-w-xl text-base leading-relaxed text-sand-50/85 sm:text-lg"
            >
              {site.experience}, helping buyers and sellers across the
              valley. We live, work, and play in this community.
            </p>

            <div
              data-hero-fade
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <ButtonLink href="#search">
                Find a home
              </ButtonLink>

              <a
                href={site.phone.href}
                className="inline-flex items-center gap-3 border border-sand-50/45 px-7 py-3.5 text-[0.8125rem] uppercase tracking-[0.16em] text-sand-50 transition-colors duration-300 hover:bg-sand-50/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand-50"
              >
                Call {site.phone.display}
              </a>
            </div>
          </div>

          {/* Interactive house signature */}
          <div
            data-hero-fade
            className="hidden xl:block"
          >
            <HeroHouse className="w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
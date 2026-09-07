
"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

type CardWidth = "base" | "lg";
type CardOffset = "none";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating?: 4 | 5;
  quote: string;
  sourceLabel: string;
  sourceUrl: string;
  width: CardWidth;
  offset: CardOffset;
}

/**
 * Verified third-party feedback specifically about Marci Metzger.
 *
 * IMPORTANT:
 * These are sourced from public pages that specifically identify Marci.
 * No testimonial below is attributed to Marci herself.
 */
const TESTIMONIALS: Testimonial[] = [
  {
    id: "desiree",
    name: "Desiree Barragan-Reich",
    role: "Client review · 2016",
    rating: 4,
    quote: "I would recommend Marci Metzger.",
    sourceLabel: "Check source →",
    sourceUrl:
      "https://www.driggstitle.com/reviews/Marci_Metzger/4775_E_Lorenzo_Pahrump_89061_5.html",
    width: "lg",
    offset: "none",
  },
  {
    id: "anonymous-client",
    name: "Anonymous client",
    role: "Client review",
    quote:
      "Marci is the BEST! Prompt, organized, informative and most helpful! Did an excellent job in selling our home!",
    sourceLabel: "Check source →",
    sourceUrl: "https://industryoversight.com/realtors/pahrump-nye-nv/",
    width: "base",
    offset: "none",
  },
  {
    id: "roy-mccann",
    name: "Roy McCann",
    role: "California & Nevada Real Estate Broker",
    quote: "She's a professional.",
    sourceLabel: "Check source →",
    sourceUrl:
      "https://www.linkedin.com/posts/roy-mccann_i-am-a-california-and-nevada-real-estate-activity-7403155295939780610-JptK",
    width: "lg",
    offset: "none",
  },
];

const WIDTH_CLASSES: Record<CardWidth, string> = {
  base: "w-[280px] sm:w-[330px]",
  lg: "w-[300px] sm:w-[380px]",
};

const OFFSET_CLASSES: Record<CardOffset, string> = {
  none: "",
};

function StarRating({ rating }: { rating: 4 | 5 }) {
  return (
    <div className="flex items-center gap-1 text-sm tracking-[0.2em] text-terracotta-600">
      <span aria-hidden="true">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </span>

      <span className="sr-only">Rated {rating} out of 5 stars</span>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  hidden,
}: {
  testimonial: Testimonial;
  hidden?: boolean;
}) {
  return (
    <figure
      aria-hidden={hidden ? "true" : undefined}
      tabIndex={hidden ? -1 : undefined}
      className={`group/card flex shrink-0 flex-col justify-between rounded-sm border border-clay-200 bg-white px-7 py-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_-28px_rgba(38,28,20,0.4)] ${WIDTH_CLASSES[testimonial.width]} ${OFFSET_CLASSES[testimonial.offset]}`}
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-400">
            Client & Industry Feedback
          </p>

          {testimonial.rating ? (
            <StarRating rating={testimonial.rating} />
          ) : null}
        </div>

        <blockquote className="mt-5 text-[1.05rem] leading-relaxed text-ink-900">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </div>

      <figcaption className="mt-7 border-t border-clay-200 pt-4">
        <p className="font-serif text-lg font-medium text-ink-900">
          {testimonial.name}
        </p>

        <p className="mt-1 text-sm text-ink-400">{testimonial.role}</p>

        <a
          href={testimonial.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex text-xs font-medium uppercase tracking-[0.16em] text-terracotta-600 transition-colors hover:text-ink-900"
          tabIndex={hidden ? -1 : undefined}
        >
          {testimonial.sourceLabel}
        </a>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === "undefined") return false;

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handleChange(event: MediaQueryListEvent) {
      setReduceMotion(event.matches);
    }

    query.addEventListener("change", handleChange);

    return () => {
      query.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <Section
      id="testimonials"
      labelledBy="testimonials-heading"
      className="bg-white"
    >
      <Reveal stagger>
        <Eyebrow>What People Say</Eyebrow>

        <h2
          id="testimonials-heading"
          className="mt-6 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-tight text-ink-900"
        >
          Trusted by the people
          <br className="hidden sm:block" /> she has helped.
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
          Real feedback from clients and fellow real estate professionals,
          sourced from publicly available reviews and endorsements.
        </p>
      </Reveal>

      <Reveal className="mt-14">
        <div
          className={`rr-testimonials-marquee relative w-full ${
            reduceMotion ? "overflow-x-auto pb-2" : "overflow-hidden"
          }`}
          role="region"
          aria-label="Verified feedback about Marci Metzger"
        >
          <div className="rr-testimonials-track flex items-stretch gap-6 pr-6 pt-3">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard
                key={`a-${testimonial.id}`}
                testimonial={testimonial}
              />
            ))}

            {!reduceMotion &&
              TESTIMONIALS.map((testimonial) => (
                <TestimonialCard
                  key={`b-${testimonial.id}`}
                  testimonial={testimonial}
                  hidden
                />
              ))}
          </div>
        </div>
      </Reveal>

      <style>{`
        .rr-testimonials-track {
          width: max-content;
          animation: rr-testimonials-scroll 42s linear infinite;
        }

        .rr-testimonials-marquee:hover .rr-testimonials-track,
        .rr-testimonials-marquee:focus-within .rr-testimonials-track {
          animation-play-state: paused;
        }

        .rr-testimonials-marquee.overflow-x-auto .rr-testimonials-track {
          animation: none;
          transform: none;
        }

        @keyframes rr-testimonials-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rr-testimonials-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </Section>
  );
}

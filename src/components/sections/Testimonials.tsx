
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
    id: "brent-r",
    name: "Brent R.",
    role: "Client · Yelp · 2024",
    rating: 5,
    quote:
      "Marci is by far the most professional realtor I have ever worked with. I have purchased about 15 homes in all and have had many different realtors involved in the transactions. Mostly good experiences but none compare to the professionalism that was given by Marci.",
    sourceLabel: "View on Yelp →",
    sourceUrl:
      "https://www.yelp.com/biz/marci-metzger-the-ridge-realty-pahrump",
    width: "lg",
    offset: "none",
  },

  {
    id: "cheryl-t",
    name: "Cheryl T.",
    role: "Client · Yelp · 2025",
    rating: 5,
    quote:
      "Very professional and knowledgeable. Trying to price your home right the first time when listing. Would recommend her and her company.",
    sourceLabel: "View on Yelp →",
    sourceUrl:
      "https://www.yelp.com/biz/marci-metzger-the-ridge-realty-pahrump",
    width: "base",
    offset: "none",
  },

  {
    id: "teresa-l",
    name: "Teresa L.",
    role: "Client · Yelp · 2022",
    rating: 5,
    quote:
      "Professional, friendly and knows her profession well. Pahrump is lucky to have her 30+ years of experience.",
    sourceLabel: "View on Yelp →",
    sourceUrl:
      "https://www.yelp.com/biz/marci-metzger-the-ridge-realty-pahrump",
    width: "lg",
    offset: "none",
  },

  {
    id: "tina-h",
    name: "Tina H.",
    role: "Client · Yelp · 2017",
    rating: 5,
    quote:
      "I had a weekend to find a home to buy. She actually found TWO homes that fit my needs - neither were active listings!",
    sourceLabel: "View on Yelp →",
    sourceUrl:
      "https://www.yelp.com/biz/marci-metzger-the-ridge-realty-pahrump",
    width: "lg",
    offset: "none",
  },

  {
    id: "james-d",
    name: "James D.",
    role: "Professional endorsement · Yelp · 2018",
    rating: 5,
    quote:
      "Real estate agent with all the polish and professionalism you need! Knowledgeable, and so helpful... every step of the way! Top pick for Pahrump!",
    sourceLabel: "View on Yelp →",
    sourceUrl:
      "https://www.yelp.com/biz/marci-metzger-the-ridge-realty-pahrump",
    width: "base",
    offset: "none",
  },

  {
    id: "shannon-k",
    name: "Shannon K.",
    role: "Client · Yelp · 2019",
    rating: 5,
    quote:
      "Marci and Lauren are an amazing team. They are very knowledgeable about real estate and the important details that make home shopping easier and better for their clients.",
    sourceLabel: "View on Yelp →",
    sourceUrl:
      "https://www.yelp.com/biz/marci-metzger-the-ridge-realty-pahrump",
    width: "lg",
    offset: "none",
  },

  {
    id: "desiree",
    name: "Desiree Barragan-Reich",
    role: "Client review · Driggs Title · 2016",
    rating: 4,
    quote: "I would recommend Marci Metzger.",
    sourceLabel: "View source →",
    sourceUrl:
      "https://www.driggstitle.com/reviews/Marci_Metzger/4775_E_Lorenzo_Pahrump_89061_5.html",
    width: "base",
    offset: "none",
  },

  {
    id: "anonymous-client",
    name: "Anonymous client",
    role: "Client review · IndustryOversight",
    rating: 5,
    quote:
      "Marci is the BEST! Prompt, organized, informative and most helpful! Did an excellent job in selling our home!",
    sourceLabel: "View source →",
    sourceUrl:
      "https://industryoversight.com/realtors/pahrump-nye-nv/",
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

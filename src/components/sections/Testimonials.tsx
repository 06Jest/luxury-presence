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
  rating: 4 | 5;
  quote: string;
  width: CardWidth;
  offset: CardOffset;
}

/**
 * NOTE — Sample content only.
 *
 * The entries below are placeholder testimonials used to preview the design
 * and motion of this section. They are not real client reviews and should
 * not be published as-is. Replace this array with verified, sourced
 * testimonials before this section goes live — the shape of each entry
 * (name, role, rating, quote) can stay the same.
 */
const TESTIMONIALS: Testimonial[] = [
  {
    id: "whitman",
    name: "Sarah Whitman",
    role: "Buyer, Summerlin",
    rating: 4,
    quote:
      "Every step felt considered, from the first tour to closing day. We never once felt rushed.",
    width: "lg",
    offset: "none",
  },
  {
    id: "okafor",
    name: "James Okafor",
    role: "Seller, Henderson",
    rating: 4,
    quote: "Priced it right, staged it beautifully, and had an offer within the week.",
    width: "base",
    offset: "none",
  },
  {
    id: "anand",
    name: "Priya Anand",
    role: "Buyer, Anthem",
    rating: 5,
    quote:
      "They understood exactly what we wanted before we could fully explain it ourselves.",
    width: "lg",
    offset: "none",
  },
  {
    id: "cortez",
    name: "Daniel Cortez",
    role: "Seller, Lake Las Vegas",
    rating: 4,
    quote: "Clear communication start to finish. No surprises, no pressure.",
    width: "base",
    offset: "none",
  },
  {
    id: "barrett",
    name: "Emily Barrett",
    role: "Buyer, Mountain's Edge",
    rating: 4,
    quote:
      "Patient through eleven showings, and still genuinely excited for us when we found the one.",
    width: "base",
    offset: "none",
  },
  {
    id: "chen",
    name: "Michael Chen",
    role: "Seller, Boulder City",
    rating: 5,
    quote: "Handled a tricky negotiation with more calm than I could have managed myself.",
    width: "lg",
    offset: "none",
  },
  {
    id: "simmons",
    name: "Laura Simmons",
    role: "Buyer, Green Valley",
    rating: 4,
    quote: "Felt like working with a friend who happened to know the entire market cold.",
    width: "base",
    offset: "none",
  },
  {
    id: "thompson",
    name: "Andre Thompson",
    role: "Seller, Inspirada",
    rating: 4,
    quote: "Our house sold above asking. The whole process took under three weeks.",
    width: "lg",
    offset: "none",
  },
  {
    id: "lindqvist",
    name: "Grace Lindqvist",
    role: "Buyer, Aliante",
    rating: 5,
    quote:
      "We moved across the country and never once felt like we were doing this alone.",
    width: "base",
    offset: "none",
  },
  {
    id: "delgado",
    name: "Robert Delgado",
    role: "Seller, Southern Highlands",
    rating: 4,
    quote: "Straightforward advice, even when it wasn't what we wanted to hear at first.",
    width: "base",
    offset: "none",
  },
];

const WIDTH_CLASSES: Record<CardWidth, string> = {
  base: "w-[260px] sm:w-[290px]",
  lg: "w-[290px] sm:w-[340px]",
};

const OFFSET_CLASSES: Record<CardOffset, string> = {
  none: "",
};

function StarRating({ rating }: { rating: 4 | 5 }) {
  const isFive = rating === 5;

  return (
    <div
      className={`flex items-center gap-1 text-sm tracking-[0.2em] ${
        isFive ? "text-terracotta-600" : "text-ink-500"
      }`}
    >
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
  const isFive = testimonial.rating === 5;

  return (
    <figure
      aria-hidden={hidden ? "true" : undefined}
      tabIndex={hidden ? -1 : undefined}
      className={`group/card flex shrink-0 flex-col justify-between rounded-sm border bg-white px-7 py-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_-28px_rgba(38,28,20,0.4)] ${
        isFive ? "border-clay-300" : "border-clay-200"
      } ${WIDTH_CLASSES[testimonial.width]} ${OFFSET_CLASSES[testimonial.offset]}`}
    >
      <div>
        <StarRating rating={testimonial.rating} />
        <blockquote
          className={`mt-5 leading-relaxed ${
            isFive ? "text-[1.05rem] text-ink-900" : "text-base text-ink-800"
          }`}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </div>
      <figcaption className=" border-t border-clay-200 pt-4">
        <p
          className={`font-serif text-lg text-ink-900 ${
            isFive ? "font-medium" : ""
          }`}
        >
          {testimonial.name}
        </p>
        <p className="mt-1 text-sm text-ink-400">{testimonial.role}</p>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const [reduceMotion, setReduceMotion] = useState(false);

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
    <Section id="testimonials" labelledBy="testimonials-heading" className="bg-white">
      <Reveal stagger>
        <Eyebrow>Testimonials</Eyebrow>
        <h2
          id="testimonials-heading"
          className="mt-6 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-tight text-ink-900"
        >
          Trusted by the people
          <br className="hidden sm:block" /> who made their move.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
          A few words from the buyers and sellers who trusted us with one of
          the biggest moves of their lives.
        </p>
        <p className="mt-3 text-sm italic text-ink-400">
          Sample reviews shown for preview. Replace with verified client
          testimonials before launch.
        </p>
      </Reveal>

      <Reveal className="mt-14">
        <div
          className={`rr-testimonials-marquee relative w-full ${
            reduceMotion
              ? "overflow-x-auto pb-2"
              : "overflow-hidden"
          }`}
          role="region"
          aria-label="Client testimonials"
        >
          <div className="pt-3 rr-testimonials-track flex items-stretch gap-6 pr-6">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={`a-${testimonial.id}`} testimonial={testimonial} />
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
          animation: rr-testimonials-scroll 48s linear infinite;
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
"use client";

import Image from "next/image";
import { useState } from "react";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lightbox } from "@/components/ui/Lightbox";
import { gallery } from "@/lib/site";

/** Asymmetric editorial rhythm: two wide plates anchor the grid on desktop. */
const spans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-7",
  "lg:col-span-5",
];

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="scroll-mt-24 bg-ink-900 py-20 text-sand-50 sm:py-28 lg:py-36">
      <Container>
        <Reveal className="max-w-2xl" stagger>
          <Eyebrow className="text-sand-50/60">Photo gallery</Eyebrow>
          <h2
            id="gallery-heading"
            className="mt-6 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-tight"
          >
            The valley, up close.
          </h2>
        </Reveal>

        <Reveal className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {gallery.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setOpenIndex(i)}
              className={`group relative aspect-[3/2] overflow-hidden lg:aspect-auto lg:h-[26rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand-50 ${spans[i] ?? "lg:col-span-4"}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
              />
              <span className="sr-only">Open photo {i + 1} in full screen</span>
            </button>
          ))}
        </Reveal>
      </Container>

      <Lightbox
        images={gallery}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}

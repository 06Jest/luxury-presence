"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lightbox } from "@/components/ui/Lightbox";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { gallery } from "@/lib/site";

/**
 * Gallery - "The valley, up close."
 *
 * One large featured photograph with a horizontal film-strip of the
 * remaining images underneath. Changing the featured image plays a single
 * clip-path reveal + scale transition (direction-aware: forward reveals
 * left→right, backward right→left). Clicking the featured image opens the
 * existing Lightbox; the film-strip itself never does.
 */

type GalleryImage = (typeof gallery)[number];

const SWIPE_THRESHOLD = 44;

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

// ---------------------------------------------------------------------------
// Featured stage
// ---------------------------------------------------------------------------

function GalleryStage({
  images,
  activeIndex,
  total,
  reduceMotion,
  onOpenLightbox,
  onNext,
  onPrev,
}: {
  images: readonly GalleryImage[];
  activeIndex: number;
  total: number;
  reduceMotion: boolean;
  onOpenLightbox: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRefA = useRef<HTMLDivElement>(null);
  const layerRefB = useRef<HTMLDivElement>(null);
  const layerRefs = [layerRefA, layerRefB];

  const [layerIndices, setLayerIndices] = useState<[number, number]>([activeIndex, activeIndex]);
  const [front, setFront] = useState<0 | 1>(0);
  const prevActiveRef = useRef(activeIndex);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);

  // The one memorable transition: outgoing image eases down and fades while
  // the incoming image clip-reveals from the direction it entered from.
  useIsomorphicLayoutEffect(() => {
    if (activeIndex === prevActiveRef.current) return;
    const from = prevActiveRef.current;
    const forward = ((activeIndex - from + total) % total) <= total / 2;
    prevActiveRef.current = activeIndex;

    const back = front === 0 ? 1 : 0;
    const frontEl = layerRefs[front].current;
    const backEl = layerRefs[back].current;

    setLayerIndices((prev) => {
      const next = [...prev] as [number, number];
      next[back] = activeIndex;
      return next;
    });

    requestAnimationFrame(() => {
      if (!frontEl || !backEl) {
        setFront(back);
        return;
      }

      if (reduceMotion) {
        gsap.set(backEl, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, opacity: 1 });
        gsap.set(frontEl, { opacity: 0 });
        setFront(back);
        return;
      }

      const openClip = forward ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
      gsap.set(backEl, { clipPath: openClip, scale: 1.05, opacity: 1 });
      gsap.set(frontEl, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, opacity: 1 });

      const tl = gsap.timeline({
        defaults: { duration: 0.75, ease: "power3.out" },
        onComplete: () => setFront(back),
      });
      tl.to(backEl, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }, 0);
      tl.to(frontEl, { scale: 0.97, opacity: 0 }, 0);
    });
    // layerRefs is a stable pair of refs; only the index should retrigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, total, reduceMotion]);

  // Subtle scroll parallax, disabled under reduced motion. Purely a transform
  // driven by scroll position - never overrides native scrolling.
  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduceMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.to(stage, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, [reduceMotion]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      suppressClickRef.current = true;
      if (dx < 0) onNext();
      else onPrev();
    }
  };

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onOpenLightbox();
  };

  return (
    <div className="relative">
      <div
        ref={stageRef}
        className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]"
        style={{ touchAction: "pan-y" }}
      >
        <button
          type="button"
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
          className="absolute inset-0 h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand-50"
          aria-label={`Open photo ${activeIndex + 1} of ${total} in full screen`}
        >
          {[0, 1].map((layer) => {
            const idx = layerIndices[layer];
            const image = images[idx];
            const isFront = layer === front;
            return (
              <div
                key={layer}
                ref={layerRefs[layer]}
                className="absolute inset-0 will-change-transform"
                style={{
                  clipPath: "inset(0% 0% 0% 0%)",
                  opacity: isFront ? 1 : 0,
                  zIndex: isFront ? 2 : 1,
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
            );
          })}
        </button>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-4 z-10 hidden items-baseline gap-1.5 font-serif sm:flex"
        >
          <span className="text-2xl tabular-nums text-sand-50">{pad2(activeIndex + 1)}</span>
          <span className="text-sm tabular-nums text-sand-50/50">/ {pad2(total)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-1.5 font-serif sm:hidden" aria-hidden="true">
        <span className="text-xl tabular-nums text-sand-50">{pad2(activeIndex + 1)}</span>
        <span className="text-sm tabular-nums text-sand-50/50">/ {pad2(total)}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Film strip
// ---------------------------------------------------------------------------

function GalleryFilmstrip({
  images,
  activeIndex,
  reduceMotion,
  onSelect,
}: {
  images: readonly GalleryImage[];
  activeIndex: number;
  reduceMotion: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="mt-6 flex gap-3 overflow-x-auto pb-2 sm:mt-8 sm:gap-4"
      style={{ scrollSnapType: "x proximity", scrollBehavior: reduceMotion ? "auto" : "smooth" }}
    >
      {images.map((image, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={image.src}
            type="button"
            onClick={() => onSelect(i)}
            aria-current={active}
            aria-label={`View photo ${i + 1} of ${images.length}`}
            style={{ scrollSnapAlign: "center" }}
            className={`group relative h-20 w-28 flex-none overflow-hidden border transition-[opacity,border-color] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand-50 sm:h-24 sm:w-32 ${
              active
                ? "border-sand-50/80 opacity-100"
                : "border-sand-50/15 opacity-55 hover:opacity-90"
            }`}
          >
            <span
              className={`block h-full w-full transition-transform duration-300 ease-out ${
                active ? "" : "group-hover:-translate-y-1 group-hover:scale-[1.04]"
              }`}
            >
              <Image src={image.src} alt="" fill sizes="(min-width: 640px) 8rem, 7rem" className="object-cover" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Prev / next controls
// ---------------------------------------------------------------------------

function GalleryControls({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div className="mt-6 flex items-center justify-between font-serif text-sm tracking-wide sm:mt-8">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous photo"
        className="inline-flex items-center gap-2 text-sand-50/70 transition-colors hover:text-sand-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand-50"
      >
        <span aria-hidden="true">←</span> Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next photo"
        className="inline-flex items-center gap-2 text-sand-50/70 transition-colors hover:text-sand-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand-50"
      >
        Next <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export function Gallery() {
  const total = gallery.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [reduceMotion] = useState(prefersReducedMotion);

  const goTo = useCallback((i: number) => setActiveIndex(((i % total) + total) % total), [total]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const openLightbox = useCallback(() => setLightboxIndex(activeIndex), [activeIndex]);

  // Arrow-key navigation for the gallery itself - yields entirely to the
  // Lightbox's own keyboard handling while it's open, and ignores keys typed
  // into any text field elsewhere on the page (e.g. Search).
  useEffect(() => {
    if (lightboxIndex !== null) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, next, prev]);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="scroll-mt-24 bg-ink-900 py-20 text-sand-50 sm:py-28 lg:py-36"
    >
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

        <Reveal className="mt-14 lg:mt-16" stagger>
          <GalleryStage
            images={gallery}
            activeIndex={activeIndex}
            total={total}
            reduceMotion={reduceMotion}
            onOpenLightbox={openLightbox}
            onNext={next}
            onPrev={prev}
          />
          <GalleryFilmstrip images={gallery} activeIndex={activeIndex} reduceMotion={reduceMotion} onSelect={goTo} />
          <GalleryControls onPrev={prev} onNext={next} />
        </Reveal>

        <span className="sr-only" aria-live="polite">
          {`Photo ${activeIndex + 1} of ${total}: ${gallery[activeIndex]?.alt ?? ""}`}
        </span>
      </Container>

      <Lightbox
        images={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(i: number) => {
          setLightboxIndex(i);
          setActiveIndex(i);
        }}
      />
    </section>
  );
}
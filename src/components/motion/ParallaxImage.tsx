"use client";

import Image from "next/image";
import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
  /** Drift as a share of the image height; the image is overscaled to match. */
  amount?: number;
};

export function ParallaxImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes,
  priority = false,
  amount = 0.08,
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const frame = frameRef.current;
    const layer = layerRef.current;
    if (!frame || !layer || prefersReducedMotion()) return;

    const shift = amount * 100;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        layer,
        { yPercent: -shift / 2 },
        {
          yPercent: shift / 2,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, frame);

    return () => ctx.revert();
  }, [amount]);

  const overscale = 1 + amount;

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={layerRef}
        className="absolute inset-x-0 will-change-transform"
        style={{ height: `${overscale * 100}%`, top: `${((1 - overscale) / 2) * 100}%` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${imageClassName}`}
        />
      </div>
    </div>
  );
}

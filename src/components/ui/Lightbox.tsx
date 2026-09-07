"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

type LightboxImage = { src: string; alt: string; width: number; height: number };

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: readonly LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = index !== null;

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + images.length) % images.length);
    },
    [images.length, index, onNavigate],
  );

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      else if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [onClose, open, step]);

  if (!open || index === null) return null;
  const image = images[index];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${images.length}`}
      className="fixed inset-0 z-[60] flex flex-col bg-ink-900/95 p-4 sm:p-8"
    >
      <div className="flex items-center justify-between text-sand-50">
        <p className="eyebrow text-sand-50/70">
          {index + 1} / {images.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center border border-sand-50/30 transition-colors duration-300 hover:bg-sand-50/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-50"
        >
          <span className="sr-only">Close gallery</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.25" />
          </svg>
        </button>
      </div>

      <div className="relative mt-4 flex-1">
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-6 text-sand-50">
        <button
          type="button"
          onClick={() => step(-1)}
          className="flex h-11 items-center gap-2 border border-sand-50/30 px-5 text-[0.75rem] uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-sand-50/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-50"
        >
          Previous
        </button>
        <p className="hidden max-w-xl text-center text-sm text-sand-50/70 sm:block">
          {image.alt}
        </p>
        <button
          type="button"
          onClick={() => step(1)}
          className="flex h-11 items-center gap-2 border border-sand-50/30 px-5 text-[0.75rem] uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-sand-50/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

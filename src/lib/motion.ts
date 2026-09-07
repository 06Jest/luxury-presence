export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Shared easing language so scroll reveals, hovers, and the hero motion all feel cut from the same cloth. */
export const EASE_EDITORIAL = "cubic-bezier(0.16, 1, 0.3, 1)";
export const EASE_SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";
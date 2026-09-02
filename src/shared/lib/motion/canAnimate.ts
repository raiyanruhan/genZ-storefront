/**
 * Gate for all page motion.
 * Animations run ONLY on desktop with a real pointer and no reduced-motion request.
 * Mobile / touch / tablet / reduced-motion => instant, no animation.
 */
export function canAnimate(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false

  const isDesktop = window.matchMedia('(min-width: 1024px)').matches
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return isDesktop && hasFinePointer && !prefersReduced
}

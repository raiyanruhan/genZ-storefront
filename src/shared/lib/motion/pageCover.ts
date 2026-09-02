import { ref } from 'vue'

/**
 * Full-screen cover slab controller (singleton).
 *
 * Driven by CSS transitions on `transform` — the browser animates it on the
 * compositor, so the wipe stays smooth even while the next page does heavy
 * synchronous mount work (list render, swiper init, etc.) behind it.
 *
 * coverScreen()  -> slab wipes UP from the bottom, covering the viewport
 * revealScreen() -> slab wipes further UP, off the top, revealing the new page
 *
 * The cover is orchestrated from router guards (see app/providers/router), not
 * from <transition> hooks — that keeps it correct across auth redirects.
 */

/** Must stay in sync with the `transition-duration` in PageCover.vue. */
const DURATION_MS = 500

const coverEl = ref<HTMLElement | null>(null)
const logoShown = ref(false)

let coverPromise: Promise<void> | null = null

export function registerCover(el: HTMLElement): void {
  coverEl.value = el
}

export function useLogoShown() {
  return logoShown
}

function afterTransform(el: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      el.removeEventListener('transitionend', onEnd)
      resolve()
    }
    const onEnd = (e: TransitionEvent) => {
      if (e.target === el && e.propertyName === 'transform') finish()
    }
    el.addEventListener('transitionend', onEnd)
    // Safety net in case transitionend never fires (tab backgrounded, no delta, etc.)
    setTimeout(finish, DURATION_MS + 120)
  })
}

/** Slab covers the screen. Resolves once the viewport is fully hidden. */
export function coverScreen(): Promise<void> {
  const el = coverEl.value
  if (!el) return Promise.resolve()

  el.style.display = 'flex'

  // Snap below the viewport with no transition...
  el.classList.add('page-cover--instant')
  el.style.transform = 'translateY(100%)'
  void el.offsetHeight // force reflow

  // ...then wipe up into view.
  el.classList.remove('page-cover--instant')
  el.style.transform = 'translateY(0)'
  logoShown.value = true

  coverPromise = afterTransform(el)
  return coverPromise
}

/** Resolves when the in-progress cover wipe has finished (or immediately if none). */
export function whenCovered(): Promise<void> {
  return coverPromise ?? Promise.resolve()
}

/** Slab slides off the top, revealing the freshly mounted page. */
export function revealScreen(): Promise<void> {
  const el = coverEl.value
  if (!el) return Promise.resolve()

  logoShown.value = false
  el.style.transform = 'translateY(-100%)'

  return afterTransform(el).then(() => {
    el.style.display = 'none'
    coverPromise = null
  })
}

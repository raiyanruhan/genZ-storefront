import { ref } from 'vue'

/**
 * Full-screen cover slab controller (singleton).
 *
 * The slab is driven by CSS transitions on `transform` — the browser animates it
 * on the compositor, so the wipe stays smooth even while the next page is doing
 * heavy synchronous mount work (list render, swiper init, etc.) behind it.
 * No per-frame JavaScript.
 *
 * coverScreen()  -> slab wipes UP from the bottom, covering the viewport
 * revealScreen() -> slab wipes further UP, off the top, revealing the new page
 */

/** Must stay in sync with the `transition-duration` in PageCover.vue. */
const DURATION_MS = 500

const coverEl = ref<HTMLElement | null>(null)
const label = ref('ZENJI')
const labelShown = ref(false)

/** Skip the cover for nested tab switches (e.g. personal-area profile <-> orders). */
let skipCover = false

export function registerCover(el: HTMLElement): void {
  coverEl.value = el
}

export function setLabel(text: string): void {
  label.value = text
}

export function useCoverLabel() {
  return label
}

export function useLabelShown() {
  return labelShown
}

export function setSkipCover(value: boolean): void {
  skipCover = value
}

export function shouldSkipCover(): boolean {
  return skipCover
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
    // Safety net in case transitionend never fires (tab backgrounded, etc.)
    setTimeout(finish, DURATION_MS + 100)
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
  labelShown.value = true

  return afterTransform(el)
}

/** Slab slides off the top, revealing the freshly mounted page. */
export function revealScreen(): Promise<void> {
  const el = coverEl.value
  if (!el) return Promise.resolve()

  labelShown.value = false
  el.style.transform = 'translateY(-100%)'

  return afterTransform(el).then(() => {
    el.style.display = 'none'
  })
}

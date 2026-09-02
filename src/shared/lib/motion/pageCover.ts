import { ref } from 'vue'
import { gsap } from './gsap'

/**
 * Full-screen cover slab controller (singleton).
 *
 * coverScreen()  -> slab wipes UP over the viewport, label fades in
 * revealScreen() -> slab wipes further UP off-screen, label fades out
 *
 * The <PageCover> component registers its root element here on mount.
 */

const IN_DURATION = 0.6
const OUT_DURATION = 0.6
const EASE = 'expo.inOut'

const coverEl = ref<HTMLElement | null>(null)
const label = ref('ZENJI')

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

export function setSkipCover(value: boolean): void {
  skipCover = value
}

export function shouldSkipCover(): boolean {
  return skipCover
}

function labelNode(el: HTMLElement): Element | null {
  return el.querySelector('.page-cover__label')
}

/** Slab covers the screen. Resolves once the viewport is fully hidden. */
export function coverScreen(): Promise<void> {
  return new Promise(resolve => {
    const el = coverEl.value
    if (!el) return resolve()

    gsap.killTweensOf([el, labelNode(el)])

    gsap
      .timeline({ onComplete: () => resolve() })
      .set(el, { display: 'flex', pointerEvents: 'auto', yPercent: 100 })
      .set(labelNode(el), { opacity: 0, y: 24 })
      .to(el, { yPercent: 0, duration: IN_DURATION, ease: EASE })
      .to(
        labelNode(el),
        { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' },
        `-=${IN_DURATION * 0.45}`
      )
  })
}

/** Slab slides off the top, revealing the freshly mounted page. */
export function revealScreen(): Promise<void> {
  return new Promise(resolve => {
    const el = coverEl.value
    if (!el) return resolve()

    gsap.killTweensOf([el, labelNode(el)])

    gsap
      .timeline({
        onComplete: () => {
          gsap.set(el, { display: 'none', pointerEvents: 'none' })
          resolve()
        }
      })
      .to(labelNode(el), { opacity: 0, y: -24, duration: 0.2, ease: 'power2.in' })
      .to(el, { yPercent: -100, duration: OUT_DURATION, ease: EASE }, '-=0.04')
  })
}

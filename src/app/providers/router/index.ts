import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import { routes } from './routes'
import { canAnimate, coverScreen, revealScreen, whenCovered } from '@/shared/lib/motion'

export { pages as AppPages } from './pages'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/**
 * Page-transition cover slab, orchestrated from router guards.
 *
 * Driving it here (rather than from <transition> hooks) keeps it correct when a
 * navigation is redirected mid-flight — e.g. the personal-area auth guard sending
 * an unauthenticated visitor back to `/`. `afterEach` fires once, after all
 * redirects resolve, so the slab always lifts again.
 */

let coverActive = false

/** Skip the cover: first paint, same page, or a nested tab switch within one section. */
function skipCover(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean {
  if (!from.name || !canAnimate() || to.path === from.path) return true

  const nestedTabSwitch =
    to.matched.length > 1 &&
    from.matched.length > 1 &&
    to.matched[0].path === from.matched[0].path

  return nestedTabSwitch
}

const settle = (): Promise<void> =>
  new Promise(resolve => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const ric = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
          .requestIdleCallback
        if (ric) ric(() => resolve(), { timeout: 450 })
        else setTimeout(resolve, 200)
      })
    )
  })

router.beforeEach((to, from) => {
  if (coverActive || skipCover(to, from)) return
  coverActive = true
  // Fire and forget: the page loads / mounts while the slab wipes down.
  void coverScreen()
})

router.afterEach(async () => {
  if (!coverActive) return
  coverActive = false

  await whenCovered()
  await settle()
  window.scrollTo(0, 0)
  await revealScreen()
})

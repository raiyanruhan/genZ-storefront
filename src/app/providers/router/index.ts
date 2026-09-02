import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setSkipCover } from '@/shared/lib/motion'

export { pages as AppPages } from './pages'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/**
 * Suppress the cover slab for nested tab switches within the same section
 * (e.g. personal-area: profile <-> orders <-> wallet). Full page changes still cover.
 */
router.beforeEach((to, from) => {
  const nestedTabSwitch =
    !!from.name &&
    to.matched.length > 1 &&
    from.matched.length > 1 &&
    to.matched[0].path === from.matched[0].path

  setSkipCover(nestedTabSwitch)
})

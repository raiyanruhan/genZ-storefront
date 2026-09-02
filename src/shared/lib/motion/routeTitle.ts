import type { RouteLocationNormalizedLoaded } from 'vue-router'

/** Label painted on the cover slab while the next page loads. */
export function titleOf(route: RouteLocationNormalizedLoaded): string {
  const title = route.meta?.title
  return typeof title === 'string' && title.length > 0 ? title : 'ZENJI'
}

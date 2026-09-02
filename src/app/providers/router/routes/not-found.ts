import type { RouteRecordRaw } from 'vue-router'

export const routeName = 'NotFoundPage'

export const route: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: routeName,
  meta: {
    layout: 'empty',
    title: '404'
  },
  component: () => import('@/pages/not-found')
}

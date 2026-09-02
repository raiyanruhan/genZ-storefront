import type { RouteRecordRaw } from 'vue-router'

export const routeName = 'MainPage'

export const route: RouteRecordRaw = {
  name: routeName,
  path: '/',
  meta: { title: 'ZENJI' },
  component: () => import('@/pages/main')
}

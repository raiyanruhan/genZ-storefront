import type { RouteRecordRaw } from 'vue-router'

export const routeName: string = 'CategoryPage'

export const route: RouteRecordRaw = {
  name: routeName,
  path: '/category/:category',
  meta: { title: 'Category' },
  component: () => import('@/pages/category')
}

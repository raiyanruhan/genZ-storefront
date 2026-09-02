import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { TProductCategory } from '../../model'
import { Api } from '../../api'
import { refreshArray } from '@/shared/lib/utils/array'

interface IProductCategoriesStore {
  categories: TProductCategory[]
  getCategories: () => Promise<void>
}

const NAMESPACE = 'product-categories'

export const useProductCategoriesStore = defineStore(NAMESPACE, (): IProductCategoriesStore => {
  const categories = reactive<TProductCategory[]>([])

  async function getCategories() {
    const { data } = await Api.getCategories()
    const excludedCategories = [
      'beauty',
      'fragrances',
      'furniture',
      'groceries',
      'home-decoration',
      'kitchen-accessories',
      'skin-care',
      'womens-bags',
      'womens-dresses',
      'womens-jewellery',
      'womens-shoes',
      'womens-watches'
    ]
    const filtered = data.filter(cat => !excludedCategories.includes(cat.slug))
    refreshArray(categories, filtered)
  }

  return {
    categories,
    getCategories
  }
})

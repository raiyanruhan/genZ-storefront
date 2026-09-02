<template>
  <div class="container">
    <h1 class="mb-xxs">ZENJI</h1>
    <h3 class="mb-m">an anime-inspired streetwear brand</h3>

    <div class="column gap-l mb-l">
      <ProductList
        :products="currentPageProducts"
        :is-loading="isLoading"
      />

      <VPagination
        :model-value="page"
        :count="countPages"
        :is-disabled="isLoading"
        @update:model-value="loadPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductList } from '@/widgets/Product/ProductList'
import { VPagination } from '@/shared/ui/pagination'

import { onBeforeMount, computed, ref } from 'vue'
import { ProductApi, ProductModel } from '@/entities/Product'
import { useIsLoading } from '@/shared/lib/use/useIsLoading'

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

const { isLoading, startLoading, finishLoading } = useIsLoading()

const allProducts = ref<ProductModel.IProduct[]>([])
const page = ref(1)
const limit = 30

const filteredProducts = computed(() => {
  return allProducts.value
    .filter(p => !excludedCategories.includes(p.category))
    .sort((a, b) => {
      const isAShirt = a.category === 'mens-shirts'
      const isBShirt = b.category === 'mens-shirts'
      if (isAShirt && !isBShirt) return -1
      if (!isAShirt && isBShirt) return 1
      return 0
    })
})

const countPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / limit) || 1
})

const currentPageProducts = computed(() => {
  const start = (page.value - 1) * limit
  const end = start + limit
  return filteredProducts.value.slice(start, end)
})

const loadPage = (num: number) => {
  page.value = num
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onBeforeMount(async () => {
  try {
    startLoading()
    const { data } = await ProductApi.getAll({ limit: 0 })
    allProducts.value = ProductModel.getMapped(data)
  } catch (e) {
    console.error(e)
  } finally {
    finishLoading()
  }
})
</script>

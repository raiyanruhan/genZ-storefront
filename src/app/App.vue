<template>
  <div class="app-bg" />
  <EmptyLayout v-if="isEmptyLayout" />

  <MainLayout v-else>
    <template v-slot:header>
      <TheHeader />
    </template>

    <TheBurgerMenu>
      <ProductCategories />
    </TheBurgerMenu>
  </MainLayout>

  <ButtonScrollTop />

  <TheAlerts />

  <PageCover />
</template>

<script setup lang="ts">
import './styles/index.scss'

import { TheHeader } from '@/widgets/TheHeader'

import { PageCover } from '@/shared/ui/PageCover'
import { MainLayout, EmptyLayout } from '@/shared/ui/layouts'
import { TheBurgerMenu } from '@/shared/ui/TheBurgerMenu'
import { TheAlerts } from '@/shared/ui/TheAlerts'
import { ButtonScrollTop } from '@/shared/ui/buttons'

import { computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import { EAppProviders, AppRoutes, useAppStore } from './providers'
import { AppPages } from './providers/router'
import { ProductCategories } from '@/entities/Product'

provide(EAppProviders.AppRoutes, AppRoutes)
provide(EAppProviders.AppPages, AppPages)

useAppStore()

const route = useRoute()
const isEmptyLayout = computed(() => route.meta.layout === 'empty')
</script>

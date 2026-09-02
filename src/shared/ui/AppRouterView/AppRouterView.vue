<template>
  <router-view v-slot="{ Component }">
    <transition
      :css="false"
      mode="out-in"
      @leave="onLeave"
      @enter="onEnter"
    >
      <component
        :is="Component"
        :key="pageKey"
      />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { canAnimate } from '@/shared/lib/motion/canAnimate'
import { titleOf } from '@/shared/lib/motion/routeTitle'
import { coverScreen, revealScreen, setLabel, shouldSkipCover } from '@/shared/lib/motion/pageCover'

const route = useRoute()

/**
 * Key by path (not full URL): a real page change retriggers the transition,
 * a query-only change (filter / sort / pagination) does not.
 */
const pageKey = computed(() => route.path)

const twoFrames = () =>
  new Promise<void>(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })

async function onLeave(_el: Element, done: () => void): Promise<void> {
  if (!canAnimate() || shouldSkipCover()) return done()
  setLabel(titleOf(route))
  await coverScreen()
  done()
}

async function onEnter(_el: Element, done: () => void): Promise<void> {
  if (!canAnimate() || shouldSkipCover()) return done()
  window.scrollTo(0, 0)
  await twoFrames()
  await revealScreen()
  done()
}
</script>

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
import { coverScreen, revealScreen, shouldSkipCover } from '@/shared/lib/motion/pageCover'

const route = useRoute()

/**
 * Key by path (not full URL): a real page change retriggers the transition,
 * a query-only change (filter / sort / pagination) does not.
 */
const pageKey = computed(() => route.path)

/** Two frames, then an idle slice — lets the new page finish mounting behind the cover. */
function settle(): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const ric = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
          .requestIdleCallback
        if (ric) ric(() => resolve(), { timeout: 450 })
        else setTimeout(resolve, 200)
      })
    )
  })
}

async function onLeave(_el: Element, done: () => void): Promise<void> {
  if (!canAnimate() || shouldSkipCover()) return done()
  await coverScreen()
  done()
}

async function onEnter(_el: Element, done: () => void): Promise<void> {
  if (!canAnimate() || shouldSkipCover()) return done()
  window.scrollTo(0, 0)
  await settle()
  await revealScreen()
  done()
}
</script>

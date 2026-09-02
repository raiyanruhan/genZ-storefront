<template>
  <div
    ref="root"
    class="page-cover"
    :style="initialCover ? 'display: flex; transform: translateY(0);' : undefined"
    aria-hidden="true"
  >
    <span
      class="page-cover__label"
      :class="{ 'is-visible': labelShown }"
    >{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { canAnimate } from '@/shared/lib/motion/canAnimate'
import { registerCover, revealScreen, useCoverLabel, useLabelShown } from '@/shared/lib/motion/pageCover'

const root = ref<HTMLElement | null>(null)
const label = useCoverLabel()
const labelShown = useLabelShown()

/** On desktop the slab is already covering the viewport on first paint. */
const initialCover = ref(canAnimate())

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

onMounted(async () => {
  if (!root.value) return
  registerCover(root.value)

  if (!initialCover.value) return

  labelShown.value = true

  // Hold on the brand until fonts are ready (capped), then lift the slab.
  const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready
  await Promise.race([fontsReady ?? Promise.resolve(), wait(1500)])
  await wait(400)

  await revealScreen()
})
</script>

<style lang="scss">
.page-cover {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: none;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color__dark);
  transform: translateY(-100%);
  transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
  pointer-events: none;
  will-change: transform;
}

.page-cover--instant {
  transition: none !important;
}

.page-cover__label {
  color: var(--color__white);
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.page-cover__label.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>

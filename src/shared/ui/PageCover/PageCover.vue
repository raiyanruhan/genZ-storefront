<template>
  <div
    ref="root"
    class="page-cover"
    :style="initialCover ? 'display: flex; transform: translate(0, 0);' : undefined"
    aria-hidden="true"
  >
    <span class="page-cover__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { canAnimate } from '@/shared/lib/motion/canAnimate'
import { registerCover, revealScreen, useCoverLabel } from '@/shared/lib/motion/pageCover'

const root = ref<HTMLElement | null>(null)
const label = useCoverLabel()

/** On desktop the slab is already covering the viewport on first paint. */
const initialCover = ref(canAnimate())

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

onMounted(async () => {
  if (!root.value) return
  registerCover(root.value)

  if (!initialCover.value) return

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
  transform: translate(0, -100%);
  pointer-events: none;
  will-change: transform;
}

.page-cover__label {
  color: var(--color__white);
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>

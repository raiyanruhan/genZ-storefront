<template>
  <div
    ref="root"
    class="page-cover"
    :style="initialCover ? 'display: flex; transform: translateY(0);' : undefined"
    aria-hidden="true"
  >
    <img
      src="/logo.png"
      alt=""
      class="page-cover__logo"
      :class="{ 'is-visible': logoShown }"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { canAnimate } from '@/shared/lib/motion/canAnimate'
import { registerCover, revealScreen, useLogoShown } from '@/shared/lib/motion/pageCover'

const root = ref<HTMLElement | null>(null)
const logoShown = useLogoShown()

/** On desktop the slab is already covering the viewport on first paint. */
const initialCover = ref(canAnimate())

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

onMounted(async () => {
  if (!root.value) return
  registerCover(root.value)

  if (!initialCover.value) return

  logoShown.value = true

  // Hold on the logo until fonts are ready (capped), then lift the slab.
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

.page-cover__logo {
  width: clamp(72px, 11vw, 148px);
  height: auto;
  /* logo art is solid black on transparent — invert to white on the dark slab */
  filter: invert(1);
  opacity: 0;
  transform: translateY(20px) scale(0.96);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.page-cover__logo.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>

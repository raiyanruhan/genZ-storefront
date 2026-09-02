<template>
  <slot name="header" />
  <main>
    <AppRouterView />
  </main>
  <slot name="footer" />
  <slot />
</template>

<script setup lang="ts">
import { AppRouterView } from '@/shared/ui/AppRouterView'
</script>

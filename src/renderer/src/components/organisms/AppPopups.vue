<template>
  <div
    v-if="store.component"
    class="fixed inset-0 bg-zinc-950/90 z-50"
  >
    <div class="overflow-y-auto p-10 h-screen w-full">
      <div class="flex min-h-full items-center justify-center">
        <component
          :is="store.component"
          v-bind="store.data"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePopupStore } from '../../store/popup'

const store = usePopupStore()
</script>

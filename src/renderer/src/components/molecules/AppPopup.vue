<template>
  <div
      class="relative transform overflow-hidden rounded-lg text-white bg-zinc-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
    <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
      <button
          @click="close()"
          type="button"
          class="rounded-md bg-zinc-900 text-white hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
        <span class="sr-only">Close</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { usePopupStore } from '../../store/popup'

const {close} = usePopupStore()
</script>

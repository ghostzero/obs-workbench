<template>
  <div
    :class="['relative transform overflow-hidden sm:my-8 sm:w-full', {
      'sm:max-w-xl': props.maxWidth === 'xl',
      'sm:max-w-2xl': props.maxWidth === '2xl',
      'sm:max-w-3xl': props.maxWidth === '3xl',
      'sm:max-w-4xl': props.maxWidth === '4xl',
      'sm:max-w-5xl': props.maxWidth === '5xl',
      'sm:max-w-6xl': props.maxWidth === '6xl',
      'sm:max-w-7xl': props.maxWidth === '7xl',
    }]"
  >
    <div
      class="text-white bg-zinc-800 px-4 pb-4 pt-5 rounded-lg text-left shadow-xl transition-all sm:p-6"
    >
      <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
        <button
          v-if="props.closeable"
          type="button"
          class="rounded-md bg-zinc-800 text-white hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          @click="close()"
        >
          <span class="sr-only">Close</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <slot />
    </div>
    <div>
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePopupStore } from '../../store/popup'

const { close } = usePopupStore()

const props = defineProps({
  closeable: {
    type: Boolean,
    default: true
  },
  maxWidth: {
    type: String,
    default: 'xl'
  }
})
</script>

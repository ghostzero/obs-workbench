<template>
  <button
    :type="props.type"
    :class="['flex relative items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600', {
      'bg-primary-500 hover:bg-primary-400': props.variant === 'solid',
      'bg-zinc-700 hover:bg-zinc-600 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500': props.variant === 'secondary',
      'bg-zinc-800 hover:bg-zinc-700': props.variant === 'ghost',
      'bg-zinc-800 hover:bg-zinc-600': props.variant === 'ghost-titlebar' && !props.destructive,
      'bg-zinc-800 hover:bg-primary-500': props.variant === 'ghost-titlebar' && props.destructive,
      'bg-primary-900 hover:bg-primary-700': props.variant === 'solid-titlebar' && !props.destructive,
      'bg-rose-900 hover:bg-rose-700': props.variant === 'solid-titlebar' && props.destructive,
      'bg-zinc-800 hover:bg-zinc-700 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500': props.variant === 'outline',
      // own3d uses ff9602 as text, border, and ff9602/10 as background
      'bg-[#ff9602]/30 text-[#ff9602] hover:bg-[#ff9602] hover:text-white ring-1 ring-inset ring-[#ff9602]/40 focus:ring-2 focus:ring-inset focus:ring-[#ff9602]': props.variant === 'own3d',
      'cursor-not-allowed': props.loading,
    }]"
    :disabled="props.loading"
  >
    <span
      :class="{
        'opacity-30': props.loading,
        'opacity-100': !props.loading,
      }"
    >
      <slot />
    </span>
    <!-- spinner overlay -->
    <span
      v-if="props.loading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <span class="w-4 h-4 text-white">
        <i class="fal fa-spinner-third animate-spin" />
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

export type ButtonVariant = 'solid' | 'solid-titlebar' | 'ghost' | 'ghost-titlebar' | 'outline' | 'secondary' | 'own3d'
export type ButtonType = 'button' | 'submit' | 'reset'

const props = defineProps({
  type: {
    type: String as PropType<ButtonType>,
    default: 'button'
  },
  variant: {
    type: String as PropType<ButtonVariant>,
    default: 'solid'
  },
  loading: {
    type: Boolean,
    default: false
  },
  destructive: {
    type: Boolean,
    default: false
  }
})
</script>

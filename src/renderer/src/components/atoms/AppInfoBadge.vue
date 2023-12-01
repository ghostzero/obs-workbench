<template>
  <div
    :class="['rounded-md border border-black/80 text-white', {
            'bg-emerald-900': props.color === 'green',
            'bg-amber-900': props.color === 'orange',
            'bg-primary-900': props.color === 'red',
            'bg-zinc-900': props.color === 'gray',
          }]"
  >
    <div class="pt-0.5 pb-1 px-2 text-zinc-200 w-28">
      <div class="flex text font-medium justify-between">
        <slot />
        <div :class="['indicator self-center', {
            'bg-emerald-500': props.indicatorColor === 'green',
            'bg-amber-500': props.indicatorColor === 'orange',
            'bg-primary-500': props.indicatorColor === 'red',
            'bg-zinc-400': props.indicatorColor === 'gray',
          }]"></div>
      </div>
      <div class="text-[10px] text-zinc-400">
        <slot name="label" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'gray',
  },
  indicatorColor: {
    type: String,
    default: 'gray',
  },
})
</script>

<style scoped>
.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>

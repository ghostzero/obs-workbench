<template>
  <div
    :class="['relative max-sm:w-30 sm:w-36 max-sm:h-30 sm:h-36 flex flex-col gap-3 items-center justify-center rounded border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10', {
        'animate-pulse': !ready,
        'text-white cursor-pointer': ready,
        'text-white/30 cursor-not-allowed': !ready
      }]"
    @click.prevent="ready ? emit('connect') : {}"
  >
    <div class="absolute top-1 right-3 z-10">
      <button type="button" @click.stop="$emit('delete')" class="opacity-50 hover:opacity-100">
        <i class="fas fa-times" />
      </button>
    </div>
    <div>
      <img
        v-if="ready"
        alt="logo"
        src="../../assets/obs.svg"
        class="w-16 h-16 fill-white"
      >
      <div
        v-else
        class="w-16 h-16 bg-white/5 rounded animate-pulse flex justify-center items-center"
      >
        <i class="fas fa-spinner-third animate-spin text-4xl text-white/20" />
      </div>
    </div>
    <div class="text-xs line-clamp-2 text-center">
        {{ props.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['connect', 'delete'])

const props = defineProps({
  name: {
    type: String,
    default: 'Server'
  },
  ready: {
    type: Boolean,
    default: true
  }
})
</script>

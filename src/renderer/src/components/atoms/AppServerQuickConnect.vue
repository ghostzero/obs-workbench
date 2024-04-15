<template>
  <div
    :class="['relative w-36 h-36 flex flex-col gap-3 items-center justify-center rounded border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10', {
      'animate-pulse': !ready
    }]"
  >
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
    <div class="text-xs">
      <a
        href="#"
        :class="['stretched-link line-clamp-2 text-center', {
          'text-white': ready,
          'text-white/30 cursor-not-allowed': !ready
        }]"
        @click.prevent="ready ? emit('connect') : {}"
      >
        {{ props.name }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['connect'])

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

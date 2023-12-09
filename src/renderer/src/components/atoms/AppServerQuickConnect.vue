<template>
  <div
    class="relative w-36 h-36 flex flex-col gap-3 items-center justify-center rounded border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10"
  >
    <div>
      <img
        alt="logo"
        src="../../assets/obs.svg"
        class="w-16 h-16 fill-white"
      >
    </div>
    <div class="text-xs">
      <a
        href="#"
        class="stretched-link"
        @click.prevent="emit('connect')"
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
  }
})
</script>

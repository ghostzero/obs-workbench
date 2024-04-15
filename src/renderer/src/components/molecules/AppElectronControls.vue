<template>
  <div v-if="insideElectron" class="flex gap-1.5">
    <AppButton
      variant="ghost-titlebar"
      @click="minimizeWindow()"
    >
      <i class="fal fa-minus fa-fw" />
    </AppButton>
    <AppButton
      variant="ghost-titlebar"
      @click="maximizeWindow()"
    >
      <i class="fal fa-square fa-fw" />
    </AppButton>
    <AppButton
      :destructive="true"
      variant="ghost-titlebar"
      @click="closeWindow()"
    >
      <i class="fal fa-times fa-fw" />
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import AppButton from '../atoms/AppButton.vue'
import { computed } from 'vue'

const minimizeWindow = () => {
  // @ts-ignore
  api.minimizeWindow()
}
const maximizeWindow = () => {
  // @ts-ignore
  api.maximizeWindow()
}
const closeWindow = () => {
  // @ts-ignore
  api.closeWindow()
}

const insideElectron = computed(() => {
  // @ts-ignore
  return typeof api !== 'undefined'
})
</script>

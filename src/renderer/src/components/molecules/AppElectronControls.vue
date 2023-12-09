<template>
  <div class="flex">
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

const minimizeWindow = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.api.minimizeWindow()
}
const maximizeWindow = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.api.maximizeWindow()
}
const closeWindow = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.api.closeWindow()
}
</script>

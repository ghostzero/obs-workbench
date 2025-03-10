<template>
  <Glayout
    ref="GLayoutRoot"
    :component-types="docks.componentTypes"
    class="h-full w-full"
  />
</template>

<script setup lang="ts">
import Glayout from '../atoms/AppGoldenLayout.vue'
import { onMounted, ref } from 'vue'
import { useDocksStore } from '../../store/dock'

const GLayoutRoot = ref<null | typeof Glayout>(null)

const docks = useDocksStore()

onMounted(async () => {
  await docks.onLoadLayout(GLayoutRoot)
})
</script>

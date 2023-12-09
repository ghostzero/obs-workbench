<template>
  <div
    v-if="store.inputVolumeMeters.length > 0"
    class="flex h-full gap-4"
  >
    <template
      v-for="volumeMeter in store.inputVolumeMeters"
      :key="volumeMeter.inputName"
    >
      <VolumeMeter :volume-meter="volumeMeter" />
    </template>
  </div>
  <AppEmptyState
    v-else
    :icon="{ name: 'sliders-up' }"
    title="No Audio Sources"
    description="Your **Program** doesn't have any audio sources."
  />
</template>

<script setup lang="ts">
import { useAppStore } from '../../store/app'
import { useObs } from '../../composables/useObs'
import { computed } from 'vue'
import { useSceneStore } from '../../store/scene'
import VolumeMeter from '../molecules/VolumeMeter.vue'
import AppEmptyState from '../atoms/AppEmptyState.vue'

const store = useAppStore()
const scene = useSceneStore()
const {obs} = useObs()

const items = computed(() => {
  return store.scenes.slice() // sort by sceneItemIndex (z-index)
    .sort((a, b) => b.sceneIndex - a.sceneIndex)
})

const updatePreviewScene = async (sceneName: string) => {
  await obs.call('SetCurrentPreviewScene', {
    sceneName: sceneName,
  })
}
</script>

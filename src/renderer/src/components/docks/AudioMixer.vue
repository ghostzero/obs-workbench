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
  <div
    v-else
    class="flex h-full flex-col items-center justify-center gap-2 text-center"
  >
    <i class="fal fa-fw fa-sliders-up text-5xl text-zinc-500" />
    <h3 class="mt-2 text-sm font-semibold text-zinc-200">
      No Audio Sources
    </h3>
    <p class="mt-1 text-sm text-zinc-500">
      Your <b>Program</b> doesn't have any audio sources.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../../store/app'
import { useObs } from '../../composables/useObs'
import { computed } from 'vue'
import { useSceneStore } from '../../store/scene'
import VolumeMeter from '../molecules/VolumeMeter.vue'

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

<template>
  <Glayout
    ref="GLayoutRoot"
    :component-types="componentTypes"
    class="h-full w-full"
  />
</template>

<script setup lang="ts">
import Glayout from '../atoms/AppGoldenLayout.vue'
import SceneItemList from '../docks/SceneItemList.vue'
import SceneList from '../docks/SceneList.vue'
import StudioView from '../docks/StudioView.vue'
import AudioMixer from '../docks/AudioMixer.vue'
import { markRaw, onMounted, ref } from 'vue'
import { useWaitForRef } from '../../composables/useWaitForComponent'
import { defaultLayoutConfig } from '../../predefined-layouts'
import { LayoutConfig } from 'golden-layout'

const GLayoutRoot = ref<null | typeof Glayout>(null)

const componentTypes = {
  Sources: markRaw(SceneItemList),
  Scenes: markRaw(SceneList),
  Main: markRaw(StudioView),
  AudioMixer: markRaw(AudioMixer)
}

onMounted(async () => {
  await onLoadLayout()
})

const onLoadLayout = async () => {
  const layout = await useWaitForRef<typeof Glayout>(GLayoutRoot)

  const str = localStorage.getItem('gl_config')
  if (!str) {
    layout.loadGLLayout(defaultLayoutConfig)
    return
  }

  const config = JSON.parse(str as string) as LayoutConfig
  config.header = {
    ...config.header,
    maximise: false,
    popout: false
  }
  console.log(config)
  layout.loadGLLayout(config)
}
</script>

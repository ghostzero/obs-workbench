<template>
  <Glayout
    ref="GLayoutRoot"
    :component-types="componentTypes"
    class="h-full w-full"
  />
</template>

<script setup lang="ts">
import { useNotificationStore } from '../../store/notification'
import Glayout from '../atoms/AppGoldenLayout.vue'
import SceneItemList from '../docks/SceneItemList.vue'
import SceneList from '../docks/SceneList.vue'
import StudioView from '../docks/StudioView.vue'
import AudioMixer from '../docks/AudioMixer.vue'
import { markRaw, ref, onMounted } from 'vue'
import { useWaitForRef } from '../../composables/useWaitForComponent'
import { defaultLayoutConfig } from '../../predefined-layouts'
import { LayoutConfig } from 'golden-layout'
const { success } = useNotificationStore()
const GLayoutRoot = ref<null | typeof Glayout>(null)

const componentTypes = {
  Sources: markRaw(SceneItemList),
  Scenes: markRaw(SceneList),
  Main: markRaw(StudioView),
  AudioMixer: markRaw(AudioMixer)
}

const onClickAddGLComponent1 = async () => {
  const layout = await useWaitForRef<typeof Glayout>(GLayoutRoot)
  // layout.addGLComponent('SceneBui', 'Scene Builder')
}

onMounted(async () => {
  await onLoadLayout() //
  // await onClickSaveLayout()
})

const onClickSaveLayout = async () => {
  const layout = await useWaitForRef<typeof Glayout>(GLayoutRoot)
  const config = layout.getLayoutConfig()
  localStorage.setItem('gl_config', JSON.stringify(config))
  console.log(JSON.stringify(config))
  success({
    type: 'success',
    title: 'Layout saved',
    message: 'The layout has been saved'
  })
}

const onClickResetLayout = () => {
  localStorage.removeItem('gl_config')
}

const onLoadNewLayout = async () => {
  const layout = await useWaitForRef<typeof Glayout>(GLayoutRoot)
  layout.addGLComponent('Sources', 'Sources')
  layout.addGLComponent('Scenes', 'Scenes')
  layout.addGLComponent('Main', '')
  layout.addGLComponent('AudioMixer', 'Audio Mixer')
}

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

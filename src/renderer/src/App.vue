<template>
  <div
    class="min-h-full select-none"
    @contextmenu.prevent
  >
    <AppPopups />
    <AppNotifications />
    <template v-if="store.connected">
      <main class="flex flex-col gap-4 px-8 py-4 h-screen">
        <AppHeader />

        <div class="flex-auto">
          <Glayout
            ref="GLayoutRoot"
            :component-types="componentTypes"
            class="h-full w-full"
          />
        </div>

        <footer>
          <div class="mx-auto">
            <div
              class="text-center text-sm text-gray-500 sm:text-left"
            >
              <span class="block sm:inline">
                &copy; 2023 René Preuß. All rights reserved. Running OBS Websocket
                <button
                  type="button"
                  @click="onClickAddGLComponent1"
                >create</button>
                <button
                  type="button"
                  @click="onClickSaveLayout"
                > save</button>
                <button
                  type="button"
                  @click="onClickResetLayout"
                > reset</button>
                {{ store.version.obsWebSocketVersion }} on OBS Studio
                {{ store.version.obsVersion }} on
                {{ store.version.platformDescription }}.
              </span>
            </div>
          </div>
        </footer>
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/organisms/AppHeader.vue'

import { useAppStore } from './store/app'
import AppPopups from './components/organisms/AppPopups.vue'
import AppNotifications from './components/organisms/AppNotifications.vue'
import Glayout from './components/Glayout.vue'
import { markRaw, onMounted, ref } from 'vue'

import { LayoutConfig } from 'golden-layout'
import { useWaitForRef } from './composables/useWaitForComponent'
import SceneItemList from './components/docks/SceneItemList.vue'
import SceneList from './components/docks/SceneList.vue'
import StudioView from './components/docks/StudioView.vue'
import AudioMixer from './components/docks/AudioMixer.vue'
import { useNotificationStore } from './store/notification'

const store = useAppStore()
const { success } = useNotificationStore()
const GLayoutRoot = ref<null | typeof Glayout>(null)

const componentTypes = {
  Sources: markRaw(SceneItemList),
  Scenes: markRaw(SceneList),
  Main: markRaw(StudioView),
  AudioMixer: markRaw(AudioMixer),
}

const onClickAddGLComponent1 = async () => {
  const layout = await useWaitForRef<typeof Glayout>(GLayoutRoot)
  // layout.addGLComponent('SceneBui', 'Scene Builder')
}

onMounted(async () => {
  await onClickLoadLayout() //
})

const onClickSaveLayout = async () => {
  const layout = await useWaitForRef<typeof Glayout>(GLayoutRoot)
  const config = layout.getLayoutConfig()
  localStorage.setItem('gl_config', JSON.stringify(config))
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

const onClickLoadLayout = async () => {
  const layout = await useWaitForRef<typeof Glayout>(GLayoutRoot)

  const str = localStorage.getItem('gl_config')
  if (!str) {
    layout.addGLComponent('Sources', 'Sources')
    layout.addGLComponent('Scenes', 'Scenes')
    layout.addGLComponent('Main', '')
    layout.addGLComponent('AudioMixer', 'Audio Mixer')
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

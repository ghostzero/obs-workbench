<template>
  <div
    class='min-h-full select-none'
    @contextmenu.prevent
  >
    <AppPopups />
    <AppNotifications />
    <template v-if='store.connected'>
      <main class='flex flex-col gap-4 px-8 py-4 h-screen'>
        <AppHeader />

        <div class='flex-auto'>
          <Glayout
            ref='GLayoutRoot'
            glc-path='./'
            class='h-full w-full'
          ></Glayout>
        </div>

        <footer>
          <div class='mx-auto'>
            <div
              class='text-center text-sm text-gray-500 sm:text-left'
            >
            <span class='block sm:inline'>
              &copy; 2023 René Preuß. All rights reserved. Running OBS Websocket
              <button type='button' @click='onClickAddGLComponent1'>create</button>
              <button type='button' @click='onClickSaveLayout'>save</button>
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

<script setup lang='ts'>
import AppHeader from './components/organisms/AppHeader.vue'

import { useAppStore } from './store/app'
import AppPopups from './components/organisms/AppPopups.vue'
import AppNotifications from './components/organisms/AppNotifications.vue'
import Glayout from './components/Glayout.vue'
import { onMounted, ref } from 'vue'

import 'golden-layout/dist/css/goldenlayout-base.css'
import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css'
import { LayoutConfig } from 'golden-layout'

const store = useAppStore()
const GLayoutRoot = ref<null | typeof Glayout>(null)

const onClickAddGLComponent1 = () => {
  if (!GLayoutRoot.value) return
  GLayoutRoot.value.addGLComponent('Content1', 'Title 1st')
}

onMounted(() => {
  if (!GLayoutRoot.value) return
  onClickLoadLayout() //
})

const onClickSaveLayout = () => {
  if (!GLayoutRoot.value) return
  const config = GLayoutRoot.value.getLayoutConfig()
  localStorage.setItem('gl_config', JSON.stringify(config))
}

const onClickLoadLayout = () => {
  const str = localStorage.getItem('gl_config')
  if (!str) return
  if (!GLayoutRoot.value) return
  const config = JSON.parse(str as string) as LayoutConfig
  config.header = {
    ...config.header,
    maximise: false,
    popout: false,
  }
  console.log(config)
  GLayoutRoot.value.loadGLLayout(config)
}

</script>

<style>
.lm_tab {
  border-radius: 4px;
}

.lm_header .lm_tab {
  box-shadow: unset !important;
  background: #18181b;
}

.lm_dropTargetIndicator {
  box-shadow: unset;
  outline: 1px solid #9146FF;
  border-radius: 4px;
  @apply outline-primary;
}

.lm_dropTargetIndicator .lm_inner {
  @apply bg-primary;
  opacity: 0.2;
}

.lm_header .lm_tab.lm_active.lm_focused {
  background-color: #18181b;
  color: #ffffff;
}

.lm_goldenlayout {
  background: transparent !important;
}

.lm_content {
  @apply rounded-md bg-zinc-900 border border-black/80;
}

.lm_tab {
  display: flex;
  background: transparent !important;
  align-items: center;
  padding-left: 0px !important;
  @apply text-zinc-300 text-xl;
}

.lm_tab:hover, .lm_tab.lm_active {
  opacity: 0.4;
}
</style>

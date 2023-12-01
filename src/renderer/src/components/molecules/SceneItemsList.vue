<template>
  <nav class="flex flex-1 flex-col" aria-label="Sidebar">
    <ul role="list" class="-mx-2 space-y-1 overflow-y-scroll h-[280px]">
      <template
          v-for="item in items"
          :key="item.sourceName"
      >
        <li>
          <a
              href="#"
              :class="['group flex justify-between gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold', {
              'bg-primary-500 text-white': store.currentPreviewSceneName === item.sourceName,
              'text-white hover:bg-zinc-800': store.currentPreviewSceneName !== item.sourceName,
            }]"
          >
            <div
                :class="['truncate', {'text-white/50': !item.sceneItemEnabled}]"
            >
              <SceneItemIcon :kind="item.inputKind" />
              {{ item.sourceName }}
            </div>
            <div class="flex gap-4 items-center">
              <a href="#" @click.prevent="removeSceneItem(store.currentSceneName, item)">
                <i :class="['fas fa-fw fa-trash text-white/50 hover:text-white']"></i>
              </a>

              <a href="#" @click.prevent="toggleEnabled(item)">
                <i :class="['fas fa-fw', {
                'fa-eye': item.sceneItemEnabled,
                'fa-eye-slash text-white/50': !item.sceneItemEnabled,
              }]"></i>
              </a>

              <a href="#" @click.prevent="toggleLocked(item)">
                <i :class="['fas fa-fw', {
                'fa-lock': item.sceneItemLocked,
                'fa-lock-open text-white/50': !item.sceneItemLocked,
              }]"></i>
              </a>
            </div>
          </a>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useAppStore } from '../../store/app'
import { useObs } from '../../composables/useObs'
import { computed } from 'vue'
import SceneItemIcon from '../atoms/SceneItemIcon.vue'
import { useSceneStore } from '../../store/scene'

const store = useAppStore()
const {obs} = useObs()
const {removeSceneItem} = useSceneStore()

const items = computed(() => {
  return store.sceneItems.slice() // sort by sceneItemIndex (z-index)
      .sort((a, b) => b.sceneItemIndex - a.sceneItemIndex)
})

const toggleEnabled = async (item: any) => {
  item.sceneItemEnabled = !item.sceneItemEnabled
  await obs.call('SetSceneItemEnabled', {
    sceneName: store.currentPreviewSceneName,
    sceneItemId: item.sceneItemId,
    sceneItemEnabled: item.sceneItemEnabled,
  })
}
const toggleLocked = async (item: any) => {
  item.sceneItemLocked = !item.sceneItemLocked
  await obs.call('SetSceneItemLocked', {
    sceneName: store.currentPreviewSceneName,
    sceneItemId: item.sceneItemId,
    sceneItemLocked: item.sceneItemLocked,
  })
}
</script>
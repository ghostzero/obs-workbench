<template>
  <AppGoldenLayoutContainer>
    <nav
      v-if="items.length > 0"
      class="flex w-full flex-col"
      aria-label="Sidebar"
    >
      <ul
        role="list"
        class="-mx-2 space-y-1"
      >
        <template
          v-for="item in items"
          :key="item.sceneName"
        >
          <li
            v-if="!item.sceneName.startsWith('!')"
          >
            <a
              href="#"
              :class="['group flex justify-between gap-x-3 rounded-md p-2 px-3 text-sm leading-6 font-semibold', {
                'bg-primary-500 text-white': store.currentPreviewSceneName === item.sceneName,
                'text-white hover:bg-zinc-700': store.currentPreviewSceneName !== item.sceneName,
              }]"
              @click.prevent="updatePreviewScene(item.sceneName)"
            >
              <div>
                {{ item.sceneName }}
              </div>
              <div class="flex gap-3 items-center">
                <i
                  v-if="store.currentProgramSceneName === item.sceneName"
                  :class="['fas fa-signal-stream', {
                    'text-primary-500': store.currentPreviewSceneName !== item.sceneName,
                    'text-white': store.currentPreviewSceneName === item.sceneName,
                  }]"
                />
                <button
                  type="button"
                  class="text-white/50 hover:text-zinc-100"
                  @click.stop="scene.removeScene(item.sceneName)"
                >
                  <i class="fas fa-trash" />
                </button>
              </div>
            </a>
          </li>
        </template>
      </ul>
    </nav>
    <AppEmptyState
      v-else
      :icon="{ name: 'list' }"
      :actions="actions"
      title="No Scenes"
      description="Your **Scenes** list is empty."
    />
    <template
      v-if="items.length > 0"
      #footer
    >
      <div class="p-2">
        <AppButton
          variant="outline"
          class="w-full text-white/50"
          @click="openPopup(AddScenePopup)"
        >
          <i class="fas fa-grid-2-plus" />
          Add Scene
        </AppButton>
      </div>
    </template>
  </AppGoldenLayoutContainer>
</template>

<script setup lang="ts">
import { useAppStore } from '../../store/app'
import { useObs } from '../../composables/useObs'
import { computed } from 'vue'
import { useSceneStore } from '../../store/scene'
import AppEmptyState from '../atoms/AppEmptyState.vue'
import AppButton, {ButtonVariant} from "../atoms/AppButton.vue";
import AppGoldenLayoutContainer from "../atoms/AppGoldenLayoutContainer.vue";
import {usePopupStore} from "../../store/popup";
import AddScenePopup from "../popups/AddScenePopup.vue";

const {openPopup} = usePopupStore()
const store = useAppStore()
const scene = useSceneStore()
const {obs} = useObs()

const actions = [
  {
    label: 'Add Scene',
    variant: 'outline' as ButtonVariant,
    onClick: () => openPopup(AddScenePopup)
  }
]

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

<template>
  <AppGoldenLayoutContainer>
    <nav
      v-if="items.length > 0"
      class="flex flex-1 flex-col"
      aria-label="Sidebar"
    >
      <ul
        role="list"
        class="-mx-2 space-y-1"
      >
        <template
          v-for="item in items"
          :key="item.sourceName"
        >
          <li>
            <a
              href="#"
              :class="['group flex justify-between gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold', {
                'bg-primary-500 text-white': selected === item,
                'text-white hover:bg-zinc-700': selected !== item,
              }]"
              @click.prevent="(e: MouseEvent) => doubleClick(e, item)"
            >
              <div
                :class="['truncate', {'text-white/50': !item.sceneItemEnabled}]"
              >
                <SceneItemIcon :item="item" />
                {{ item.sourceName }}
              </div>
              <div class="flex gap-4 items-center">
                <a
                  href="#"
                  @click.prevent="removeSceneItem(store.currentSceneName, item)"
                >
                  <i :class="['fas fa-fw fa-trash text-white/50 hover:text-white']" />
                </a>

                <a
                  href="#"
                  @click.prevent="toggleEnabled(item)"
                >
                  <i
                    :class="['fas fa-fw', {
                      'fa-eye': item.sceneItemEnabled,
                      'fa-eye-slash text-white/50': !item.sceneItemEnabled,
                    }]"
                  />
                </a>

                <a
                  href="#"
                  @click.prevent="toggleLocked(item)"
                >
                  <i
                    :class="['fas fa-fw', {
                      'fa-lock': item.sceneItemLocked,
                      'fa-lock-open text-white/50': !item.sceneItemLocked,
                    }]"
                  />
                </a>
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
      title="No Sources"
      description="Your **Scene** doesn't have any sources."
    />
    <template
      v-if="items.length > 0"
      #footer
    >
      <div class="p-2">
        <AppButton
          variant="outline"
          class="w-full text-white/50"
          @click="openPopup(AddSourcePopup)"
        >
          <i class="fas fa-layer-plus" />
          Add Source
        </AppButton>
      </div>
    </template>
  </AppGoldenLayoutContainer>
</template>

<script setup lang="ts">
import { SceneItem, useAppStore } from '../../store/app'
import { useObs } from '../../composables/useObs'
import { computed, ref } from 'vue'
import { useSceneStore } from '../../store/scene'
import SceneItemIcon from '../atoms/SceneItemIcon.vue'
import AppEmptyState from '../atoms/AppEmptyState.vue'
import AppButton, {ButtonVariant} from "../atoms/AppButton.vue";
import AppGoldenLayoutContainer from "../atoms/AppGoldenLayoutContainer.vue";
import {usePopupStore} from "../../store/popup";
import AddSourcePopup from "../popups/AddSourcePopup.vue";
import SceneItemPropertiesPopup from "../popups/SceneItemPropertiesPopup.vue";

const store = useAppStore()
const { obs } = useObs()
const { removeSceneItem } = useSceneStore()
const {openPopup} = usePopupStore()

const actions = [
  {
    label: 'Add Source',
    variant: 'outline' as ButtonVariant,
    onClick: () => openPopup(AddSourcePopup)
  }
]

const selected = ref<SceneItem | null>(null)

const items = computed(() => {
  return store.sceneItems.slice() // sort by sceneItemIndex (z-index)
    .sort((a, b) => b.sceneItemIndex - a.sceneItemIndex)
})

const toggleEnabled = async (item: any) => {
  item.sceneItemEnabled = !item.sceneItemEnabled
  await obs.call('SetSceneItemEnabled', {
    sceneName: store.currentSceneName,
    sceneItemId: item.sceneItemId,
    sceneItemEnabled: item.sceneItemEnabled
  })
}
const toggleLocked = async (item: any) => {
  item.sceneItemLocked = !item.sceneItemLocked
  await obs.call('SetSceneItemLocked', {
    sceneName: store.currentSceneName,
    sceneItemId: item.sceneItemId,
    sceneItemLocked: item.sceneItemLocked
  })
}

const doubleClick = async (e: MouseEvent, item: SceneItem) => {
  if (e.detail === 1) {
    selected.value = item
  }
  if (e.detail === 2) {
    openPopup(SceneItemPropertiesPopup as any, {
      sceneItem: item
    })
  }
}
</script>

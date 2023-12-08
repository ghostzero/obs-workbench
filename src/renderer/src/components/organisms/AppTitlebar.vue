<template>
  <div
    class="bg-zinc-800 text-white/90 bg-gradient-to-r from-zinc-800 via-primary-500/25 to-zinc-800 via-5% to-25% w-full z-[60]"
    style="-webkit-app-region: drag"
  >
    <div class="flex items-center justify-between px-8 py-2 gap-5">
      <div class="flex items-center gap-5">
        <button
          type="button"
          class="flex justify-center items-center hover:bg-white/10 w-8 h-8 rounded"
        >
          <i class="fas fa-fw fa-bars" />
        </button>

        <AppTitlebarDropdown
          letter="P"
          :menu-items="menuItems"
        >
          Production
        </AppTitlebarDropdown>

        <AppTitlebarDropdown
          :icon="{name: 'user'}"
          :menu-items="profileMenuItems"
          :selected="store.profileList.currentProfileName"
          @select="setActiveProfile"
        >
          {{ store.profileList.currentProfileName }}
        </AppTitlebarDropdown>

        <AppTitlebarDropdown
          :icon="{name: 'rectangle-history'}"
          :menu-items="sceneCollectionMenuItems"
          :selected="store.sceneCollectionList.currentSceneCollectionName"
          @select="setActiveSceneCollection"
        >
          {{ store.sceneCollectionList.currentSceneCollectionName }}
        </AppTitlebarDropdown>
      </div>

      <div class="flex items-center gap-6 -mr-6">
        <Controls />

        <div class="flex">
          <AppButton
            variant="ghost-titlebar"
          >
            <i class="fal fa-minus fa-fw" />
          </AppButton>
          <AppButton
            variant="ghost-titlebar"
          >
            <i class="fal fa-square fa-fw" />
          </AppButton>
          <AppButton
            variant="ghost-titlebar"
            class="hover:bg-primary-900"
          >
            <i class="fal fa-times fa-fw" />
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Controls from '../Controls.vue'
import AppButton from '../atoms/AppButton.vue'
import AppTitlebarDropdown from '../atoms/AppTitlebarDropdown.vue'
import { computed, ref } from 'vue'
import { useAppStore } from '../../store/app'
import { useObs } from '../../composables/useObs'

const store = useAppStore()
const { obs } = useObs()

const profileMenuItems = computed(() => {
  return store.profileList.profiles.map((profile) => ({
    id: profile,
    label: profile,
    icon: { name: 'user' }
  }))
})

const sceneCollectionMenuItems = computed(() => {
  return store.sceneCollectionList.sceneCollections.map((sceneCollection) => ({
    id: sceneCollection,
    label: sceneCollection,
    icon: { name: 'rectangle-history' }
  }))
})

const menuItems = ref([
  {
    id: 0,
    label: 'Production',
    icon: { name: 'server' }
  },
])

const setActiveProfile = (name: string) => {
  obs.call('SetCurrentProfile', {
    'profileName': name
  })
}

const setActiveSceneCollection = (name: string) => {
  obs.call('SetCurrentSceneCollection', {
    'sceneCollectionName': name
  })
}
</script>

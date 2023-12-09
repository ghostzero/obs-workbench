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
          v-if="store.connected"
          :letter="{ text: 'P', color: 'bg-gradient-to-r from-primary-500 to-rose-700' }"
          :menu-items="menuItems"
          @select="setActiveConnection"
        >
          Production
        </AppTitlebarDropdown>

        <AppTitlebarDropdown
          v-if="store.connected"
          :icon="{name: 'user'}"
          :menu-items="profileMenuItems"
          :selected="store.profileList.currentProfileName"
          @select="setActiveProfile"
        >
          {{ store.profileList.currentProfileName }}
        </AppTitlebarDropdown>

        <AppTitlebarDropdown
          v-if="store.connected"
          :icon="{name: 'rectangle-history'}"
          :menu-items="sceneCollectionMenuItems"
          :selected="store.sceneCollectionList.currentSceneCollectionName"
          @select="setActiveSceneCollection"
        >
          {{ store.sceneCollectionList.currentSceneCollectionName }}
        </AppTitlebarDropdown>
      </div>

      <div class="flex items-center gap-6 -mr-6">
        <Controls v-if="store.connected" />

        <div class="flex">
          <AppButton
            variant="ghost-titlebar"
            @click="minimizeWindow()"
          >
            <i class="fal fa-minus fa-fw" />
          </AppButton>
          <AppButton
            variant="ghost-titlebar"
            @click="maximizeWindow()"
          >
            <i class="fal fa-square fa-fw" />
          </AppButton>
          <AppButton
            :destructive="true"
            variant="ghost-titlebar"
            @click="closeWindow()"
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
import AppTitlebarDropdown, { MenuItem } from '../atoms/AppTitlebarDropdown.vue'
import { computed, Ref, ref } from 'vue'
import { useAppStore } from '../../store/app'
import { useObs } from '../../composables/useObs'
import { useNotificationStore } from '../../store/notification'

const store = useAppStore()
const { error } = useNotificationStore()
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

const menuItems: Ref<MenuItem[]> = ref([
  {
    id: 0,
    label: 'Production',
    subtitle: 'ws://localhost:4455',
    letter: { text: 'P', color: 'bg-gradient-to-r from-primary-500 to-rose-700' },
    data: {
      ip: 'localhost',
      port: '4455',
      password: 'o0vDZDSu8O975flK'
    }
  },
  {
    id: 1,
    label: 'Testing',
    subtitle: 'ws://10.10.0.214:4455',
    letter: { text: 'T', color: 'bg-gradient-to-r from-indigo-500 to-indigo-700' },
    data: {
      ip: '10.10.0.214',
      port: '4455',
      password: 'o0vDZDSu8O975flK'
    }
  },
  {
    id: 2,
    label: 'Remote',
    subtitle: 'ws://pxy1.example.com:4455',
    letter: { text: 'R', color: 'bg-gradient-to-r from-amber-500 to-amber-700' },
    data: {
      ip: 'pxy1.example.com',
      port: '4455',
      password: 'o0vDZDSu8O975flK'
    }
  }
])

const setActiveConnection = async (item: MenuItem) => {
  const { ip, port, password } = item.data as { ip: string, port: string, password: string }
  try {
    await store.connect(`ws://${ip}:${port}`, password)
  } catch (e) {
    error({
      type: 'error',
      title: 'Connection error',
      message: 'Could not connect to the server'
    })
    console.error(e)
  }
}

const setActiveProfile = (item: MenuItem) => {
  obs.call('SetCurrentProfile', {
    'profileName': item.id as string
  })
}

const setActiveSceneCollection = (item: MenuItem) => {
  obs.call('SetCurrentSceneCollection', {
    'sceneCollectionName': item.id as string
  })
}

const minimizeWindow = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.api.minimizeWindow()
}
const maximizeWindow = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.api.maximizeWindow()
}
const closeWindow = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.api.closeWindow()
}
</script>

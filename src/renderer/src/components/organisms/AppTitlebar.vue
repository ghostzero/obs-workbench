<template>
  <div
    :class="[`text-white/90 w-full z-[60]`]"
    :style="calculateViaGradient"
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
          :letter="activeConnection.letter"
          :menu-items="menuItems"
          @select="setActiveConnection"
        >
          {{ activeConnection.label }}
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
        <AppControls v-if="store.connected" />

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
import AppButton from '../atoms/AppButton.vue'
import AppTitlebarDropdown, { MenuItem } from '../atoms/AppTitlebarDropdown.vue'
import { computed, Ref, ref } from 'vue'
import { Connection, useAppStore } from '../../store/app'
import { useObs } from '../../composables/useObs'
import { useNotificationStore } from '../../store/notification'
import AppControls from '../atoms/AppControls.vue'
import { usePopupStore } from '../../store/popup'
import { colorPalette } from '../../color-palette'

const store = useAppStore()
const { error } = useNotificationStore()
const { openPopup } = usePopupStore()
const { obs } = useObs()

const calculateViaGradient = computed(() => {
  const { r, g, b } = colorPalette[activeConnection.value.letter?.color ?? 'red']
  return {
    'background': `linear-gradient(90deg, #18181B 0px, rgba(${r}, ${g}, ${b}, .4) 95px, #18181B 300px)`,
    '-webkit-app-region': 'drag'
  }
})

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

const activeConnection = computed(() => {
  return menuItems.value.find((item) => {
    if (!item.data) return false
    const connection = item.data as Connection
    return connection.ip === store.connection.ip &&
      connection.port === store.connection.port &&
      connection.password === store.connection.password
  }) ?? menuItems.value[0]
})

const menuItems: Ref<MenuItem[]> = ref([
  {
    id: 0,
    label: 'Connect to a new server',
    icon: { name: 'plus' }
  },
  {
    id: 1,
    label: 'Production',
    subtitle: 'ws://localhost:4455',
    letter: { text: 'P', color: 'rose' },
    data: {
      ip: 'localhost',
      port: '4455',
      password: 'o0vDZDSu8O975flK'
    }
  },
  {
    id: 2,
    label: 'Testing',
    subtitle: 'ws://10.10.0.214:4455',
    letter: { text: 'T', color: 'indigo' },
    data: {
      ip: '10.10.0.214',
      port: '4455',
      password: 'o0vDZDSu8O975flK'
    }
  },
  {
    id: 3,
    label: 'Remote',
    subtitle: 'ws://pxy1.example.com:4455',
    letter: { text: 'R', color: 'amber' },
    data: {
      ip: 'pxy1.example.com',
      port: '4455',
      password: 'o0vDZDSu8O975flK'
    }
  }
])

const setActiveConnection = async (item: MenuItem) => {
  if (!item.data) {
    switch (item.id) {
      case 0:
        openPopup('connect')
        break
      default:
        error({
          type: 'error',
          title: 'Action not implemented',
          message: 'This action is not implemented yet'
        })
        break
    }
    return
  }

  try {
    await store.connect(item.data as Connection)
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

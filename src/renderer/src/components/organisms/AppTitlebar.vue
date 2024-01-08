<template>
  <div
    :class="[`text-white/90 w-full z-[60]`]"
    :style="calculateViaGradient"
  >
    <div class="flex items-center justify-between px-8 py-2 gap-5">
      <OnClickOutside
        class="flex items-center gap-5"
        @trigger="showSecondLevelMenu = false"
      >
        <button
          type="button"
          class="flex justify-center items-center hover:bg-white/10 w-8 h-8 rounded"
          @click="showSecondLevelMenu = !showSecondLevelMenu"
        >
          <i class="fas fa-fw fa-bars" />
        </button>

        <template
          v-if="showSecondLevelMenu"
        >
          <template
            v-for="secondLevelMenu in secondLevelMenus"
            :key="secondLevelMenu.label"
          >
            <AppTitlebarDropdown
              :menu-items="secondLevelMenu.menuItems"
              @select="(e) => e.click()"
            >
              {{ secondLevelMenu.label }}
            </AppTitlebarDropdown>
          </template>
        </template>

        <template v-else>
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
        </template>
      </OnClickOutside>

      <div class="flex items-center gap-6 -mr-6">
        <AppControls v-if="store.connected" />
        <AppElectronControls />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'
import AppTitlebarDropdown, { MenuItem } from '../atoms/AppTitlebarDropdown.vue'
import { computed, Ref, ref } from 'vue'
import { Connection, useAppStore } from '../../store/app'
import { useObs } from '../../composables/useObs'
import { useNotificationStore } from '../../store/notification'
import AppControls from '../atoms/AppControls.vue'
import { usePopupStore } from '../../store/popup'
import { colorPalette } from '../../color-palette'
import AppElectronControls from '../molecules/AppElectronControls.vue'
import { useUserStore } from '../../store/user'
import { storeToRefs } from 'pinia'

const store = useAppStore()
const { error } = useNotificationStore()
const { openPopup } = usePopupStore()
const { obs } = useObs()
const userStore = useUserStore()
const {user} = storeToRefs(userStore);

const showSecondLevelMenu = ref(false)

const secondLevelMenus = ref([
  {
    label: 'Account',
    menuItems: [
      {
        id: 0,
        label: 'Sign in',
        icon: { name: 'sign-in' },
        click: () => openPopup('login')
      },
      {
        id: 1,
        label: 'Sign out',
        icon: { name: 'sign-out' },
        click: () => userStore.logout()
      }
    ]
  },
  {
    label: 'Help',
    menuItems: [
      {
        id: 0,
        label: 'About',
        icon: { name: 'info-circle' }
      },
      {
        id: 1,
        label: 'Check for updates',
        icon: { name: 'download' }
      },
      {
        id: 2,
        label: 'Report a bug',
        icon: { name: 'bug' }
      },
      {
        id: 3,
        label: 'Join the Discord',
        icon: { name: 'discord' }
      },
      {
        id: 4,
        label: 'Open the Wiki',
        icon: { name: 'book' }
      }
    ]
  }
])

const menuItems: Ref<MenuItem[]> = computed(() => {
  const items: MenuItem[] = [
    {
      id: 0,
      label: 'Connect to a new server',
      icon: { name: 'plus' }
    }
  ];

  user.value?.connections?.forEach((connection) => {
    items.push({
      id: connection.id,
      label: connection.name,
      subtitle: `ws://${connection.ip}:${connection.port}`,
      letter: { text: connection.name[0], color: connection.color },
      data: {
        ip: connection.ip,
        port: connection.port,
        password: connection.password
      }
    })
  })

  return items
})

const calculateViaGradient = computed(() => {
  const { r, g, b } = colorPalette[activeConnection.value.letter?.color ?? 'red']
  return {
    'background': `linear-gradient(90deg, #181e23 0px, rgba(${r}, ${g}, ${b}, .4) 95px, #181e23 300px)`,
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
  }) ?? {
    label: store.connection.ip,
    subtitle: `ws://${store.connection.ip}:${store.connection.port}`,
    letter: { text: store.connection.ip[0], color: 'amber' },
  }
})

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
</script>

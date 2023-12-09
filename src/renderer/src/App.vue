<template>
  <div
    class="min-h-full select-none"
    @contextmenu.prevent
  >
    <AppPopups />
    <AppNotifications />
    <AppTitlebar />

    <template v-if="store.connected">
      <main class="flex flex-col gap-4 px-8 py-4 h-[calc(100vh-52px)]">
        <AppInfoBar />

        <div class="flex-auto">
          <AppGoldenLayout />
        </div>

        <footer>
          <div class="flex justify-between">
            <div
              class="text-center text-sm text-gray-500 sm:text-left"
            >
              <span class="block sm:inline">
                &copy; 2023 René Preuß. All rights reserved. Running OBS Websocket
                {{ store.version.obsWebSocketVersion }} on OBS Studio
                {{ store.version.obsVersion }} on
                {{ store.version.platformDescription }}.
              </span>
            </div>
            <div class="flex gap-2 text-center">
              <!--
              <div class="flex gap-1.5 text-center text-sm text-gray-500 sm:text-left">
                <div><b>Profile:</b> {{ store.profileList.currentProfileName}}</div>
                <div>|</div>
                <div><b>Scene Collection:</b> {{ store.sceneCollectionList.currentSceneCollectionName}}</div>
              </div>
              -->
            </div>
          </div>
        </footer>
      </main>
    </template>
    <div
      v-else
      class="h-[calc(100vh-52px)]"
    >
      <AppEmptyState
        :icon="{ name: 'unlink' }"
        title="Not Connected"
        description="Your **Workspace** is not connected."
        :actions="[
          {
            label: 'Connect',
            variant: 'outline',
            onClick: () => openPopup('connect')
          }
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppInfoBar from './components/organisms/AppInfoBar.vue'
import AppPopups from './components/organisms/AppPopups.vue'
import AppNotifications from './components/organisms/AppNotifications.vue'
import AppTitlebar from './components/organisms/AppTitlebar.vue'
import AppGoldenLayout from './components/molecules/AppGoldenLayout.vue'
import { useAppStore } from './store/app'
import AppEmptyState from './components/atoms/AppEmptyState.vue'
import { usePopupStore } from './store/popup'

const store = useAppStore()
const { openPopup } = usePopupStore()
</script>

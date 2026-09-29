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
                &copy; 2024 René Preuß. All rights reserved.
                <span class="hidden xl:inline">
                  Running OBS Websocket
                  {{ store.version.obsWebSocketVersion }} on OBS Studio
                  {{ store.version.obsVersion }} on
                  {{ store.version.platformDescription }}.
                </span>
              </span>
            </div>
            <div class="flex gap-2 text-center">

              <div class="flex gap-1.5 text-center text-sm text-gray-500 sm:text-left">
                <div>
                  {{ store.bandwidth.requestsCount }} requests /
                  {{ transferred }} MB / {{ bandwidth }} Kbit/s
                </div>
                <div>|</div>
                <div>
                  Version: {{ gitHash }}
                </div>
              </div>
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
            onClick: () => openPopup(ConnectPopup)
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
import ConnectPopup from './components/popups/ConnectPopup.vue'
import { computed, onMounted, onUnmounted } from 'vue'
import { consumeQuickConnect } from './composables/useQuickConnect'
import { useConnectionHistory } from './composables/useConnectionHistory'
import { useNotificationStore } from './store/notification'

const store = useAppStore()
const { openPopup, close } = usePopupStore()
const { error } = useNotificationStore()
const { saveConnection } = useConnectionHistory()

// Opened with #connect=...&password=... by another page: connect straight away.
// Also when the link lands in a tab that already has Workbench open, where
// only the fragment changes and the page does not reload.
const quickConnect = async () => {
  const connection = consumeQuickConnect()

  if (!connection) {
    return
  }

  // The connect form opens on start; with a link there is nothing to ask.
  close()

  try {
    await store.connect(connection)
    saveConnection(connection)
  } catch (e) {
    error({
      type: 'error',
      title: 'Connection error',
      message: 'Could not connect to the server from the link'
    })
    console.error(e)
    openPopup(ConnectPopup)
  }
}

onMounted(() => {
  window.addEventListener('hashchange', quickConnect)
  quickConnect()
})

onUnmounted(() => window.removeEventListener('hashchange', quickConnect))

const transferred = computed(() => {
  return (store.bandwidth.bytesTransferred / 1024 / 1024).toFixed(2)
})

const bandwidth = computed(() => {
  return ((store.bandwidth.bandwidth / 1024) * 8).toFixed(2)
})


const gitHash = import.meta.env.VITE_GIT_COMMIT_HASH as string
</script>

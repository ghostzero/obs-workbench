<template>
  <AppPopup
    close-position="top-right-outside"
    :max-width="insideOwn3d ? 'xl' : '4xl'"
  >
    <div class="flex flex-col sm:flex-row gap-6">
      <div class="flex-grow">
        <form
          class="space-y-6 flex-grow"
          action="#"
          method="POST"
          @submit.prevent="connect"
        >
          <div class="relative">
            <div class="absolute right-0">
              <a
                v-if="viaExposeServer"
                href="#" @click="viaExposeServer = false"
                class="text-primary-500 hover:text-primary-400 text-xs"
              >
                Use Credentials
              </a>
              <a
                v-else-if="expose"
                href="#" @click="viaExposeServer = true"
                class="text-primary-500 hover:text-primary-400 text-xs"
              >
                Use Expose Server
              </a>
            </div>

            <div v-if="viaExposeServer" class="space-y-6 flex-grow">
              <AppInput
                id="expose-port-or-alias"
                v-model.number="exposeAlias"
                property-name="expose-alias"
                label="Expose Alias"
              />
            </div>

            <div v-else class="space-y-6 flex-grow">
              <AppInput
                id="ip"
                v-model="credentials.ip"
                property-name="ip"
                label="Server IP"
              />

              <AppInput
                id="port"
                v-model.number="credentials.port"
                property-name="port"
                label="Server Port"
              />

              <AppInput
                id="password"
                v-model="credentials.password"
                property-name="password"
                type="password"
                label="Server Password"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                v-model="rememberConnection"
              >
              <label
                for="remember-me"
                class="ml-3 block text-sm leading-6 text-zinc-100"
              >
                Remember connection (on this device only)
              </label>
            </div>

            <div class="text-sm leading-6">
              <a
                href="#"
                class="font-semibold text-primary-500 hover:text-primary-400 hidden"
              >
                How do I connect?
              </a>
            </div>
          </div>

          <AppButton
            type="submit"
            class="w-full"
            :loading="connecting"
            :disabled="viaExposeServer"
            @click="connect"
          >
            Connect
          </AppButton>
        </form>
      </div>
      <div class="flex flex-col sm:flex-row gap-6">
        <div
          v-if="!insideOwn3d"
          class="max-sm:border-b max-sm:border-b-zinc-700 sm:border-r sm:border-r-zinc-700"
        />
        <div
          v-if="!insideOwn3d"
          class="relative"
        >
          <div
            v-if="connections.length === 0"
            class="absolute inset-0 flex text-center items-center justify-center flex-col gap-3 z-10"
          >
            <template v-if="false">
              <div class="text-lg font-bold">
                Login to Manage Your Servers
              </div>
              <div class="text-sm">
                With a free account you can manage your servers and save your settings.
              </div>
              <div>
                <AppButton
                  class="px-8 !bg-zinc-700"
                  variant="outline"
                  @click="openPopup(LoginPopup)"
                >
                  Login / Create Account
                </AppButton>
              </div>
            </template>
            <template v-else>
              <div class="text-xl font-bold">
                No Servers Connected
              </div>
              <div>
                You have no servers stored on this device.
              </div>
              <div>
                <AppButton
                  class="px-8 !bg-zinc-700"
                  variant="outline"
                  @click="openServerManager"
                >
                  Manage Servers
                </AppButton>
              </div>
            </template>
          </div>
          <div
            :class="['grid grid-cols-2 gap-5', {
            'opacity-20 pointer-events-none': connections.length === 0
          }]"
          >
            <template
              v-if="connections.length"
            >
              <template
                v-for="connection in connections"
                :key="connection.id"
              >
                <AppServerQuickConnect
                  :name="connection.name ?? `${connection.ip}:${connection.port}`"
                  @connect="quickConnect(connection)"
                  @delete="deleteConnection(connection)"
                />
              </template>
            </template>
            <template
              v-for="i in 4"
              v-else
              :key="i"
            >
              <AppServerQuickConnect
                :index="i"
                name="My OBSServer"
              />
            </template>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <AppInsecureContentWarning />

      <AppProxyBanner
        v-if="!userStore.user"
        class="mt-8"
        @login="openPopup(LoginPopup)"
      />

      <div class="text-white/50 text-xs text-center font-light mt-6">
        This project is not affiliated with OBS or any of their partners. All copyrights reserved to their respective
        owners. We do not recommend using this in production environments as it is still in early development.
        Workbench Version: {{ gitHash }}
      </div>
    </template>
  </AppPopup>
</template>

<script setup lang="ts">
import AppPopup from '../molecules/AppPopup.vue'
import AppInput from '../atoms/AppInput.vue'
import AppButton from '../atoms/AppButton.vue'
import { computed, ref, Ref, watch } from 'vue'
import { Connection, useAppStore } from '../../store/app'
import { usePopupStore } from '../../store/popup'
import { useNotificationStore } from '../../store/notification'
import AppServerQuickConnect from '../atoms/AppServerQuickConnect.vue'
import AppProxyBanner from '../molecules/AppProxyBanner.vue'
import { useUserStore } from '../../store/user'
import { storeToRefs } from 'pinia'
import LoginPopup from './LoginPopup.vue'
import AppInsecureContentWarning from '../atoms/AppInsecureContentWarning.vue'
import { useConnectionHistory } from '../../composables/useConnectionHistory'

const appStore = useAppStore()
const { close } = usePopupStore()
const connecting = ref(false)
const rememberConnection = ref(true)

const {
  connections,
  saveConnection,
  deleteConnection
} = useConnectionHistory()

const exposeServers = [
  'https://irl-fkb1-2.ghostzero.de:3000'
]

// get credentials from url
const props = new URLSearchParams(window.location.search)
const ip = props.get('ip') || 'localhost'
const port = props.get('port') || '4455'
const password = props.get('password') || ''
const expose = !!props.get('expose')

const credentials: Ref<Connection> = ref({
  tls: false,
  ip,
  port,
  password
})

const viaExposeServer = ref(false)
const exposeAlias = ref('')

watch(() => exposeAlias, async () => {
  const portOrAlias = exposeAlias.value
  // lookup port from alias using /l/alias
  for (const server of exposeServers) {
    const response = await fetch(`${server}/l/${portOrAlias}`)
    if (response.ok) {
      const data = await response.json()
      const url = new URL(server)
      credentials.value.ip = url.hostname
      credentials.value.port = data.port
      viaExposeServer.value = false
      break
    }
  }
}, { deep: true })

const { error } = useNotificationStore()
const { openPopup } = usePopupStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const gitHash = import.meta.env.VITE_GIT_COMMIT_HASH as string

const connect = async () => {
  connecting.value = true
  try {
    if (rememberConnection.value) {
      saveConnection(credentials.value)
    }
    await appStore.connect(credentials.value)
    close()
  } catch (e) {
    error({
      type: 'error',
      title: 'Connection error',
      message: 'Could not connect to the server'
    })
    console.error(e)
  } finally {
    connecting.value = false
  }
}

const quickConnect = (connection: Connection) => {
  credentials.value = connection
  connect()
}

const openServerManager = () => {
  const baseUrl = import.meta.env.VITE_API_URL as string
  window.open(`${baseUrl}/connections`, '_blank')
}

const insideOwn3d = computed(() => {
  return import.meta.env.VITE_INSIDE_OWN3D as string === 'true'
})
</script>

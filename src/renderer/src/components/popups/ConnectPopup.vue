<template>
  <AppPopup
    close-position="top-right-outside"
    max-width="4xl"
  >
    <div class="flex gap-6">
      <form
        class="space-y-6 flex-grow"
        action="#"
        method="POST"
        @submit.prevent="connect"
      >
        <AppInput
          id="ip"
          v-model="credentials.ip"
          name="ip"
          label="Server IP"
        />
        <AppInput
          id="port"
          v-model.number="credentials.port"
          name="port"
          label="Server Port"
        />
        <AppInput
          id="password"
          v-model="credentials.password"
          name="password"
          type="password"
          label="Server Password"
        />

        <div class="hidden flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            >
            <label
              for="remember-me"
              class="ml-3 block text-sm leading-6 text-zinc-100"
            >
              Remember connection
            </label>
          </div>

          <div class="text-sm leading-6">
            <a
              href="#"
              class="font-semibold text-primary-500 hover:text-primary-400"
            >
              How do I connect?
            </a>
          </div>
        </div>

        <AppButton
          type="submit"
          class="w-full"
          :loading="connecting"
          @click="connect"
        >
          Connect
        </AppButton>
      </form>
      <div class="border-r border-r-zinc-700" />
      <div class="relative">
        <div
          v-if="!user || user.connections.length === 0"
          class="absolute inset-0 flex text-center items-center justify-center flex-col gap-3 z-10"
        >
          <template v-if="!user">
            <div class="text-xl font-bold">
              Login to Manage Your Servers
            </div>
            <div>
              With a free account you can manage your servers and save your settings.
            </div>
            <div>
              <AppButton
                class="px-8 !bg-zinc-700"
                variant="outline"
                @click="openPopup('login')"
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
              You have no servers connected to your account.
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
            'opacity-20 pointer-events-none': !user || user.connections.length === 0
          }]"
        >
          <template
            v-if="user && user.connections.length"
          >
            <template
              v-for="connection in user?.connections"
              :key="connection.id"
            >
              <AppServerQuickConnect
                :name="connection.name"
                @connect="quickConnect(connection)"
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

    <template #footer>
      <AppProxyBanner
        v-if="!userStore.user"
        class="mt-12"
        @login="openPopup('login')"
      />

      <div class="text-white/50 text-xs text-center font-light mt-6">
        This project is not affiliated with OBS or any of their partners. All copyrights reserved to their respective
        owners. I do not recommend using this in production environments as it is still in early development.
      </div>
    </template>
  </AppPopup>
</template>

<script setup lang="ts">
import AppPopup from '../molecules/AppPopup.vue'
import AppInput from '../atoms/AppInput.vue'
import AppButton from '../atoms/AppButton.vue'
import { Ref, ref } from 'vue'
import { Connection, useAppStore } from '../../store/app'
import { usePopupStore } from '../../store/popup'
import { useNotificationStore } from '../../store/notification'
import AppServerQuickConnect from '../atoms/AppServerQuickConnect.vue'
import AppProxyBanner from '../molecules/AppProxyBanner.vue'
import { useUserStore } from '../../store/user'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { close } = usePopupStore()
const connecting = ref(false)

const credentials: Ref<Connection> = ref({
  ip: 'localhost',
  port: '4455',
  password: ''
})

const { error } = useNotificationStore()
const { openPopup } = usePopupStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const connect = async () => {
  connecting.value = true
  try {
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
  const baseUrl = import.meta.env.RENDERER_VITE_API_URL as string
  window.open(`${baseUrl}/connections`, '_blank')
}
</script>

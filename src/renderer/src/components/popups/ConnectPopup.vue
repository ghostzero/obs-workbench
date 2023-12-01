<template>
  <AppPopup>
    <form
        class="space-y-6" action="#" method="POST"
        @submit.prevent="connect"
    >
      <AppInput id="ip"
                v-model="credentials.ip"
                name="ip" label="Server IP" />
      <AppInput id="port"
                v-model="credentials.port"
                name="port" label="Server Port" />
      <AppInput id="password"
                v-model="credentials.password"
                name="password" type="password" label="Server Password" />

      <div class="hidden flex items-center justify-between">
        <div class="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox"
                 class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600">
          <label for="remember-me" class="ml-3 block text-sm leading-6 text-zinc-100">
            Remember connection
          </label>
        </div>

        <div class="text-sm leading-6">
          <a href="#" class="font-semibold text-primary-500 hover:text-primary-400">
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
  </AppPopup>
</template>

<script setup lang="ts">
import AppPopup from '../molecules/AppPopup.vue'
import AppInput from '../atoms/AppInput.vue'
import AppButton from '../atoms/AppButton.vue'
import { ref } from 'vue'
import { useAppStore } from '../../store/app'
import { usePopupStore } from '../../store/popup'
import { useNotificationStore } from '../../store/notification'

const store = useAppStore()
const {close} = usePopupStore()
const connecting = ref(false)

const credentials = ref({
  ip: '127.0.0.1',
  port: '4455',
  password: 'o0vDZDSu8O975flK',
})

const {error} = useNotificationStore()

const connect = async () => {
  connecting.value = true
  try {
    await store.connect(`ws://${credentials.value.ip}:${credentials.value.port}`, credentials.value.password)
    close()
  } catch (e) {
    error({
      type: 'error',
      title: 'Connection error',
      message: 'Could not connect to the server',
    })
    console.error(e)
  } finally {
    connecting.value = false
  }
}
</script>
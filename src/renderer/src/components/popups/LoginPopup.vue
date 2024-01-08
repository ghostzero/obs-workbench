<template>
  <AppPopup
    v-if="store.name === 'login'"
  >
    <form
      class="space-y-6 flex-grow"
      action="#"
      method="POST"
      @submit.prevent="login"
    >
      <AppInput
        id="email"
        v-model="credentials.email"
        name="email"
        label="Email"
      />
      <AppInput
        id="password"
        v-model="credentials.password"
        name="password"
        type="password"
        label="Password"
      />

      <AppButton
        type="submit"
        class="w-full"
        :loading="loading"
        @click="login"
      >
        Login
      </AppButton>

      <AppButton
        type="button"
        class="w-full"
        variant="outline"
        @click="createAccount"
      >
        Create a new account
      </AppButton>
    </form>
  </AppPopup>
</template>

<script setup lang="ts">
import { usePopupStore } from '../../store/popup'
import AppPopup from '../molecules/AppPopup.vue'
import { ref } from 'vue'
import AppInput from '../atoms/AppInput.vue'
import AppButton from '../atoms/AppButton.vue'
import { useUserStore } from '../../store/user'

const store = usePopupStore()
const userStore = useUserStore()

const loading = ref(false)
const credentials = ref({
  email: 'test@example.com',
  password: 'password'
})

const login = () => {
  loading.value = true
  try {
    userStore.login(credentials.value)
    store.close()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const createAccount = () => {
  // open popup window
  const baseUrl = import.meta.env.VITE_API_URL as string
  window.open(`${baseUrl}/register`, '_blank', 'width=500,height=500')
}
</script>

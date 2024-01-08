<template>
  <App v-if="enabled" />
  <div
    v-else
    class="text-white/80 flex justify-center items-center h-full"
  >
    <div class="text-center flex flex-col gap-4">
      <div class="text-4xl font-bold">
        Workbench
      </div>
      <div
        v-if="!error"
        class="text-2xl font-light"
      >
        Please wait while we load the app...
      </div>
      <div
        v-if="error"
        class="flex flex-col items-center gap-4 text-2xl font-light"
      >
        <div class="text-rose-500">
          {{ error }}
        </div>
        <div>
          <AppButton
            :destructive="true"
            variant="outline"
            class="text-white/50"
            @click="closeWindow()"
          >
            Close Application
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useUserStore } from './store/user'
// import axios from 'axios'
import { onMounted, ref } from 'vue'
import App from './App.vue'
import AppButton from './components/atoms/AppButton.vue'

const enabled = ref(true)
const error = ref(null)

// const user = useUserStore()

onMounted(() => {
  // axios.get('/sanctum/csrf-cookie')
  //   .then(async () => {
  //     await user.fetch()
  //     enabled.value = true
  //   })
  //   .catch((e) => {
  //     error.value = e
  //   })
})

const closeWindow = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.api.closeWindow()
}
</script>

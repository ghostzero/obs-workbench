<script setup lang="ts">
import {onMounted, ref} from "vue";
import AppSection from "../molecules/AppSection.vue";

const enabled = ref(false)

const loadInsecureContent = () => {
  const img = new Image()
  // noinspection HttpUrlsUsage
  img.src = 'http://insecure-test.obs-workbench.com/pixel.png'
  img.onload = () => {
    console.log('Insecure content loaded')
    enabled.value = false
  }
  img.onerror = () => {
    console.error('Insecure content failed to load')
    enabled.value = true
  }
}

onMounted(() => {
  loadInsecureContent()
})
</script>

<template>
  <AppSection
    v-if="enabled"
    class="mt-8 text-white/50"
  >
    <div class="flex flex-col gap-1.5">
      <div class="text-white text-2xl max-sm:text-xl">
        Insecure Content is Blocked
      </div>
      <div class="max-sm:text-sm">
        By allowing insecure content, you are able to connect to your OBS client without a secure connection.
        To enable insecure content, click the info icon in the address bar. Then click "Site settings" and enable
        "Insecure content".
      </div>
      <div class="flex flex-col sm:flex-row justify-around items-center gap-2 my-2">
        <div>
          <img class="w-full max-h-40 rounded shadow" src="../../assets/insecure-step-1.png">
        </div>
        <div>
          <img class="w-full max-h-40 rounded shadow" src="../../assets/insecure-step-2.png">
        </div>
      </div>
    </div>
  </AppSection>
</template>

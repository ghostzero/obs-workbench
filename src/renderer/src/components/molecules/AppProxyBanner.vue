<template>
  <AppSection
    v-if="!insideOwn3d"
    class="text-white/50"
  >
    <div class="flex gap-8 py-2">
      <div class="flex flex-col gap-1.5">
        <div class="text-white text-2xl max-sm:text-xl">
          Connect OBS to the internet. Access Anywhere.
        </div>
        <div>
          Connect to your OBS client in a consistent, secure, and repeatable manner
          without requiring any changed to network configuration.
        </div>
        <div class="flex flex-col sm:flex-row justify-between items-end max-sm:gap-4">
          <div class="max-sm:w-full">
            <div><i class="fad fa-check-circle fa-fw text-emerald-500" /> Share your OBS with your team</div>
            <div><i class="fad fa-check-circle fa-fw text-emerald-500" /> Secure tunnel connections</div>
            <div><i class="fad fa-check-circle fa-fw text-emerald-500" /> US & EU servers available</div>
            <div><i class="fad fa-check-circle fa-fw text-emerald-500" /> Server video traffic</div>
          </div>
          <div class="max-sm:w-full">
            <AppButton
              class="px-8 max-sm:w-full"
              @click="emit('login')"
            >
              Create an account for free
            </AppButton>
          </div>
        </div>
      </div>
      <div class="overflow-hidden hidden sm:block">
        <img
          src="../../assets/server-status-amico.svg"
          class="h-[350px] -my-[75px] pb-3"
          alt="server logo"
        >
      </div>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import AppSection from './AppSection.vue'
import AppButton from '../atoms/AppButton.vue'
import { computed } from 'vue'

const emit = defineEmits(['login'])

const insideOwn3d = computed(() => {
  return import.meta.env.VITE_INSIDE_OWN3D as string === 'true'
})
</script>

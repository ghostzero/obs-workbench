<template>
  <AppSection class="text-white/50">
    <div class="flex gap-8 py-2">
      <div class="flex flex-col gap-1.5">
        <div class="text-white text-2xl">
          Connect OBS to the internet. Access Anywhere.
        </div>
        <div>
          Connect to your OBS client in a consistent, secure, and repeatable manner
          without requiring any changed to network configuration.
        </div>
        <div class="flex justify-between items-end">
          <div>
            <div><i class="fad fa-check-circle fa-fw text-emerald-500" /> Share your OBS with your team</div>
            <div><i class="fad fa-check-circle fa-fw text-emerald-500" /> Secure tunnel connections</div>
            <div><i class="fad fa-check-circle fa-fw text-emerald-500" /> US & EU servers available</div>
            <div><i class="fad fa-check-circle fa-fw text-emerald-500" /> Server video traffic</div>
          </div>
          <div>
            <AppButton class="px-8">
              Create an account for free
            </AppButton>
          </div>
        </div>
      </div>
      <div class="overflow-hidden">
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
</script>

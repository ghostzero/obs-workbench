<template>
  <div
    class="bg-zinc-800 text-white/90 bg-gradient-to-r from-zinc-800 via-primary-500/25 to-zinc-800 via-5% to-25% w-full z-[60]"
    style="-webkit-app-region: drag"
  >
    <div class="flex items-center justify-between px-8 py-2 gap-5">
      <div class="flex items-center gap-5">
        <button type="button" class="flex justify-center items-center hover:bg-white/10 w-8 h-8 rounded">
          <i class="fas fa-fw fa-bars" />
        </button>

        <div class="flex items-center gap-3 ">
          <div class="bg-gradient-to-r from-primary-500 to-rose-500 w-8 h-8 rounded flex justify-center items-center">
            P
          </div>
          Production Server
          <i class="fal fa-fw fa-chevron-down text-xs" />
        </div>

        <div class="flex items-center gap-2 ">
          <i class="fal fa-fw fa-user" />
          <span>GhostZero</span>
          <i class="fal fa-fw fa-chevron-down text-xs" />
        </div>
      </div>

      <div class="flex items-center gap-6 -mr-6">
        <Controls />

        <div class="flex">
          <AppButton
            variant="ghost-titlebar"
          >
            <i class="fal fa-minus fa-fw"></i>
          </AppButton>
          <AppButton
            variant="ghost-titlebar"
          >
            <i class="fal fa-square fa-fw"></i>
          </AppButton>
          <AppButton
            variant="ghost-titlebar"
            class="hover:bg-primary-900"
          >
            <i class="fal fa-times fa-fw"></i>
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Controls from '../Controls.vue'
import AppButton from '../atoms/AppButton.vue'
</script>

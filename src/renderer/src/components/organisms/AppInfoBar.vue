<template>
  <div class="md:flex md:items-center md:justify-between md:space-x-5">
    <div class="flex shrink-0 items-center space-x-3">
      <div
        v-if="user"
        class="flex-shrink-0"
      >
        <img
          v-if="user"
          class="h-12 w-12 rounded-full"
          :src="user.profile_photo_url"
          alt="avatar"
        >
      </div>
      <div>
        <h1 class="text-2xl font-bold text-white">
          Hi, {{ user?.name || 'Anonymous' }}!
        </h1>
        <p class="text-sm font-medium text-zinc-100">
          Connected to
          <b class="text-zinc-400">
            ws://{{ store.connection.ip }}:{{ store.connection.port }}
          </b>
        </p>
      </div>
    </div>
    <div class="flex shrink-1 overflow-x-scroll gap-2">
      <AppInfoBadge
        :color="store.streamStatus.outputActive ? 'red' : 'gray'"
      >
        {{ store.streamStatus.outputTimecode.split('.')[0] }}
        <template #label>
          Streaming Session
        </template>
      </AppInfoBadge>
      <AppInfoBadge
        :color="store.recordStatus.outputActive ? 'red' : 'gray'"
      >
        {{ store.recordStatus.outputTimecode.split('.')[0] }}
        <template #label>
          Recoding Session
        </template>
      </AppInfoBadge>
      <AppInfoBadge
        :indicator-color="colors(store.stats.cpuUsage, [20, 50], ['green', 'orange', 'red'])"
      >
        {{ store.stats.cpuUsage.toFixed(1) }}%
        <template #label>
          CPU
        </template>
      </AppInfoBadge>
      <AppInfoBadge>
        {{ store.stats.memoryUsage.toFixed(1) }}
        <template #label>
          Memory (MB)
        </template>
      </AppInfoBadge>
      <AppInfoBadge
        :indicator-color="colors(store.stats.activeFps, [24, 60], ['red', 'orange', 'green'])"
      >
        {{ store.stats.activeFps.toFixed(2) }}
        <template #label>
          FPS
        </template>
      </AppInfoBadge>
      <AppInfoBadge
        :indicator-color="colors(store.videoSettings.outputHeight, [720, 1080], ['red', 'orange', 'green'])"
      >
        {{ store.videoSettings.outputWidth }}x{{ store.videoSettings.outputHeight }}
        <template #label>
          Output Resolution
        </template>
      </AppInfoBadge>
      <AppInfoBadge>
        {{ store.stats.outputSkippedFrames }}
        <template #label>
          Output Frame Drops
        </template>
      </AppInfoBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppInfoBadge from '../atoms/AppInfoBadge.vue'
import { useAppStore } from '../../store/app'
import { useUserStore } from '../../store/user'
import { storeToRefs } from 'pinia'

const store = useAppStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

type Color = 'green' | 'orange' | 'red' | 'gray' | undefined

const colors = (value: number, thresholds: number[], colors: string[]): Color => {
  for (let i = 0; i < thresholds.length; i++) {
    if (value < thresholds[i]) {
      return colors[i] as Color
    }
  }
  return colors[colors.length - 1] as Color
}
</script>

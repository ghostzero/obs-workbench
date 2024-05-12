<template>
  <AppGoldenLayoutContainer>
    <div
      v-if="store.inputVolumeMeters.length > 0"
      class="flex h-full gap-4"
    >
      <template
        v-for="volumeMeter in store.inputVolumeMeters"
        :key="volumeMeter.inputName"
      >
        <VolumeMeter :volume-meter="volumeMeter" />
      </template>
    </div>
    <AppEmptyState
      v-else
      :icon="{ name: 'sliders-up' }"
      title="No Audio Sources"
      description="Your **Program** doesn't have any audio sources."
    />
  </AppGoldenLayoutContainer>
</template>

<script setup lang="ts">
import { useAppStore } from '../../store/app'
import VolumeMeter from '../molecules/VolumeMeter.vue'
import AppEmptyState from '../atoms/AppEmptyState.vue'
import AppGoldenLayoutContainer from "../atoms/AppGoldenLayoutContainer.vue";

const store = useAppStore()
</script>

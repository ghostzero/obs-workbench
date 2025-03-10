<template>
  <div
    class="mt-6 shrink-0 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
    <AppButton
      variant="ghost-titlebar"
    >
      <i class="fal fa-question-circle fa-fw mr-1" />
      <span class="max-lg:hidden">Help</span>
    </AppButton>

    <AppButton
      variant="ghost-titlebar"
      @click="openPopup(WhatsNewPopup)"
    >
      <i class="fal fa-sparkles fa-fw" />
    </AppButton>

    <AppButton
      :loading="streamingLoading"
      :variant="store.streamStatus.outputActive ? 'solid-titlebar' : 'ghost-titlebar'"
      @click="toggleStreaming"
    >
      <i :class="['far fa-signal-stream fa-fw lg:hidden']" />
      <span class="max-lg:hidden">{{ store.streamStatus.outputActive ? 'Stop Streaming' : 'Start Streaming' }}</span>
    </AppButton>

    <AppButton
      :loading="recordingLoading"
      :variant="store.recordStatus.outputActive ? 'solid-titlebar' : 'ghost-titlebar'"
      @click="toggleRecording"
    >
      <i class="far fa-film lg:hidden" />
      <span class="max-lg:hidden">{{ store.recordStatus.outputActive ? 'Stop Recording' : 'Start Recording' }}</span>
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useObs } from '../../composables/useObs'
import { useAppStore } from '../../store/app'
import { useTimeoutable } from '../../composables/useTimeoutable'
import AppButton from './AppButton.vue'
import WhatsNewPopup from '../popups/WhatsNewPopup.vue'
import { usePopupStore } from '../../store/popup'

const { obs } = useObs()
const store = useAppStore()
const { openPopup } = usePopupStore()

const {
  isLoading: recordingLoading,
  wrappedFunction: toggleRecording,
  stateChanged: recordingStateChanged
} = useTimeoutable(async () => {
  await obs.call('ToggleRecord')
}, { timeout: 5000, state: store.recordStatus.outputActive })

watch(() => store.recordStatus.outputActive, recordingStateChanged, { deep: true })

const {
  isLoading: streamingLoading,
  wrappedFunction: toggleStreaming,
  stateChanged: streamingStateChanged
} = useTimeoutable(async () => {
  await obs.call('ToggleStream')
}, { timeout: 5000, state: store.streamStatus.outputActive })

watch(() => store.streamStatus.outputActive, streamingStateChanged, { deep: true })
</script>

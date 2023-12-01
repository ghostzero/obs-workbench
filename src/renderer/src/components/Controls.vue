<template>
  <div
      class="mt-6 shrink-0 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
    <AppButton
        variant="ghost"
    >
      <i class="fal fa-question-circle fa-fw mr-1"></i>
      Help
    </AppButton>

    <AppButton
        variant="ghost"
    >
      <i class="fal fa-sparkles fa-fw"></i>
    </AppButton>

    <AppButton
        :loading="streamingLoading"
        :variant="store.streamStatus.outputActive ? 'solid' : 'ghost'"
        @click="toggleStreaming"
    >
      {{ store.streamStatus.outputActive ? 'Stop Streaming' : 'Start Streaming' }}
    </AppButton>

    <AppButton
        :loading="recordingLoading"
        :variant="store.recordStatus.outputActive ? 'solid' : 'ghost'"
        @click="toggleRecording"
    >
      {{ store.recordStatus.outputActive ? 'Stop Recording' : 'Start Recording' }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import AppButton from '../components/atoms/AppButton.vue'
import { useObs } from '../composables/useObs'
import { useAppStore } from '../store/app'
import { watch } from 'vue'
import { useTimeoutable } from '../composables/useTimeoutable'

const {obs} = useObs()
const store = useAppStore()

const {
  isLoading: recordingLoading,
  wrappedFunction: toggleRecording,
  stateChanged: recordingStateChanged,
} = useTimeoutable(async () => {
  await obs.call('ToggleRecord')
}, {timeout: 5000, state: store.recordStatus.outputActive})

watch(() => store.recordStatus.outputActive, recordingStateChanged, {deep: true})

const {
  isLoading: streamingLoading,
  wrappedFunction: toggleStreaming,
  stateChanged: streamingStateChanged,
} = useTimeoutable(async () => {
  await obs.call('ToggleStream')
}, {timeout: 5000, state: store.streamStatus.outputActive})

watch(() => store.streamStatus.outputActive, streamingStateChanged, {deep: true})

</script>

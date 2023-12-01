<template>
  <div class="grid">
    <div class="flex gap-3">
      <div class="flex-1 w-[1/2]">
        <AppSectionTitle>Preview: {{ store.currentPreviewSceneName }}</AppSectionTitle>
        <div class="relative mt-4">
          <img
              alt="preview"
              ref="previewImage"
              class="absolute bg-black aspect-[16/9] w-full rounded-md shadow z-20">
          <img
              alt="preview ambient"
              ref="previewAmbientImage"
              class="bg-black aspect-[16/9] w-full rounded-md blur-lg z-10">
        </div>
      </div>
      <div class="self-center flex flex-col gap-3 z-30">
        <AppButton @click="transition" class="mt-[44px]">
          <i class="fas fa-arrow-right-arrow-left"></i>
        </AppButton>
      </div>
      <div class="flex-1 w-[1/2]">
        <AppSectionTitle>Program: {{ store.currentProgramSceneName }}</AppSectionTitle>
        <div class="relative mt-4">
          <img
              alt="program"
              ref="programImage"
              class="absolute bg-black aspect-[16/9] w-full rounded-md shadow z-20">
          <img
              alt="program ambient"
              ref="programAmbientImage"
              class="bg-black aspect-[16/9] w-full rounded-md blur-lg z-10">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '../atoms/AppButton.vue'
import { useObs } from '../../composables/useObs'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useAppStore } from '../../store/app'
import AppSectionTitle from '../atoms/AppSectionTitle.vue'

const {obs} = useObs()
const store = useAppStore()

const previewImage = ref<HTMLImageElement>()
const previewAmbientImage = ref<HTMLImageElement>()
const programImage = ref<HTMLImageElement>()
const programAmbientImage = ref<HTMLImageElement>()

const transition = async () => {
  const {currentPreviewSceneName} = await obs.call('GetCurrentPreviewScene')
  await obs.call('SetCurrentProgramScene', {
    sceneName: currentPreviewSceneName,
  })
  updateScreenshots()
}

let timeoutId: any

const updateScreenshots = () => {
  // Clear any existing timeout to avoid overlapping calls
  clearTimeout(timeoutId)

  // Store the promises in an array
  const promises = []

  promises.push(
      obs.call('GetSourceScreenshot', {
        sourceName: store.currentProgramSceneName,
        imageFormat: 'jpg',
        imageWidth: 640,
        imageCompressionQuality: 50,
      }).then((programScreenshot) => {
        if (programImage.value)
          programImage.value.src = programScreenshot.imageData
        if (programAmbientImage.value)
          programAmbientImage.value.src = programScreenshot.imageData
      }),
  )

  promises.push(
      obs.call('GetSourceScreenshot', {
        sourceName: store.currentPreviewSceneName,
        imageFormat: 'jpg',
        imageWidth: 640,
        imageCompressionQuality: 50,
      }).then((previewScreenshot) => {
        if (previewImage.value)
          previewImage.value.src = previewScreenshot.imageData
        if (previewAmbientImage.value)
          previewAmbientImage.value.src = previewScreenshot.imageData
      }),
  )

  // Use Promise.all to wait for all promises to resolve
  Promise.all(promises).then(() => {
    timeoutId = setTimeout(() => updateScreenshots(), 150)
  }).catch(error => {
    console.error('Failed to update screenshots:', error)
    timeoutId = setTimeout(() => updateScreenshots(), 250)
  })
}

onMounted(async () => {
  updateScreenshots()
})

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>
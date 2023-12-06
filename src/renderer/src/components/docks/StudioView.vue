<template>
  <div
    ref="view"
    class="grid h-full px-4"
  >
    <div class="flex items-center gap-3">
      <div class="flex-1 h-full w-[1/2]">
        <AppSectionTitle>Preview: {{ store.currentPreviewSceneName }}</AppSectionTitle>
        <div class="flex h-[calc(100%-30px)] items-center justify-center">
          <div class="relative">
            <!--suppress RequiredAttributes -->
            <img
              ref="previewImage"
              alt="preview"
              class="absolute bg-black rounded-md shadow z-20"
              :style="{width: `${scaledWidth}px`, height: `${scaledHeight}px`}"
            >
            <!--suppress RequiredAttributes -->
            <img
              ref="previewAmbientImage"
              alt="preview ambient"
              class="bg-black rounded-md blur-[9px] z-10"
              :style="{width: `${scaledWidth}px`, height: `${scaledHeight}px`}"
            >
          </div>
        </div>
      </div>
      <div class="self-center flex flex-col gap-3 z-30">
        <AppButton
          class="mt-[44px]"
          @click="transition"
        >
          <i class="fas fa-arrow-right-arrow-left" />
        </AppButton>
      </div>
      <div
        class="flex-1 h-full w-[1/2]"
      >
        <AppSectionTitle>Program: {{ store.currentProgramSceneName }}</AppSectionTitle>
        <div class="flex h-[calc(100%-30px)] items-center justify-center">
          <div class="relative">
            <!--suppress RequiredAttributes -->
            <img
              ref="programImage"
              alt="program"
              class="absolute bg-black rounded-md shadow z-20"
              :style="{width: `${scaledWidth}px`, height: `${scaledHeight}px`}"
            >
            <!--suppress RequiredAttributes -->
            <img
              ref="programAmbientImage"
              alt="program ambient"
              class="bg-black rounded-md blur-[9px] z-10"
              :style="{width: `${scaledWidth}px`, height: `${scaledHeight}px`}"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useObs } from '../../composables/useObs'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useAppStore } from '../../store/app'
import AppSectionTitle from '../atoms/AppSectionTitle.vue'
import AppButton from '../atoms/AppButton.vue'

const { obs } = useObs()
const store = useAppStore()

const previewImage = ref<HTMLImageElement>()
const previewAmbientImage = ref<HTMLImageElement>()
const programImage = ref<HTMLImageElement>()
const programAmbientImage = ref<HTMLImageElement>()

const scaledWidth = ref(400)
const scaledHeight = ref(scaledWidth.value * 9 / 16)
const view = ref<HTMLDivElement>()

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect

    const viewWidth = width / 2 - 30
    const viewHeight = height - 50

    // ensure the image is always 16:9
    // ensure the image fits within the view

    if (viewWidth * 9 / 16 > viewHeight) {
      scaledWidth.value = viewHeight * 16 / 9
      scaledHeight.value = viewHeight
    } else {
      scaledWidth.value = viewWidth
      scaledHeight.value = viewWidth * 9 / 16
    }
  }
})

onMounted(() => {
  if (view.value) {
    observer.observe(view.value)
    console.log('observing')
  }
})

onBeforeUnmount(() => {
  if (view.value) observer.unobserve(view.value)
})

const transition = async () => {
  const { currentPreviewSceneName } = await obs.call('GetCurrentPreviewScene')
  await obs.call('SetCurrentProgramScene', {
    sceneName: currentPreviewSceneName
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
      imageCompressionQuality: 50
    }).then((programScreenshot) => {
      if (programImage.value)
        programImage.value.src = programScreenshot.imageData
      if (programAmbientImage.value)
        programAmbientImage.value.src = programScreenshot.imageData
    })
  )

  promises.push(
    obs.call('GetSourceScreenshot', {
      sourceName: store.currentPreviewSceneName,
      imageFormat: 'jpg',
      imageWidth: 640,
      imageCompressionQuality: 50
    }).then((previewScreenshot) => {
      if (previewImage.value)
        previewImage.value.src = previewScreenshot.imageData
      if (previewAmbientImage.value)
        previewAmbientImage.value.src = previewScreenshot.imageData
    })
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

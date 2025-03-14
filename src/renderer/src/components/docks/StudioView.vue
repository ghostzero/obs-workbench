<template>
  <AppGoldenLayoutContainer>
    <div
      ref="view"
      class="grid h-full px-2"
    >
      <div class="flex items-center gap-3">
        <div
          v-if="store.currentPreviewSceneName"
          class="flex-1 h-full w-[1/2]"
        >
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
        <div
          v-if="store.currentPreviewSceneName"
          class="self-center flex flex-col gap-3 z-30"
        >
          <AppButton
            class="mt-[44px]"
            @click="transition"
          >
            <i class="fas fa-arrow-right-arrow-left" />
          </AppButton>
        </div>
        <div
          :class="['flex-1 h-full', store.currentPreviewSceneName ? 'w-[1/2]' : 'w-full']"
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
  </AppGoldenLayoutContainer>
</template>

<script setup lang="ts">
import { useObs } from '../../composables/useObs'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAppStore } from '../../store/app'
import AppSectionTitle from '../atoms/AppSectionTitle.vue'
import AppButton from '../atoms/AppButton.vue'
import AppGoldenLayoutContainer from '../atoms/AppGoldenLayoutContainer.vue'

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

    const allowedWidth = store.studioMode ? (width / 2) : width
    const viewWidth = allowedWidth - 30
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

watch(() => store.studioMode, () => {
  observer.disconnect()
  if (view.value) observer.observe(view.value)
})

onMounted(() => {
  if (view.value) observer.observe(view.value)
})

onBeforeUnmount(() => {
  if (view.value) observer.unobserve(view.value)
})

const imageFormats = store.version.supportedImageFormats || []
const preferredImageFormat = ['webp', 'jpeg', 'png'].find(format => imageFormats.includes(format)) || 'jpg'

const transition = async () => {
  const { currentPreviewSceneName } = await obs.call('GetCurrentPreviewScene')
  await obs.call('SetCurrentProgramScene', {
    sceneName: currentPreviewSceneName
  })
  updateScreenshots(preferredImageFormat)
}

let timeoutId: ReturnType<typeof setTimeout>

const updateScreenshots = (imageFormat: string = 'jpeg') => {
  // Clear any existing timeout to avoid overlapping calls
  clearTimeout(timeoutId)

  // Store the promises in an array
  const promises: Promise<unknown>[] = []

  promises.push(
    obs.call('GetSourceScreenshot', {
      sourceName: store.currentProgramSceneName,
      imageFormat,
      imageWidth: store.screenshot.imageWidth,
      imageCompressionQuality: store.screenshot.imageCompressionQuality
    }).then((programScreenshot) => {
      store.updateBandwidth(programScreenshot.imageData.length)
      if (programImage.value)
        programImage.value.src = programScreenshot.imageData
      if (programAmbientImage.value)
        programAmbientImage.value.src = programScreenshot.imageData
    })
  )

  if (store.currentPreviewSceneName) {
    promises.push(
      obs.call('GetSourceScreenshot', {
        sourceName: store.currentPreviewSceneName,
        imageFormat,
        imageWidth: store.screenshot.imageWidth,
        imageCompressionQuality: store.screenshot.imageCompressionQuality
      }).then((previewScreenshot) => {
        store.updateBandwidth(previewScreenshot.imageData.length)
        if (previewImage.value)
          previewImage.value.src = previewScreenshot.imageData
        if (previewAmbientImage.value)
          previewAmbientImage.value.src = previewScreenshot.imageData
      })
    )
  }

  // Use Promise.all to wait for all promises to resolve
  Promise.all(promises).then(() => {
    timeoutId = setTimeout(() => updateScreenshots(preferredImageFormat), 150)
  }).catch(error => {
    console.error('Failed to update screenshots:', error)
    timeoutId = setTimeout(() => updateScreenshots(preferredImageFormat), 100)
  })
}

onMounted(async () => {
  updateScreenshots(preferredImageFormat)
})

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

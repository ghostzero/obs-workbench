<template>
  <AppPopup max-width="3xl">
    <div class="grid gap-4">
      <div class="text-center py-6">
        <i class="fas fa-layer-plus text-zinc-600 text-6xl mb-3" />
        <div>
          <h2 class="text-2xl font-bold">
            Add Source
          </h2>
          <p class="text-zinc-400">
            Add a new source to the current scene
          </p>
        </div>
      </div>
      <div>
        <AppInput
          id="name"
          v-model="inputName"
          label="Name"
          name="name"
        />
      </div>
      <div>
        <div class="border-b border-zinc-700" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <template v-for="source in sources">
          <div v-if="!source.native">
            <AppButton
              :variant="source.name.includes('Scene Builder') ? 'own3d' : 'secondary'"
              class="group w-full"
              @click="source.create"
            >
              <div
                v-if="source.name.includes('Scene Builder')"
                class="text-[10px] opacity-90 absolute top-1 right-1 bg-[#ff9602] text-white group-hover:bg-white group-hover:text-[#ff9602] px-1 rounded"
              >
                Recommended
              </div>
              <i :class="['mr-0.1 text-xl', source.icon]" />
              <div class="text-xs opacity-70">
                {{ source.name }}
              </div>
            </AppButton>
          </div>
        </template>
      </div>
      <div class="flex items-center gap-2 -my-2">
        <div class="flex-1">
          <div class="border-b border-zinc-700" />
        </div>
        <div class="flex-none text-sm text-zinc-500">
          or
        </div>
        <div class="flex-1">
          <div class="border-b border-zinc-700" />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2 overflow-y-auto h-40">
        <template v-for="source in sources">
          <div v-if="source.native">
            <AppButton
              variant="outline"
              class="w-full"
              @click="source.create"
            >
              <i :class="['mr-0.1 text-xl', source.icon]" />
              <div class="text-xs text-white/70">
                {{ source.name }}
              </div>
            </AppButton>
          </div>
        </template>
      </div>

      <!-- wizard steps in bulls -->
      <div>
        <div class="border-b border-zinc-700" />
      </div>
      <div class="flex gap-2 justify-center text-xs">
        <i class="fas fa-circle text-zinc-200" />
        <i class="fas fa-circle text-zinc-600" />
      </div>
    </div>
  </AppPopup>
</template>

<script setup lang="ts">
import { usePopupStore } from '../../store/popup'
import AppPopup from '../molecules/AppPopup.vue'
import AppButton from '../atoms/AppButton.vue'
import { useSceneStore } from '../../store/scene'
import { useAppStore } from '../../store/app'
import AppInput from '../atoms/AppInput.vue'
import { ref } from 'vue'

const inputName = ref('New Source')

const sources = ref<{
  name: string,
  icon: string,
  native: boolean,
  create: () => void
}[]>([
  {
    name: 'Audio Input Capture',
    icon: 'fas fa-microphone',
    native: true,
    create: () => {}
  },
  {
    name: 'Audio Output Capture',
    icon: 'fas fa-volume-up',
    native: true,
    create: () => {}
  },
  {
    name: 'Browser',
    icon: 'fas fa-globe',
    native: true,
    create: () => {}
  },
  {
    name: 'Color Source',
    icon: 'fas fa-palette',
    native: true,
    create: () => {}
  },
  {
    name: 'Image',
    icon: 'fas fa-image',
    native: true,
    create: () => {}
  },
  {
    name: 'Image Slide Show',
    icon: 'fas fa-images',
    native: true,
    create: () => {}
  },
  {
    name: 'JACK Input Client',
    icon: 'fas fa-microphone-alt',
    native: true,
    create: () => {}
  },
  {
    name: 'Media Source',
    icon: 'fas fa-film',
    native: true,
    create: () => {}
  },
  {
    name: 'Scene',
    icon: 'fas fa-layer-group',
    native: true,
    create: () => {}
  },
  {
    name: 'Screen Capture',
    icon: 'fas fa-desktop',
    native: true,
    create: () => {}
  },
  {
    name: 'Text',
    icon: 'fas fa-font',
    native: true,
    create: () => {}
  },
  {
    name: 'Video Capture Device (PipeWire)',
    icon: 'fas fa-video',
    native: true,
    create: () => {}
  },
  {
    name: 'Video Capture Device (V4L2)',
    icon: 'fas fa-video',
    native: true,
    create: () => {}
  },
  {
    name: 'Window Capture (PipeWire)',
    icon: 'fas fa-window-restore',
    native: true,
    create: () => {}
  },

  // additional sources
  {
    name: 'Scene Builder',
    icon: 'fas fa-paintbrush-pencil',
    native: false,
    create: () => createSrtSource(app.currentSceneName, inputName.value, 'caller')
      .then(() => popup.close())
  },
  {
    name: 'SRT Caller Source',
    icon: 'fas fa-phone',
    native: false,
    create: () => createSrtSource(app.currentSceneName, inputName.value, 'caller')
      .then(() => popup.close())
  },
  {
    name: 'SRT Listener Source',
    icon: 'fas fa-phone-alt',
    native: false,
    create: () => createSrtSource(app.currentSceneName, inputName.value, 'listener')
      .then(() => popup.close())
  },
])

const app = useAppStore()
const popup = usePopupStore()
const {createSrtSource} = useSceneStore()
</script>

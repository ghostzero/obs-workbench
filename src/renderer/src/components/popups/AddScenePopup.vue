<template>
  <AppPopup>
    <div class="flex gap-6">
      <div class="text-center w-2/5 py-6">
        <i class="fas fa-grid-2-plus text-zinc-600 text-6xl mb-3" />
        <div>
          <h2 class="text-2xl font-bold">
            Add Scene
          </h2>
          <p class="text-zinc-400">
            Please enter the name of the new scene
          </p>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-4 justify-center">
        <div>
          <AppInput
            id="name"
            v-model="sceneName"
            name="name"
          />
        </div>
        <div>
          <div class="border-b border-zinc-700" />
        </div>
        <div>
          <AppButton
            variant="outline"
            class="w-full"
            @click="createScene(sceneName).then(() => popup.close())"
          >
            Create Scene
          </AppButton>
        </div>
      </div>
    </div>
  </AppPopup>
</template>

<script setup lang="ts">
import { usePopupStore } from '../../store/popup'
import AppPopup from '../molecules/AppPopup.vue'
import AppButton from '../atoms/AppButton.vue'
import { useSceneStore } from '../../store/scene'
import AppInput from '../atoms/AppInput.vue'
import { ref } from 'vue'

const sceneName = ref('New Scene')

const popup = usePopupStore()
const {createScene} = useSceneStore()
</script>

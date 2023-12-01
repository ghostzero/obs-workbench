<template>
  <AppPopup v-if="popup.name === 'add-source'">
    <div class="grid gap-4">
      <div class="text-center py-6">
        <i class="fas fa-grid-2-plus text-zinc-600 text-6xl mb-3"></i>
        <div>
          <h2 class="text-2xl font-bold">Add Source</h2>
          <p class="text-zinc-400">Add a new source to the current scene.</p>
        </div>
      </div>
      <div>
        <AppInput id="name" label="Name" name="name" v-model="inputName" />
      </div>
      <div>
        <div class="border-b border-zinc-700" />
      </div>
      <AppButton
          variant="outline"
          @click="createSrtSource(app.currentSceneName, inputName, 'caller').then(() => popup.close())"
      >
        SRT Caller Source
      </AppButton>
      <AppButton
          variant="outline"
          @click="createSrtSource(app.currentSceneName, inputName, 'listener').then(() => popup.close())"
      >
        SRT Listener Source
      </AppButton>
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

const app = useAppStore()
const popup = usePopupStore()
const {createSrtSource} = useSceneStore()
</script>
<template>
  <AppPopup
      v-if="store.name === 'confirm'"
  >
    <div class="my-3 text-center">
      {{ store.data.message }}
    </div>

    <div class="flex gap-3">
      <AppButton
          @click="store.close(true)"
          class="w-full"
      >
        Confirm
      </AppButton>
      <AppButton
          variant="outline"
          @click="store.close(false)"
          class="w-full"
      >
        Cancel
      </AppButton>
    </div>
  </AppPopup>
</template>

<script setup lang="ts">
import { usePopupStore } from '../../store/popup'
import AppButton from '../atoms/AppButton.vue'
import AppPopup from '../molecules/AppPopup.vue'

const store = usePopupStore()
</script>
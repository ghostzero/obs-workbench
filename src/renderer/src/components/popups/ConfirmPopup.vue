<template>
  <AppPopup>
    <div class="my-3 text-center">
      {{ store.data?.message }}
    </div>

    <div class="flex gap-3">
      <AppButton
        class="w-full"
        @click="store.close(true)"
      >
        Confirm
      </AppButton>
      <AppButton
        variant="outline"
        class="w-full"
        @click="store.close(false)"
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

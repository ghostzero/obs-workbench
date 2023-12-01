<template>
  <div
      v-if="store.name"
      class="fixed inset-0 bg-zinc-950/90 z-50 flex items-center justify-center"
  >
    <ConnectPopup v-if="store.name === 'connect'" v-bind="store.data" />
    <ConfirmPopup />
    <AddSourcePopup />
  </div>
</template>

<script setup lang="ts">
import { usePopupStore } from '../../store/popup'
import ConnectPopup from '../popups/ConnectPopup.vue'
import ConfirmPopup from '../popups/ConfirmPopup.vue'
import AddSourcePopup from '../popups/AddSourcePopup.vue'

const store = usePopupStore()
</script>
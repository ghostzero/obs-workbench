<template>
  <AppGoldenLayoutContainer>
    <template v-if="false">

    </template>
    <AppEmptyState
      v-else
      :icon="{ name: 'server' }"
      :actions="actions"
      title="No IRL Control"
      description="Not connected to a server"
    />
  </AppGoldenLayoutContainer>
</template>

<script setup lang="ts">
import { useAppStore } from '../../store/app'
import AppEmptyState from '../atoms/AppEmptyState.vue'
import { ButtonVariant } from '../atoms/AppButton.vue'
import AppGoldenLayoutContainer from '../atoms/AppGoldenLayoutContainer.vue'
import { usePopupStore } from '../../store/popup'

const { openPopup } = usePopupStore()
const store = useAppStore()

const actions = [
  {
    label: 'Add Server',
    variant: 'outline' as ButtonVariant,
    onClick: () => {
    }
  }
]
</script>

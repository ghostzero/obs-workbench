<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 top-[52px] flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <template
        v-for="notification in notifications"
        :key="notification.id"
      >
        <AppNotification
          :notification="notification"
          @close="notifications.splice(notifications.indexOf(notification), 1)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNotification from '../molecules/AppNotification.vue'
import { useNotificationStore } from '../../store/notification'

const {notifications} = useNotificationStore()
</script>

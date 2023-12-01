<template>
  <transition name="notification">
    <div
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-zinc-700 shadow-lg ring-1 ring-black ring-opacity-5">
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <i v-if="props.notification.type === 'error'" class="fas fa-exclamation-circle text-rose-500 text-2xl"></i>
            <i v-else-if="props.notification.type === 'success'" class="fas fa-exclamation-circle text-rose-500 text-2xl"></i>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-zinc-100">
              {{ props.notification.title }}
            </p>
            <p class="mt-1 text-sm text-zinc-400">
              {{ props.notification.message }}
            </p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
                type="button"
                class="inline-flex rounded-md bg-zinc-700 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                @click="$emit('close')"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, PropType } from 'vue'
import { Notification } from '../../store/notification'

const props = defineProps({
  notification: {
    type: Object as PropType<Notification>,
    required: true,
  },
})

const $emit = defineEmits(['close'])

onMounted(() => {
  setTimeout(() => {
    $emit('close')
  }, 5000)
})

</script>

<style scoped>
.notification-enter-active {
  @apply transform ease-out duration-300;
}

.notification-enter-from,
.notification-enter-to {
  @apply opacity-0 ease-out duration-300;
}

.notification-enter-from {
  @apply translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2;
}

.notification-enter-to {
  @apply translate-y-0 opacity-100 sm:translate-x-0;
}

/* Leaving */
.notification-leave-active {
  @apply ease-in duration-100;
}

.notification-leave-from {
  opacity: 100;
}

.notification-leave-to {
  opacity: 0;
}
</style>

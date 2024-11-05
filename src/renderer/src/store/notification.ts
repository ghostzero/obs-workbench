import { defineStore } from 'pinia'

export interface Notification {
  id?: string
  title?: string
  message?: string
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface State {
  notifications: Notification[]
}

export const useNotificationStore = defineStore('notification', {
  state: (): State => {
    return {
      notifications: []
    }
  },
  actions: {
    success(notification: Notification) {
      this.notifications.push(notification)
    },
    error(notification: Notification) {
      this.notifications.push(notification)
    },
    exception(error: { name: string, message: string }) {
      this.error({
        id: Math.random().toString(36),
        title: error?.name || 'Error',
        message: error?.message || 'An error occurred',
        type: 'error'
      })
    }
  }
})

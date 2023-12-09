import { defineStore } from 'pinia'
import axios from 'axios'
import { Connection } from './app'

interface StoredConnection extends Connection {
  id: number
  name: string
  color: string
}

export interface State {
  user: {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
    connections: StoredConnection[]
  } | null
}

export const useUserStore = defineStore('user', {
  state: (): State => {
    return {
      user: null,
    }
  },
  actions: {
    async login(credentials: { email: string; password: string }): Promise<void> {
      const response = await axios.post('electron/login', credentials)
      this.user = response.data
    },
    async fetch(): Promise<void> {
      try {
        const user = await axios.get('api/user')
        this.user = user.data
      } catch (error) {
        this.user = null
      }
    },
    async logout(): Promise<void> {
      await axios.post('electron/logout')
      this.user = null
    }
  }
})

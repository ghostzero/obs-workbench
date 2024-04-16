import { defineStore } from 'pinia'
import axios from 'axios'
import { Connection } from './app'

interface StoredConnection extends Connection {
  id: number
  name: string
  color: string
}

interface CloudServer extends Connection {
  ready: boolean
}

export interface State {
  user: {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    profile_photo_url: string
    created_at: string
    updated_at: string
    connections: StoredConnection[]
    cloud_servers: CloudServer[]
  } | null
}

export const useUserStore = defineStore('user', {
  state: (): State => {
    return {
      user: null,
    }
  },
  actions: {
    async sync(): Promise<void> {
      const response = await axios.post('electron/sync')
      this.user = response.data
    },
    async waitForCloudServer(id: number): Promise<void> {
      const cloudServer = this.user?.cloud_servers.find(server => server.id === id)
      if (!cloudServer) return

      while (!cloudServer.ready) {
        await new Promise(resolve => setTimeout(resolve, 10000))
        await this.sync()
      }
    },
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

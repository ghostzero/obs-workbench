import { defineStore } from 'pinia'
import {DefineComponent} from "vue";
import ConnectPopup from "../components/popups/ConnectPopup.vue";
import ConfirmPopup from "../components/popups/ConfirmPopup.vue";

export interface Data {
  [key: string]: unknown
}

export interface State {
  component: PopupComponent | null,
  data: Data,
  confirmed: boolean,
}

export type PopupComponent = DefineComponent<{}, {}, any>

export const usePopupStore = defineStore('popup', {
  state: (): State => {
    return {
      component: ConnectPopup,
      data: {},
      confirmed: false
    }
  },
  actions: {
    openPopup(component: PopupComponent, data: Data = {}): void {
      this.component = component
      this.data = data
    },
    async confirm(data: Data): Promise<boolean> {
      this.component = ConfirmPopup
      this.data = data

      return new Promise((resolve) => {
        // wait for close method to be called
        const interval = setInterval(() => {
          if (this.component === null) {
            clearInterval(interval)
            resolve(this.confirmed)
          }
        }, 100)
      })
    },
    close(confirmed = false): void {
      this.component = null
      this.data = {}
      this.confirmed = confirmed
    }
  }
})

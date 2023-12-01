import { defineStore } from 'pinia'

export interface State {
    name: string | null,
    data: any,
    confirmed: boolean,
}

export const usePopupStore = defineStore('popup', {
    state: (): State => {
        return {
            name: 'connect',
            data: {},
            confirmed: false,
        }
    },
    actions: {
        openPopup(name: string, data: any = {}): void {
            this.name = name
            this.data = data
        },
        async confirm(data: any): Promise<boolean> {
            this.name = 'confirm'
            this.data = data

            return new Promise((resolve) => {
                // wait for close method to be called
                const interval = setInterval(() => {
                    if (this.name === null) {
                        clearInterval(interval)
                        resolve(this.confirmed)
                    }
                }, 100)
            })
        },
        close(confirmed: boolean = false): void {
            this.name = null
            this.data = {}
            this.confirmed = confirmed
        },
    },
})
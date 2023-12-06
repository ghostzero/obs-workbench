import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

import 'golden-layout/dist/css/goldenlayout-base.css'
import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css'
import './style.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')

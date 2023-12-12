import { createApp } from 'vue'
import Bootstrap from './Bootstrap.vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import 'golden-layout/dist/css/goldenlayout-base.css'
import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css'
import './style.css'

axios.defaults.baseURL = import.meta.env.RENDERER_VITE_API_URL as string
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

const pinia = createPinia()
const app = createApp(Bootstrap)

app.use(pinia)

app.mount('#app')

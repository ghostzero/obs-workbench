import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import 'golden-layout/dist/css/goldenlayout-base.css'
import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css'
import './style.css'
import { useUserStore } from './store/user'

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

const user = useUserStore()

axios.get('/sanctum/csrf-cookie').then(async (response) => {
  await user.fetch()
  app.mount('#app')
});

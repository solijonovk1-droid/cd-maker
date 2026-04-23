import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useAuthStore } from './stores/authStore'

async function init() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)
  
  const authStore = useAuthStore()
  try {
    await authStore.init()
    console.log('Auth initialized')
  } catch (e) {
    console.error('Auth initialization failed', e)
  }
  
  app.use(router)
  app.mount('#app')
}

init()

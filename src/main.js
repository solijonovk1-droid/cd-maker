import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useAuthStore } from './stores/authStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth session before mounting
const authStore = useAuthStore()
<<<<<<< HEAD
authStore.init().catch((err) => {
  console.warn('Auth init failed, mounting anyway:', err)
}).finally(() => {
=======
authStore.init().then(() => {
>>>>>>> 0b082d7c972923bd2155ae2885867de5f1c08364
  app.mount('#app')
})

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { initAuth } from './lib/auth.js'
import './style.css'

// Initialize auth listener before mounting
initAuth()

createApp(App).use(router).mount('#app')

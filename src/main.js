import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import './style.css'
import App from './App.vue'

// Initialize Vercel Web Analytics
inject()

createApp(App).mount('#app')

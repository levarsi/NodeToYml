import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import './style.css'
import App from './App.vue'

// Initialize Vercel Web Analytics
inject()

// Initialize Vercel Speed Insights
injectSpeedInsights()

createApp(App).mount('#app')

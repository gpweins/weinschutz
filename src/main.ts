import { ViteSSG } from 'vite-ssg'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import { routes } from './router'

import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@/styles/main.css'

export const createApp = ViteSSG(App, { routes }, ({ app }) => {
  app.use(MotionPlugin)
})

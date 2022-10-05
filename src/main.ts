import { createApp } from 'vue'
import '@unocss/reset/sanitize/sanitize.css'
import 'uno.css'

import './styles/index.scss'
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')

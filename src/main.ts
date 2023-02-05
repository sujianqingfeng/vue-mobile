import { createApp } from 'vue'
import 'uno.css'

import '@unocss/reset/sanitize/sanitize.css'
// import '@unocss/reset/normalize.css'
import './styles/index.scss'
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')

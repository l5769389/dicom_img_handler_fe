import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import naive from 'naive-ui'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)


app.mount('#app')

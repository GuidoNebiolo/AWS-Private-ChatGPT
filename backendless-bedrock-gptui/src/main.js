import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { Amplify } from 'aws-amplify'
import amplifyConfig from './configs/amplify-config'
import '@aws-amplify/ui-vue/styles.css'

Amplify.configure(amplifyConfig)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
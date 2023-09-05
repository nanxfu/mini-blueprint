import {createApp} from 'vue'
import {createPinia} from 'pinia'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

//todo
// [x] 删除结点
// [x] 通知删除连接的线
// [x] 重构发布订阅者模式，使其能够按照需求传递参数
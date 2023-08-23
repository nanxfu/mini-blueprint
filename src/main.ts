import {createApp} from 'vue'
import {createPinia} from 'pinia'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

//todo
//- [] 阻止重复连接相同的结点
/*
1.抽取ConnectingPoint组件
2.ConnectingPoint具有已连接的结点的属性，在连接曲线时检查要连接的结点ID是否相同，一致则不连接，否则连接
 */
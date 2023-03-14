import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import VueVirtualScroller from 'vue3-virtual-scroller';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';

import { usePinia } from './plugins/pinia';
import { useRouter } from './router';

const app = createApp(App);
useRouter(app);
usePinia(app);

app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })

import Vue from 'vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

Vue.config.productionTip = false

const socket = io('http://localhost:8269');

Vue.use(VueSocketIOExt, socket);

new Vue({
  render: h => h(App),
  data: () => ({
    now: new Date()
  }),
}).$mount('#app')

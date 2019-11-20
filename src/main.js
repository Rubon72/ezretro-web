import Vue from 'vue';
import './main.scss'

import VueRouter from 'vue-router';
import App from './App.vue'
import NewRetro from './components/NewRetro.vue'
import Retro from './components/Retro.vue'
import Clipboard from 'v-clipboard'


Vue.config.productionTip = false;

import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin);
Vue.use(VueRouter);
Vue.use(Clipboard);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'NewRetro',
      component: NewRetro
    },
    {
      path: '*',
      name: 'Retro',
      component: Retro,
      meta: {
        title:'EZ Retro'
      }
    }
  ]
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');


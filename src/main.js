import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import messages from './locales/index';

Vue.config.productionTip = false

Vue.use(VueMeta);
Vue.use(VueI18n);

let i18n = new VueI18n({
  locale: navigator.language,
  fallbackLocale: 'en',
  messages
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

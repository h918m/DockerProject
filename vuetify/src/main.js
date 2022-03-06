// =========================================================
// * Vuetify Material Dashboard PRO - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// test

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import './plugins/vue-svg-gauge'
import './plugins/axios-interceptor'
import './plugins/moment'
import './plugins/loading'
import './plugins/vue-qrcode'
import './plugins/filters'
import './plugins/excel'
import './plugins/vue-socket'
import vuetify from './plugins/vuetify'
// Internationalization is off
// i18n has to be added together with router and store
// import i18n from './i18n'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');

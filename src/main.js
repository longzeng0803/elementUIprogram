import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import common from './common/common'

//全局引入axios
// import axios from 'axios'

// vue.prototype.$http=axios

Vue.prototype.$common=common
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

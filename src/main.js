import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

Vue.prototype.$http = axios
// 配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 配置请求拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

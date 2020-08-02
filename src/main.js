import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.prototype.$http = axios
// 配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 配置请求拦截器  在 request 拦截器中展示进度条
axios.interceptors.request.use(config => {
  // 展示进度条
  Nprogress.start()
  console.log(config)
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})
// 隐藏进度条
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

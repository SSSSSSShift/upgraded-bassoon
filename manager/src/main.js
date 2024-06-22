import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store/index'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:9000';

//响应拦截器
axios.interceptors.response.use(function(response) {
	//获取响应数据
	let data = response.data;
	if (data) {
		//如果里面有 token，更新 token
		if (data.token) {
			// console.log('响应拦截器设置token' + data.token);
			store.commit('setToken', data.token);
		}
		//如果有 管理员id，保存
		if (data.user && data.user.id) {
			// console.log('响应拦截器设置id' + data.user.id);
			store.commit('setUid', data.user.id);
		}
	}
	return response;
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

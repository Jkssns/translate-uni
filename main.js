import Vue from 'vue'
import App from './App'
import store from './store/index.js'

/* 插件 */
import uView from 'uview-ui'
Vue.use(uView)

import i18n from '@/i18n/index.js'
Vue.use(i18n)

/* 组件 */

/* 配置 */
import utils from '@/utils/index.js'
Vue.prototype.$utils = utils

Vue.prototype.toast = (title, duration = 1500, obj) => {
	uni.showToast({
		title: title,
		duration: duration,
		icon: 'none',
		...obj,
	})
}

// 由于微信小程序的运行机制问题，需声明如下一行，H5和APP非必填
App.mpType = 'app'
Vue.config.productionTip = false


const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()

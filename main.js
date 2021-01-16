import Vue from 'vue'
import App from './App'

/* 插件 */
import uView from 'uview-ui'
Vue.use(uView)

import VueI18n from 'vue-i18n'
import Chinese from '@/common/locales/zh.js';
import English from '@/common/locales/en.js';
Vue.use(VueI18n)
const i18n = new VueI18n({
	locale: 'cn',
	messages: {
		'cn': Chinese,
		'en': English,
	}
})
// 由于微信小程序的运行机制问题，需声明如下一行，H5和APP非必填
Vue.prototype._i18n = i18n


/* 组件 */


/* 配置 */
import utils from '@/utils/index.js'
Vue.prototype.$utils = utils

App.mpType = 'app'
Vue.config.productionTip = false

const app = new Vue({
	i18n,
	...App
})
app.$mount()
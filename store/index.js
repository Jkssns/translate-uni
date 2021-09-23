import Vuex from './vuex.js'
import Vue from 'vue'
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		themeObj: {
			green: {	// 墨绿
				fontColor: '#19be6b',
				secondFontColor: '#606266',
				themeColor: '#19be6b'
			},
			pink: {		// 樱粉
				fontColor: 'pink',
				secondFontColor: '#606266',
				themeColor: '#19be6b'
			},
			grey: {		// 樱粉
				fontColor: 'grey',
				secondFontColor: '#606266',
				themeColor: '#19be6b'
			},
			red: {		// 樱粉
				fontColor: 'red',
				secondFontColor: '#606266',
				themeColor: '#19be6b'
			},
		},
		currentTheme: 'green',
		lang: 'zh',
		count: 0
	},
	mutations: {

	},
	actions: {

	},
	getters: {

	}
})
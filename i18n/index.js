import message from './language.js'

const $t = (key, message) => {
	if (!key) {
		return ''
	} else {
		let temp = message
		console.log(temp, 'temp')
		const arr = key.split('.')
		for (let i in arr) {
			if (temp[arr[i]]) {
				temp = temp[arr[i]]
			}
			console.log(temp, 'temp')
		}
	
		return temp
	}
}
	
const install = (Vue) => {
	Vue.mixin({
		beforeCreate() {
			if (this.$options.i18n) {
				Vue.prototype.locale = 'zh'
                Vue.prototype.$t = (key) => {
					return $t(key, message[Vue.prototype.locale])
				}
			}
		}
	})
}
export default {install}
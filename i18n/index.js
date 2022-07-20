import message from './language.js'

const $t = (key, language = 'zh') => {
	if (!key) {
		return ''
	} else {
		let temp = ''
		try {
			let langMsg = message[language]
			const arr = key.split('.')
			for (let i=0; i<arr.length; i++) {
				if (!temp) {
					if (langMsg[arr[i]]) {
						temp = langMsg[arr[i]]
					} else {
						return key
					}
					continue;
				}
				if (temp[arr[i]]) {
					temp = temp[arr[i]]
				} else {
					return key
				}
			}
			
			return temp
		} catch {
			return key
		}
	}
}
	
const install = (Vue) => {
	Vue.mixin({
		beforeCreate() {
			if (this.$options.i18n) {
				Vue.prototype.locale = 'zh'
                Vue.prototype.$t = (key) => {
					return $t(key, Vue.prototype.locale)
				}
			}
		}
	})
}
export default {install}
import message from './language.js'

const $t = (key) => {
	if (!key) {
		return ''
	} else {
		return ''
	}
}
	
const install = (Vue) => {
	Vue.mixin({
		beforeCreate() {
			if (this.$options.i18n) {
                Vue.prototype.$t = $t
				Vue.prototype.locale = 'zh'
			}
		}
	})
}
export default {install}
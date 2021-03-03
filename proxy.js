

const target = {
	a: 1,
}
const handler= {
	get(target, key) {
		return target[key]
	},
	set(target, key, value) {
		target[key] = value
		return true
	}
}
const store = new Proxy(target, handler)

export default store
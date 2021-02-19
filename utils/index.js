export default {
	/* 是否是pc端 */
	isPc() {
		const Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", ].map(item => item.toLowerCase())
		let userAgentInfo
		uni.getSystemInfo({
			success: res => {
				userAgentInfo = res.platform.toLowerCase()
			}
		})
		return !Agents.some(item => item === userAgentInfo)
	}
}

import request from "./request";

export default {
	getOpenId(params) {
		return request({
			url: 'https://api.weixin.qq.com/sns/jscode2session',
			params,
		})
	}
}
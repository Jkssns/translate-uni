// 开发文档: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
module.exports = {
	async getOpenid(params, e) {
		const res = await uniCloud.httpclient.request('https://api.weixin.qq.com/sns/jscode2session', {
			method: 'GET',
			data: params,
			dataType: 'json' // 指定返回值为json格式，自动进行parse
		})
		return res.data
		
	}
}

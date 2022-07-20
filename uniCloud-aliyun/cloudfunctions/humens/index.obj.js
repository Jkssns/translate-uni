// 开发文档: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
const statusMsgObj = {
	200: '操作成功',
	400: '参数有误',
	500: '操作失败，系统错误。',
}
const status = (code, data, msg) => {
	return {
		code: code,
		data,
		msg: msg || statusMsgObj[code],
	}
}

module.exports = {
	async checkOpenid(openid) {
		console.log(13455)
		const db = uniCloud.database();
		const collection = db.collection('humens_list');
		const res = await collection.where({
			openid: openid
		}).get()
		if (res.data.length) {
			return status(200, true)
		} else {
			return status(200, false)
		}
	},
}

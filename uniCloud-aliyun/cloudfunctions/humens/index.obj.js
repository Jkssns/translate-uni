// 开发文档: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
module.exports = {
<<<<<<< HEAD
	
=======
	add(name, introduce) {
		name = name.trim()
		introduce = introduce.trim()
		if(!name || !introduce) {
			return {
				errCode: 400,
				errMsg: '名称和自我介绍不可以为空'
			}
		}
		// ...其他逻辑
		return {
			errCode: 200,
			errMsg: '添加成功'
		}
	}
>>>>>>> 2c2964e5a73a983da8924ae71e24fe42fec46428
}

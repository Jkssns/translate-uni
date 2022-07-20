export default function request({
		url, //	String 	是 		开发者服务器接口地址 	
		params, // get参数
		data, // 	Object/String/ArrayBuffer 	否 		请求的参数 	App 3.3.7 以下不支持 ArrayBuffer 类型
		header, // 	Object 	否 		设置请求的 header，header 中不能设置 Referer。 	App、H5端会自动带上cookie，且H5端不可手动修改
		method, // 	String 	否 	GET 	有效值详见下方说明 	
		timeout, // 	Number 	否 	60000 	超时时间，单位 ms 	H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)、微信小程序（2.10.0）、支付宝小程序
		dataType, // 	String 	否 	json 	如果设为 json，会尝试对返回的数据做一次 JSON.parse 	
		responseType, // 	String 	否 	text 	设置响应的数据类型。合法值：text、arraybuffer 	支付宝小程序不支持
		sslVerify, // 	Boolean 	否 	true 	验证 ssl 证书 	仅App安卓端支持（HBuilderX 2.3.3+），不支持离线打包
		withCredentials, // 	Boolean 	否 	false 	跨域请求时是否携带凭证（cookies） 	仅H5支持（HBuilderX 2.6.15+）
		firstIpv4,
	}) {
	if (params && Object.keys(params).length) {
		url = url + '?' + Object.entries(params).map(item => item.join('=')).join('&')
	}
	return new Promise((rel, rej) => {
		uni.request({
			url, //	String 	是 		开发者服务器接口地址 	
			data, // 	Object/String/ArrayBuffer 	否 		请求的参数 	App 3.3.7 以下不支持 ArrayBuffer 类型
			header, // 	Object 	否 		设置请求的 header，header 中不能设置 Referer。 	App、H5端会自动带上cookie，且H5端不可手动修改
			method, // 	String 	否 	GET 	有效值详见下方说明 	
			timeout, // 	Number 	否 	60000 	超时时间，单位 ms 	H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)、微信小程序（2.10.0）、支付宝小程序
			dataType, // 	String 	否 	json 	如果设为 json，会尝试对返回的数据做一次 JSON.parse 	
			responseType, // 	String 	否 	text 	设置响应的数据类型。合法值：text、arraybuffer 	支付宝小程序不支持
			sslVerify, // 	Boolean 	否 	true 	验证 ssl 证书 	仅App安卓端支持（HBuilderX 2.3.3+），不支持离线打包
			withCredentials, // 	Boolean 	否 	false 	跨域请求时是否携带凭证（cookies） 	仅H5支持（HBuilderX 2.6.15+）
			firstIpv4, // 	Boolean 	否 	false 	DNS解析时优先使用ipv4 	仅 App-Android 支持 (HBuilderX 2.8.0+)
			success(res) {
				rel(res.data)
			},
			fail(err) {
				rej(err)
			},
			complete(res) {
				// Promise.finally(res)
			},
		})
	})
}
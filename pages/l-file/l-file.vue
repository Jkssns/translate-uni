<template>
	<span @click="$emit('click')">
		<slot></slot>
	</span>
</template>

<script>
export default {
	data() {
		return {
			cubgColor: '',
			loading: false,
			value: 5,
			show: false,
			msg: '执行完毕~',
		}
	},
	methods: {
		toast(title = '',{ duration = 2000, icon = 'none'} = {}) {
			uni.showToast({title,duration,icon});
		},
		getRequest(url) {  
			let theRequest = new Object(); 
			let index = url.indexOf("?");
			if (index != -1) {  
				let str = url.substring(index+1);  
				let strs = str.split("&");  
				for(let i = 0; i < strs.length; i ++) {  
					theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
				}
			}
			return theRequest;  
		},
		
		/*
			上传说明：
			currentWebview: 当前窗口webview对象
			url：上传接口地址
			name：上传文件key值
			header: 上传接口请求头
			...：body内其他参数
		*/
		appChooseFile({currentWebview,url,name = 'file',header, accept, types, fileParams, ...formData} = {}) {
			// #ifdef APP-PLUS
				let wv = plus.webview.create("","/hybrid/html/index.html",{
					'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
					top: 0,
					height: '100%',
					background: 'transparent'
				},{
					accept,
					types,
					url,
					header,
					formData,
					fileParams,
					language: this.$store.state.userData.language,
					colorStyle: this.$store.state.colorStyle,
					key: name,
				});
				wv.loadURL("/hybrid/html/index.html")
				currentWebview.append(wv);
				wv.overrideUrlLoading({mode:'reject'},(e)=>{
					let {fileName,id} = this.getRequest(e.url);
					fileName = unescape(fileName);
					id = JSON.parse(unescape(id));
					return this.onCommit(
						this.$emit('up-success', {fileName, statusCode: 200, ...id})
					);
				});
			// #endif
		},
		/* 
		上传
		*/
		upload(param = {}) {
			
			if (!param.url) {
				this.toast('上传地址不正确');
				return;
			}
			
			if (this.loading) {
				this.toast('还有个文件玩命处理中，请稍候..');
				return;
			}
			
			// #ifdef APP-PLUS
				return this.appChooseFile(param);
			// #endif
		},
		/* 
		打开文件 
		*/
		open(filePath) {
			let system = uni.getSystemInfoSync().platform;
			if(system == 'ios'){
				filePath = encodeURI(filePath);
			}
			uni.openDocument({
				filePath,
				success: (res) => {console.log('打开文档成功');}
			});
		},
		/* 
		下载
		 type: temporary=返回临时地址，local=长期保存到本地
		 */
		download(url,type = 'temporary') {
			if (this.loading) {
				this.toast('还有个文件玩命处理中，请稍候..');
				return;
			}
			this.setdefUI();
			
			return new Promise((resolve,reject)=>{
				let downloadTask = uni.downloadFile({
				    url,
				    success: ({statusCode,tempFilePath}) => {
				        if (statusCode === 200) {
							if (type == 'local') {
								uni.saveFile({
									tempFilePath,
									success:({savedFilePath}) => this.onCommit(resolve(savedFilePath)),
									fail: () => this.errorHandler('下载失败',reject)
								});
							}
							else {
								this.onCommit(resolve(tempFilePath))
							}
						}
					},
					fail: () => this.errorHandler('下载失败',reject)
				});
				
				downloadTask.onProgressUpdate(({progress = 0}) => {
					if (progress <= 100) {
						this.$nextTick(()=>{
							this.value = progress;
						});
					}
				});
			})
			
		},
		
		onCommit(resolve) {
			this.msg = '执行完毕~';
			this.loading = false;
			setTimeout(()=>{this.show = false;},1500);
			return resolve;
		},
		
		setdefUI() {
			this.value = 0;
			this.loading = true;
			this.show = true;
		},
		
		upErr(errText) {
			this.$emit('up-error',errText);
		},
		
		errorHandler(errText,reject) {
			this.msg = errText;
			this.loading = false;
			setTimeout(()=>{this.show = false;},1500);
			return reject(errText);
		}
	}
}
</script>

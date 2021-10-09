let mask = document.querySelector(".mask");
let fileDom = document.querySelector(".file");
let tis = document.querySelector(".tis");
let progress = document.querySelector(".tis-progress");
let cancel = document.querySelector(".cancel-btn");
let openBtn = document.querySelector("#open");
let content = document.querySelector(".tis-content");
let lang,colorTheme


let createUpload = (file, url, key='file', header = {},data = {}) => {
	console.log(`
	上传地址:${url}\n
	请求头:${JSON.stringify(header)}\n
	参数:${JSON.stringify(data)}
	`);
	if (!url) {return;}
	tis.style.display = 'flex';
	
	let formData = new FormData();
		formData.append(key, file);
	
	for (let keys in data) {
		for (let key in data[keys]) {
			formData.append(key, data[keys][key]); 
		}
	}
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	
	for (let keys in header) {
		xhr.setRequestHeader(keys, header[keys]);
	}
	xhr.upload.addEventListener("progress", function(event) {
		if(event.lengthComputable){
			let percent = Math.ceil(event.loaded * 100 / event.total) + "%";
			// progress.innerText = `上传中/Upload..${percent}`;
			progress.innerText = lang === 'en' ? 'Uploading... ' + percent : '上传中... ' + percent
		}
	}, false);
	
	xhr.ontimeout = function(){
		// xhr请求超时事件处理
		progress.innerText = lang === 'en' ? 'Request timed out' : '请求超时'

		setTimeout(()=>{
			tis.style.display = 'none';
			plus.webview.currentWebview().close();
		},1000);
	};
	
	xhr.onreadystatechange = (ev) => {
		
		if(xhr.readyState == 4) {
			console.log('status：'+xhr.status);
			
			if (xhr.status == 200) {
				progress.innerText = lang === 'en' ? 'Success' : '上传成功'
				location.href = `callback?fileName=${escape(file.name)}&id=${escape(xhr.responseText)}`;
			}
			else {
				progress.innerText = lang === 'en' ? 'Upload failed' : '上传失败'
			}
			
			setTimeout(()=>{
				tis.style.display = 'none';
				plus.webview.currentWebview().close();
			},1000);
			
		}
	};
	xhr.send(formData);
	
	// cancel.addEventListener("click", ()=>{
	// 	xhr.abort();
	// 	plus.webview.currentWebview().close();
	// });
}


mask.addEventListener("click", () => {
	plus.webview.currentWebview().close();
});

document.addEventListener('UniAppJSBridgeReady', () => {
	let {accept, types, url,key,header, fileParams, language,colorStyle} = plus.webview.currentWebview();
	lang = language;colorTheme=colorStyle;
	progress.innerText = lang === 'en' ? 'Uploading...' : '上传中...'
	openBtn.innerText = lang === 'en' ? 'Open file manager' : '打开文件管理器';
	content.style.background=colorTheme=='white'?'rgba(17,17,17,.7)':'rgba(17,17,17,.7)'
	// content.style.background=colorTheme=='white'?'rgba(93, 93, 93, 0.6)':'rgba(19,19,19,1)'
	// fileDom.accept = accept
	fileDom.addEventListener('change', (event) => {
		let file = fileDom.files[0];
		const name = event.target.files[0].name.split('.')
        const lastName = name[name.length - 1]
        const arr = types || []
		
		let formData = new FormData();
		for (let i in fileParams) {
			formData.append(i, file[fileParams[i]])
		}
		
        if (arr.includes(lastName) || arr.length === 0) {
            if(file.size > (1024*1024 * 10)) {
				// plus.nativeUI.toast('单个文件请勿超过10M,请重新上传');
				const text = lang === 'en' ? 'A single file should not exceed 10M, please upload again' : '单个文件请勿超过10M,请重新上传'
				plus.nativeUI.toast(text)
				return;
			}
			createUpload(file, url, key, header, formData);
        } else {
			event.target.value = ''
			const type = types.map(item => `${'.' + item}`)
			const text = lang === 'en' ? `Please upload file in ${type.join('、')} format` : `请上传 ${type.join('、')} 格式的文件`
			plus.nativeUI.toast(text)
            return;
        }
	}, false);
});
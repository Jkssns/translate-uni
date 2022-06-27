<template>
	<div class="code__container">
		<div class="code__wrapper">
			
			<scroll-view :scroll-y="true" :style="{height: inputHeight}">
				<div style="display: flex;">
					<ul class="line__number__wrapper">
						<li class="line__item" v-for="item in lineNumber" :key="item">{{item}}</li>
					</ul>
					<editor 
						id="editor" 
						class="ql-container" 
						placeholder="调试请用log()代替console.log()" 
						@ready="onEditorReady" 
						@focus="onFocus"
						@input="onInput"
						@click="clickEditor"
					></editor>
				</div>
			</scroll-view>
		</div>

		<footer :style="{bottom: KeyboardHeight}">
			<!-- <button @click="handleClick">click</button> -->
			<!-- <image class="action__btn" @click="confirm" src="/static/imgs/implement.svg" ></image> -->
			<ul class="shortcuts__wrapper" v-if="showShortcuts" >
				<li class="shortcut" v-for="item in shortcuts" :key="item.label" @click="setShortcut(item)">{{item.label}}</li>
				<li class="shortcut" style="opacity: 0;pointer-events: none;" v-for="item in (7 - shortcuts.length % 7)"></li>
			</ul>
		</footer>

		<!-- <div class="action__wrapper">
			<button class="btn" @click="confirm">执行</button>
		</div>

		<div class="result__wrapper">
			<p v-if="result" v-html="result" :style="{color: right ? 'var(--primary-color)' : 'red'}" class="result"></p>
			<p v-else class="result" style="color: #808080">执行结果</p>
			<footer class="footer" v-show="showShortcuts">
				<ul class="footer__shortcuts">
					<li class="shortcut" v-for="item in shortcuts" :key="item.label" @click="setShortcut(item)">{{item.label}}</li>
					<li class="shortcut" style="opacity: 0;pointer-events: none;" v-for="item in shortcuts.length % 7"></li>
				</ul>
			</footer>
		</div>

		<div class="action__wrapper">
			<span></span>
			<button class="btn" @click="copy('result')">复制结果</button>
		</div>
		 -->
		
		<!-- h5 复制用 -->
		<input id="copyText" type="text" style="position: absolute;z-index: -1;opacity: 0;top: 0;left: 0;pointer-events: none;">
	</div>
</template>

<script>
	/**
	 * @description 一个普通函数，在其中写js代码。暂不支持接口请求，后期会支持。
	 * @return {any} 在函数内部计算出的结果，点击执行后会在控制台显示。
	 * 
	 * */


	export default {
		name: 'history',
		data() {
			return {
				description: '手机写代码',
				code: `	<span style="color: #bababa;">
/**<br>
* @description 一个普通函数，在其中写js代码。暂不支持接口请求，后期会支持。<br>
* @return {any} 在函数内部计算出的结果，点击执行后会在控制台显示。<br>
* <br>
* */
</span>
<br>
<p>function fn() {</p>
<p>return 123</p>
<p>}</p>
<p>fn()</p>
`,
				result: '', // 执行结果
				right: true, // 结果状态 true：执行正确 false：执行错误
				logs: [], // 用户输入的log结果
				shortcuts: [
					{ label: '快捷函数', value: 'function fn() {\n\t\n}\nfn()' },
					{ label: '+',	  value: '+'	 },
					{ label: '-',	  value: '-'	 },
					{ label: '*',	  value: '*'	 },
					{ label: '/',	  value: '/'	 },
					{ label: '=',	  value: '='	 },
					{ label: 'log()', value: 'log()' },
					{ label: '()',	  value: '()'	 },
					{ label: '{}',	  value: '{}'	 },
					{ label: '[]',	  value: '[]'	 },
					{ label: '=>',	  value: '=>'	 },
					{ label: 'Tab',	  value: '	'    },
					{ label: '空格',   value: ' '	 }, 
				],
				end: 0,
				lineNumber: 30, // 行数
				inputHeight: '100%', // 总体高度
				KeyboardHeight: 0, // 键盘高度
				editorCtx: null, // 编辑器实例

				setFocus: false,
				showShortcuts: false,
			}
		},

		mounted() {
			uni.onKeyboardHeightChange(res => {
				if (res.height <= 0) {
					this.showShortcuts = false
				}
				this.KeyboardHeight = res.height + 'px'
				this.inputHeight = `calc(100% - ${res.height + 'px'})`
				// #ifdef APP-PLUS
				this.inputHeight = `calc(100vh - ${res.height + 'px'})`
				// #endif
			})
		},

		computed: {
			rows() {
				return this.code.match('\n')
			}
		},

		methods: {
			onInput(a, b, c) {
				console.log(a)
				this.content = a.detail.text
				console.log(this.content)
			},
			/* 从剪贴板获取代码 */
			getCode() {
				// #ifdef H5
					// this.code = ClipboardEvent.clipboardData.getData('text') 
				// #endif
				uni.getClipboardData({
					success: (res) => {
						this.code = res.data
					}
				});
			},

			/* 代码框获取焦点时 */
			onFocus(e) {
				this.showShortcuts = true
			},
			
			/* 失去焦点时，获取光标位置 */
			onBlur({ detail: { value, cursor } }) {
				this.setFocus = false
			},

			/* 复制 */
			copy(flag) {
				this.showShortcuts = false
				
				// #ifdef H5
				let ipt = document.getElementById("copyText");
				ipt.value = this[flag]
				ipt.select();
				document.execCommand("Copy");
				// #endif

				uni.setClipboardData({
					data: this[flag],
					success: (res) => {
						this.code = res.data
					}
				});
			},

			handleClick() {
				uni.vibrateShort({
				    success: function () {
				        console.log('success');
				    }
				});
				this.confirm()
			},

		   onEditorReady() {
				// #ifdef MP-BAIDU
				this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editorId');
				// #endif

				// #ifdef APP-PLUS || H5 || MP-WEIXIN
				uni.createSelectorQuery().select('#editor').context((res) => {
				  this.editorCtx = res.context
				  this.editorCtx.setContents({
					  html: this.code,
					  complete: (res) => {
						  console.log(res, 333)
					  }
				  })

				}).exec()
				// #endif
			},
			

			clickEditor(){
				if(this.hideKeyboardTime){
					clearInterval(this.hideKeyboardTime);
				}
			},

	
			/* 执行 */
			confirm() {
				this.showShortcuts = false
				if (!this.code) {
					this.toast('请输入执行代码!')
					return
				}

				try {
					this.right = true // 重置结果状态
					this.logs = [] // 重置log

							// var that = this;
							// function log() { 
							// 	that.logs.push(Array.from(arguments)); 
							// }
					let tempStr = `
							${this.content}
						`
						
						console.log(tempStr)
					let res = eval(tempStr)
					let str = ''

					// 获取log结果
					if (this.logs.length) {
						this.logs.forEach(item => {
							str += `<span style="color: #3a3a3a">log::: ${item.join(', ')}</span>` + "<br>"
						})
					}
					console.log(res, 'res')

					this.result = str + res
					console.log(this.result, 'this.result')
				} catch (err) {
					console.log(err)
					this.right = false
					this.result = err.toString()
				}
			},
		}

	}
</script>

<style lang="scss" scoped>
    #editor {
        width: 100%;
		height: 100%;
    }
	.desc {
		color: red!important;
	}

	.code__container {
		width: 750rpx;

		// #ifdef H5
		height: 100%;
		// #endif

		// #ifdef APP-PLUS
		height: 100vh;
		// #endif

		overflow: hidden;
		.code__wrapper {
			display: flex;

			// #ifdef H5
			height: calc(100% - 100rpx);
			// #endif

			// #ifdef APP-PLUS
			height: calc(100vh - 100rpx);
			// #endif

			background: #f8f8f8;
			overflow-y: auto;
		}

		.line__number__wrapper {
			width: 2em;
			background: #f8f8f8;
			border-right: 1rpx solid #f1f1f1;
			.line__item {
				width: 100%;
				text-align: center;
				line-height: 50rpx;
				border-right: 1rpx solid #f1f1f1;
			}
		}


		/* 操作按钮区域  */
		.action__wrapper {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;

			.btn {
				margin: 0;
				border: none;
				background: var(--primary-color);
				color: #fff;
			}
		}

		// footer {
		// 	position: fixed;
		// 	width: 100%;
		// 	height: 100rpx;
		// 	background: #fff;
		// }

		footer {
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 200rpx;
			// height: auto;
			// background: #fff;
			/* 执行结果区域 */
			.shortcuts__wrapper {
				display: flex;
				align-content: flex-start;
				justify-content: space-between;
				flex-wrap: wrap;
				position: relative;
				padding: 20rpx 30rpx 0;
				box-sizing: border-box;

				.shortcut {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 6rpx;
					margin-right: 6rpx;
					margin-bottom: 20rpx;
					width: 3em;
					height: 80rpx;
					text-align: center;
					background-color: var(--primary-color);
					border-radius: 10rpx;
					color: #fff;
				}
			}
		}


		

	}
</style>

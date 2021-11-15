<template>
	<div class="code__container" :style="{height: inputHeight}">
		<div class="code__wrapper">
			<ul class="line__number__wrapper">
				<li class="line__item" v-for="item in lineNumber" :key="item">{{item}}</li>
			</ul>

			<textarea
				class="code__input" 
				type="text"
				v-model="code"
				maxlength="-1"
				:style="{height: `calc(${50 * lineNumber}rpx)`}"
				placeholder="调试请用log()代替console.log()"
				cursor-spacing="-50"
				auto-blur
				:focus="setFocus"
				:hold-keyboard="false"
				:adjust-position="false"
				:cursor="cursorPosition"
				@focus="onFocus"
				@blur="onBlur"
				@linechange="onLineChange"
			/>
		</div>

		<footer>
			test
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
	export default {
		name: 'history',
		data() {
			return {
				description: '手机写代码',
				code: ``, // 用户输入的代码
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
				cursorPosition: 0,
				lineNumber: 1, // 行数
				inputHeight: '100%', // 总体高度

				setFocus: false,
				showShortcuts: false,
			}
		},
		
		onLoad() {
			
		},	

		created() {
			
		},

		mounted() {
			uni.onKeyboardHeightChange(res => {
				this.inputHeight = `calc(100% - ${e.detail.height + 'px'})`
				// #ifdef APP-PLUS
				this.inputHeight = `calc(100vh - ${e.detail.height + 'px'})`
				// #endif
				console.log("this.inputHeight::: ", this.inputHeight);
			})
		},

		computed: {
			rows() {
				return this.code.match('\n')
			}
		},

		methods: {
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
			onBlur({ detail: { value, cursor } } = e) {
				this.setFocus = false
				this.end = cursor
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

			/* 使用快捷方式，添加快捷方式至光标消失的地方 */
			setShortcut(item) {
				let str = this.code.substring(0, this.end)
				this.code = this.code.replace(str, str + item.value)
				this.cursorPosition = this.end + item.value.length
				// setTimeout(() => {
					this.setFocus = true
				// }, 150)
			},

			onLineChange(event) {
				this.lineNumber = event.detail.lineCount
				// console.log("height, heightRpx, lineCount::: ", height, heightRpx, lineCount);
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

					let tempStr = `
							var that = this;
							function log() { 
								that.logs.push(Array.from(arguments)); 
							}
							${this.code}
						`
					let res = eval(tempStr)
					let str = ''

					// 获取log结果
					if (this.logs.length) {
						this.logs.forEach(item => {
							str += `<span style="color: #3a3a3a">log::: ${item.join(', ')}</span>` + "<br>"
						})
					}

					this.result = str + res
				} catch (err) {
					this.right = false
					this.result = err.toString()
				}
			},
		}

	}
</script>

<style lang="scss" scoped>
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
			// display: flex;

			// // #ifdef H5
			// height: calc(100% - 100rpx);
			// // #endif

			// // #ifdef APP-PLUS
			// height: calc(100vh - 100rpx);
			// // #endif

			// background: #f8f8f8;
			// overflow-y: auto;
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

		/* 代码输入框  */
		.code__input {
			width: 100%;
			padding-left: 10rpx;
			height: 100%;
			line-height: 50rpx;
			border: none;
			letter-spacing: 1rpx;
		}
		.code__input::-webkit-scrollbar-track-piece {
			background-color: yellow!important;
			border-left: 1rpx solid pink!important;
		}
		
		.code__input::-webkit-scrollbar {
			width: 5rpx;
			height: 13rpx;
			-webkit-border-radius: 5rpx;
			-moz-border-radius: 5rpx;
			border-radius: 5rpx;
		}
		
		.code__input::-webkit-scrollbar-thumb {
			background-color: red!important;
			background-clip: padding-box;
			-webkit-border-radius: 5rpx;
			-moz-border-radius: 5rpx;
			border-radius: 5rpx;
			min-height: 28rpx;
		}
		
		.code__input::-webkit-scrollbar-thumb:hover {
			background-color: blue!important;
			-webkit-border-radius: 5rpx;
			-moz-border-radius: 5rpx;
			border-radius: 5rpx;
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

		footer {
			position: fixed;
			bottom: 0;
			// z-index: 1;
			width: 100%;
			height: 100rpx;
			background: #fff;
		}


		/* 执行结果区域 */
		.result__wrapper {
			position: relative;
			padding-top: 20rpx;

			.result,
			.footer {
				padding: 10rpx;
				width: calc(100% - 20rpx);
				height: 380rpx;
				overflow-y: auto;
				border: 1rpx solid rgba(0, 0, 0, 0.5);
				border-radius: 10rpx;
				background: #f8f8f8;
				letter-spacing: 1rpx;
			}

			.footer {
				position: absolute;
				top: 20rpx;
				left: 0;
				bottom: 0;
				z-index: 1;
				overflow: hidden;

				.footer__shortcuts {
					height: 100%;
					display: flex;
					align-content: flex-start;
					justify-content: space-between;
					flex-wrap: wrap;

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
						background: var(--primary-color);
						border-radius: 10rpx;
						color: #fff;
					}
				}
			}
		}

	}
</style>

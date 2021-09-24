<template>
	<div class="code__wrapper">
		<textarea 
			class="code" 
			type="text" 
			v-model="code" 
			maxlength="-1" 
			auto-height
			placeholder="调试请用log()代替console.log()" 
			cursor-spacing="10" 
			auto-blur
			:focus="setFocus"
			:cursor="cursorPosition"
			adjust-position="false"
			@focus="onFocus" 
			@blur="onBlur"
		/>
		

		<div class="action__wrapper">
			<button class="btn" @click="getCode">从剪贴板获取代码</button>
			<button class="btn" @click="copy('code')">复制代码</button>
			<button class="btn" @click="confirm">执行</button>
		</div>

		<div class="result__wrapper">
			<p v-if="result" v-html="result" :style="{color: right ? 'var(--primary-color)' : 'red'}" class="result"></p>
			<p v-else class="result" style="color: #808080">执行结果</p>
			<footer class="footer" v-show="showShortcuts">
				<ul class="footer__shortcuts">
					<li class="shortcut" v-for="item in shortcuts" :key="item.label" @click="setShortcut(item)">
						{{item.label}}</li>
					<li class="shortcut" style="opacity: 0;pointer-events: none;" v-for="item in shortcuts.length % 7">
					</li>
				</ul>
			</footer>
		</div>

		<div class="action__wrapper">
			<span></span>
			<button class="btn" @click="copy('result')">复制结果</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'history',
		data() {
			return {
				description: '手机写代码',
				// code: `function fn() {\n\n log(123); \n  return 'something'\n}\n\nfn()`,
				code: 'abcde', // 用户输入的代码
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
				setFocus: true,
				cursorPosition: 0,
				showShortcuts: false,
			}
		},

		created() {
		
		},
		

		computed: {

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
			onFocus() {
				this.showShortcuts = true
			},
			
			/* 失去焦点时，获取光标位置 */
			onBlur({ detail: { value, cursor } } = e) {
				this.setFocus = false
				this.end = cursor
			},

			/* 复制 */
			copy() {

			},

			/* 使用快捷方式，添加快捷方式至光标消失的地方 */
			setShortcut(item) {
				let str = this.code.substring(0, this.end)
				this.code = this.code.replace(str, str + item.value)
				this.cursorPosition = this.end + item.value.length
				setTimeout(() => {
					this.setFocus = true
				}, 150)
			},

			/* 执行 */
			confirm() {
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
							str += `<span style="color: #3a3a3a">log::: ${item2.join(', ')}</span>` + "<br>"
						})
					}

					this.result = str + res
				} catch (err) {
					this.right = false
					this.result = err.toString()
				}
			}
		}

	}
</script>

<style lang="scss" scoped>
	.code__wrapper {
		padding: 20rpx 25rpx;
		width: 700rpx;

		/* 代码输入框  */
		.code {
			width: calc(100% - 20rpx);
			padding: 10rpx;
			min-height: 400rpx;
			border: none;
			border: 1px solid rgba(0, 0, 0, 0.5);
			border-radius: 10rpx;
			background: #f8f8f8;
			letter-spacing: 1px;
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
				border: 1px solid rgba(0, 0, 0, 0.5);
				border-radius: 10rpx;
				background: #f8f8f8;
				letter-spacing: 1px;
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

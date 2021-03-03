<template>
	<div class="translate">
		<header class="t__header">
			<u-button type="success" @click="show = true">
				{{ list[0][typeIndex[0]]['label'] }} -- {{ list[1][typeIndex[1]]['label'] }}
			</u-button>
			<u-select
				v-model="show"
				:default-value="typeIndex"
				mode="mutil-column"
				:list="list"
				@confirm="confirm"
			></u-select>
		</header>

		<section class="t__section">
			<u-input class="t__section__input"  v-model="value" type="text" :maxlength="-1" :border="true" :clearable="true" placeholder="请输入" />
			<u-button class="t__section__button" type="success" @click="translate">翻译</u-button>
		</section>

		<main class="t__main">
			<div class="t__main__box" :style="{color: translated === '已翻译内容' ? '#C0C4CC' : '#303133'}">
				<p class="t__translated__val">{{translated}}</p>
			</div>
			<div class="t__main__actions">
				<u-button class="left__action"  @click="translated='已翻译内容'">清空</u-button>
				<u-button class="right__action" type="success" @click="copy">复制</u-button>
			</div>
		</main>
		
		<section class="t__saohua">
			<u-tabs :list="alist"  active-color="#19BE6B" inactive-color="#606266" :is-scroll="false" :current="current" @change="onCurrentChange"></u-tabs>
			<!-- https://api.lovelive.tools/api/SweetNothings/Serialization/Json%20/10?genderType=M -->
		</section>
		
		<footer class="t__footer">
			新年新气象
			<br>
			肥宅翻译祝您的英语水平直线下降
		</footer>

		<ball @ball-click="ballClick"></ball>
	</div>
</template>

<script>
	import data from '@/static/json/data.json'
	import MD5 from './md5'
	import ball from '@/components/Ball.vue'
	
	const appid = '20191120000358960'; 
	const key = 'ptma_HAnUgrQlJ9MdzGX'; 
	let salt = new Date().getTime(); 
	export default {
		name: "translate",
		components: {
			ball,
		},
		data() {
			return {
				description: "翻译页面",
				show: false,
				list: [
					[{label: '自动识别', labelEn: 'auto', value: 'auto'}, ...data],
					data,
				],
				alist: [{
					name: '骚话'
				}, {
					name: '待付款'
				}, {
					name: '待评价',
					count: 5
				}],
				current: 0,
				value: "",
				typeIndex: [0, 1],
				translated: '已翻译内容', 
			};
		},
		
		mounted() {
			console.log(this.$store.a)
		},

		methods: {
			/* 切换语言 */
			switchLang() {
				this.$i18n.locale = this.$i18n.locale == "en" ? "cn" : "en";
				uni.setNavigationBarTitle({
					title: this.$t("tabbar.肥宅翻译"),
				});
				// 注意：【支付宝小程序开发工具】需要1.13版本才支持此接口的模拟，真机预览不受限制
				uni.setTabBarItem({
					index: 0,
					text: this.$t("tabbar.翻译"),
				});
				uni.setTabBarItem({
					index: 1,
					text: this.$t("tabbar.历史记录"),
				});
			},
			
			translate() {
				const str1 = appid + this.value + salt + key; 
				const sign = MD5(str1); 
				const From = this.list[0][this.typeIndex[0]]
				const to = this.list[1][this.typeIndex[1]]
				let url
				
				// #ifdef H5
					url = '/api'
				// #endif
				// #ifdef MP-WEIXIN
					url = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
				// #endif
				
				uni.request({
				  url: url,
				  method: 'GET',
				  data: {
				    q: this.value,
				    appid: appid,
				    salt: salt,
				    from: From.value,
				    to: to.value,
				    sign: sign,
				    time: new Date().getTime()
				  },
				  success: res => {
					  this.translated = res.data.trans_result[0].dst
				  }
				});
			},

			copy() {
				uni.setClipboardData({
					data: 'hello',
					success: function () {
						console.log('success');
					}
				})
			},

			confirm(e) {
				console.log("e::: ", e);
			},
			
			ballClick(e) {
				console.log("e::: ", e);
			},
			
			onCurrentChange(current) {
				this.current = current
			}
			
		},
	};
</script>

<style lang="scss" scoped>
	$gap: 20rpx;
	
	.border {
		border: 1px solid rgb(220, 223, 230);
		border-radius: 4px;
		box-sizing: border-box;
	}
	
	.translate {
		display: flex;
		flex-direction: column;
		width: 80%;
		margin: 0 auto;
		padding-bottom: 100rpx;
		.t__header {
			margin: $gap 0 0;
		}
		
		.t__section {
			width: 100%;
			display: flex;
			justify-content: space-between;
			margin: $gap 0;
			.t__section__input {
				margin-right: 10%;
			}
			>>> .uni-input-placeholder {
				left: 0!important;
			}
		}
		
		.t__main {
			.t__main__box {
				padding: 5px 10px;
				max-height: 300rpx;
				overflow-y: scroll;
				@extend .border;
				.t__translated__val {
					min-height: 400rpx;
				}
			}
			
			.t__main__actions {
				display: flex;
				justify-content: space-between;
				margin: $gap 0;
				.left__action, .right__action {
					margin: 0;
					padding: 5rpx 30rpx;
					border: none!important;
				}
				.left__action::after, .right__action::after {
					border: none;
				}
			}
		}
		
		.t__footer {
			margin-top: $gap;
			height: 100rpx;
			color: var(--font-color);
			text-align: center;
		}
	}
</style>
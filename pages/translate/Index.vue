<template>
	<div class="translate">
		<header class="t__header">
			<u-button type="success" @click="show = true"
				>{{ list[0][typeIndex[0]]['label'] }} - - - {{ list[1][typeIndex[1]]['label'] }}</u-button
			>
			<u-select
				v-model="show"
				:default-value="typeIndex"
				mode="mutil-column"
				:list="list"
				@confirm="confirm"
			></u-select>
		</header>

		<section class="t__section">
			<u-input class="t__section__input"  v-model="value" type="text" :border="true" :clearable="true" placeholder="请输入" />
			<u-button class="t__section__button" type="success" @click="translate">翻译</u-button>
		</section>

		<main class="t__main">
			<div class="t__translated">
				{{translated}}
			</div>
			<div class="t__main__history">
				<span class="history__item" v-for="item in 12" :key="item">{{item + '' + Math.random()}}</span>
			</div>
		</main>

		<footer class="t__footer">
			新年新气象
			<br>
			肥宅翻译祝您的英语水平直线下降
		</footer>
	</div>
</template>

<script>
	import data from '@/static/json/data.json'
	// pages/map/map.js
	// 这是引入百度翻译的md5加密文件，接口也是百度的翻译api，凡是后面注释百度的，都不用想，复制粘贴就行
	import MD5 from './md5'; // 百度
	// 百度
	const appid = '20191120000358960'; // 百度
	// 百度
	const key = 'ptma_HAnUgrQlJ9MdzGX'; // 百度
	// 百度
	let salt = new Date().getTime(); // 百度
	export default {
		name: "translate",
		data() {
			return {
				description: "翻译页面",
				show: false,
				list: [
					[{label: '自动识别', labelEn: 'auto', value: 'auto'}, ...data],
					data,
				],
				value: "",
				typeIndex: [0, 1],
				translated: '已翻译内容', // 已翻译内容
			};
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
				const str1 = appid + this.value + salt + key; // 百度
				const sign = MD5(str1); // 百度
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
					  console.log("res.data.trans_result[0].dst::: ", res.data.trans_result[0].dst);
					  this.translated = res.data.trans_result[0].dst
				  }
				});
			},

			confirm(e) {
				console.log("e::: ", e);
			},
		},
	};
</script>

<style lang="scss" scoped>
	$radius: 4px;
	
	.translate {
		padding: 30rpx;
		.t__header {
			
		}

		.t__section {
			margin-top: 30rpx;
			display: flex;
			justify-content: space-between;
			.t__section__input {
				flex: 1;
			}
			.t__section__button {
				margin-left: 30rpx;
			}
		}

		.t__main {
			margin-top: 30rpx;
			
			.t__translated {
				min-height: 240rpx;
				padding: 10px;
				border: 1rpx solid $u-border-color;
				border-radius: $radius;
			}
			
			.t__main__history {
				display: flex;
				flex-wrap: wrap;
				margin-top: 30rpx;
				.history__item {
					display: inline-block;
					max-width: 100rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-right: 30rpx;
					margin-bottom: 15rpx;
					padding: 10rpx 15rpx;
					background: rgba( #19BE6B, .7);
					color: #fff;
					border: 1rpx solid $u-border-color;
					border-radius: 4rpx;
				}
			}
		}


		.t__footer {
			position: absolute;
			bottom: 100rpx;
			width: calc(100% - 60rpx);
			text-align: center;
			line-height: 60rpx;
			color: $u-type-success;
		}
	}
</style>
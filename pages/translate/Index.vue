<template>
	<div class="translate">
		<header class="t__header">
			<u-button type="success" @click="show = true">
				{{ list[0][typeIndex[0]]['label'] }} - - - {{ list[1][typeIndex[1]]['label'] }}
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
				<u-button class="left__action" size="small" @click="translated='已翻译内容'">清空</u-button>
				<u-button class="right__action" size="small" type="success" @click="copy">复制</u-button>
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

		<ball></ball>
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
				value: "",
				typeIndex: [0, 1],
				translated: '已翻译内容', 
				aaa: false,
			};
		},
		
		mounted() {
			// const subNvue = uni.getSubNVueById('sub');
			// subNvue.show();
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
					  console.log("res.data.trans_result[0].dst::: ", res.data.trans_result[0].dst);
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
		},
	};
</script>

<style>

</style>
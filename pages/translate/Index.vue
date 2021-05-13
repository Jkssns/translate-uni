<template>
	<uni-global-page class="translate">
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
			<u-input class="t__section__input"  v-model="value" type="text" :maxlength="-1" :border="true" :clearable="true" :placeholder="$t('message.请输入')" />
			<u-button class="t__section__button" type="success" @click="translate">{{$t('tabbar.翻译')}}</u-button>
		</section>

		<main class="t__main">
			<div class="t__main__box" :style="{color: translated === '已翻译内容' ? '#C0C4CC' : '#303133'}">
				<p class="t__translated__val">{{translated}}</p>
			</div>
			<div class="t__main__actions">
				<u-button class="left__action"  @click="translated='已翻译内容'">{{$t('translate.清空')}}</u-button>
				<u-button class="right__action" type="success" @click="copy(translated)">{{$t('translate.复制')}}</u-button>
			</div>
		</main> 
		
		<section class="t__saohua">
			<u-tabs class="t__saohua__type" :list="alist" active-color="#19BE6B" inactive-color="#606266" :is-scroll="false" :current="current" @change="onCurrentChange">
				<template v-slot:default="slotProps">
					<i v-if="slotProps.item.index === current" class="iconfont icon-Refresh t__refresh" :class="{refreshStatus: refreshStatus}" @click="refresh"></i>
				</template>
			</u-tabs>
			<div class="t__saohua__wrapper">
				<p class="t__saohua__item" v-for="(item, index) in beautifulWords" :key="index">
					<span class="t__saohua__text" :style="item.view ? {} : textItem" @click="viewText(item, index)" >{{item.text}}</span>
					<span class="t__saohua__action" v-if="item.view">
						<i class="iconfont icon-share t__saohua__icon"></i>
						<i class="iconfont icon-copy t__saohua__icon" @click="copy(item.text)"></i>
					</span>
				</p>
			</div>
		</section>
		
		<footer class="t__footer">
			{{$t('translate.新年新气象')}}
			<br>
			{{$t('translate.肥宅翻译祝您的英语水平直线下降')}}
		</footer>
		
		<ball @ball-click="ballClick"></ball>
	</uni-global-page>
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
					name: '爱你',
					key: 'Y',
					index: 0,
				}, {
					name: '爱她',
					key: 'M',
					index: 1,
				}, {
					name: '爱他',
					key: 'F',
					index: 2,
				}],
				beautifulWords: [], 
				typeIndex: [0, 1],
				
				current: 0,
				value: "123",
				translated: '已翻译内容', 
				
				textItem: {
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis',
				},

                refreshStatus: false, // 刷新动画
			}
		},
		
		mounted() {
			this.getList()
		},

		computed: {
			currentType() {  
                let type = this.alist[this.current].key
                type = type === 'Y' ? '' : type
				return type
			}
		},

		methods: {
			translate() {
				if (!this.value) return;
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
			
			getList() {
				uni.request({
					url: `https://api.lovelive.tools/api/SweetNothings/Serialization/Json%20/5?genderType=${this.currentType}`,
					method: 'GET',
					success: res => {
						this.beautifulWords = res.data.returnObj || []
						this.beautifulWords = res.data.returnObj.map(item => {
							return {
								view: false,
								text: item
							}
						})
					}
				});
			},
			
			viewText(item, index) {
				item.view = !item.view
			},
			
			/* 刷新*/
			refresh() {
                this.refreshStatus = true
                this.getList()
                setTimeout(() => {
                    this.refreshStatus = false
                }, 300)
                
			},
			
			share() {
				
			},
			
			copy(value) {
				if (!value) return;
				uni.setClipboardData({
				    data: value,
				    success: () => {
				       this.toast(this.$t('message.复制成功'))
				    }
				})
			},

			confirm(e) {
				console.log("e::: ", e)
			},
			
			ballClick(currentBall, item) {  // 分享  复制   点赞
				switch(currentBall.key) {
					case 'language':
						this.switchLang(currentBall, item)
						break;
					case 'theme':
						this.changeTheme(currentBall, item)
						break;
				}
			},
			
			/* 切换语言 */
			switchLang(item) {
				this.$i18n.locale = this.$i18n.locale == "en" ? "cn" : "en";
				uni.setNavigationBarTitle({
					title: this.$t("tabbar.肥宅翻译"),
				});
				uni.setTabBarItem({
					index: 0,
					text: this.$t("tabbar.翻译"),
				});
				uni.setTabBarItem({
					index: 1,
					text: this.$t("tabbar.历史记录"),
				});
			},
			
			/* 切换皮肤 */
			changeTheme(currentBall, item) {
				this.$store.currentTheme = item.value
			},
			
			onCurrentChange(current) {
				this.current = current
                this.getList()
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
					min-height: 280rpx;
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
		
		.t__saohua {
			.t__refresh {
				position: absolute;
				right: 10px;
				top: 0px;
                &.refreshStatus {
                    transform: rotate(360deg);
                    transition: all .3s;
                }
			}
			.t__saohua__wrapper {
				margin-top: -10rpx;
				padding-top: 10rpx;
				border-top: 1px solid var(--themeColor);
				.t__saohua__item {
					padding: 5rpx 0;
					width: 100%;
					border-bottom: 1px dashed var(--secondFontColor);
					.t__saohua__text {
						display: block;
						width: 100%;
						min-width: 0;
						min-height: 50rpx;
						color: var(--secondFontColor);
					}
					.t__saohua__action {
						display: flex;
						justify-content: space-between;
						align-items: center;
						width: calc(100% - 10rpx);
						padding: 0 5rpx;
						margin-top: 5rpx;
						height: 50rpx;
					}
				}
			}
		}
		
		.t__footer {
			margin-top: $gap;
			height: 100rpx;
			color: var(--fontColor);
			text-align: center;
		}
	}
</style>
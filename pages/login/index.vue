<template>
	<div class="login_container">
		<!-- <image class="login_bg" src="/static/imgs/login/boji1.jpeg" alt="" mode="aspectFill" /> -->
		<div class="login_btn" @tap="getUserInfo">{{$t('login.点一下')}}</div>
		<uni-popup ref="humenList" type="bottom">
			<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" collection="humens_list" :page-size="999999">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<scroll-view scroll-y="true" class="humens_list_wrapper">
						<radio-group @change="onRadioChange">
							<ul class="humens_list">
								<li 
									class="humen_item"
									v-for="(item, index) in getData(data)" 
									:key="item._id"
									@tap="item.checked=true"
								>
									<label class="radio" >
										<radio class="humen_item_edit" color="#409eff"></radio>
										<image class="humen_item_avatar" src="https://jkssns.oss-cn-hangzhou.aliyuncs.com/images/user.jpeg" />
										<div class="humen_basic_info">
											<span class="humen_name">{{item.name}}</span>
											<image v-if="item.sex" class="humen_item_sexIcon" :src="`/static/imgs/humens/${item.sex == 1 ? 'boy' : 'girl'}_icon.svg`" />
											<p class="humens_native_place">{{item.nativePlace}}</p>
										</div>
										<p class="humen_introduction">{{item.introduction}}</p>
									</label>
								</li>
							</ul>
						</radio-group>
					</scroll-view>
				</view>
			</unicloud-db>
		</uni-popup>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				description: '登录',
				openid: '',
			}
		},
		
		onReady() {
			this.checkSession()
		},
		
		methods: {
			getData(data = []) {
				return data.map(item => {
					return {
						...item,
						checked: false,
					}
				})
			},

			onRadioChange(e) {
				console.log("e::: ", e);
			},

			checkSession() {
				uni.checkSession({
					success: () => {
						// uni.switchTab({
						// 	url: '/pages/humens/index'
						// })
						// this.goHome()
						this.login()
					},
					fail: () => {
						this.login()
					}
				})
			},

			login() {
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						const params = {
							appid: 'wx3ebc9d7e8fd3d444',
							secret: 'd809ad3fa67f8b9146aa4934f99c93ba',
							js_code: loginRes.code,
							grant_type: 'authorization_code',
						}
						this.$server.getOpenId(params).then(res => {
							uni.setStorageSync(this.$const.USER_OPENID, res.openid)
							this.openid = res.openid
							this.checkUser(res.openid)
						})
					}
				});
			},

			/* 检查用户是否绑定过小程序 */
			checkUser(openid) {
				const humens = uniCloud.importObject('humens')
				humens.checkOpenid('openid').then(res => {
					if (res.data) {
						this.goHome()
					}
				})
			},

			getUserInfo() {
				// uni.getUserProfile({
				// 	desc: '展示用户信息头像和名称',
				// 	lang: 'zh_CN',
				// 	success: (res)=> {
						this.$refs.humenList.open()
				// 	}
				// })
			},

			goHome() {
				uni.reLaunch({
					url: '/pages/humens/index'
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.login_container {
		position: relative;
		width: 100%;
		height: 100%;
		.login_bg {
			position: absolute;
			top: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
		}
		.login_btn {
			position: absolute;
			left: 50%;
			bottom: 30%;
			transform: translateX(-50%);
			width: 500rpx;
			height: 80rpx;
			text-align: center;
			letter-spacing: 0.2em;
			line-height: 80rpx;
			color: #fff;
			font-size: 24rpx;
			font-weight: 600;
			border-radius: 6rpx;
			background: $uni-color-primary;
			box-shadow: 0 7px 0 $uni-color-primary, 0 8px 3px rgba(0, 0, 0, 0.3);
		}


		.humens_list_wrapper {
			width: 100%;
			height: 700rpx;
			background: #f6f6f6;
			border-radius: 16rpx;
			overflow: hidden;
			.humens_list {
				.humen_item {
					position: relative;
					width: 690rpx;
					height: auto;
					display: flex;
					align-content: flex-start;
					flex-wrap: wrap;
					padding: 20rpx;
					margin: 30rpx auto 0;
					background: rgba(255, 255, 255, 0.9);
					box-shadow: 0rpx 30rpx 40rpx rgba(151, 151, 151, 0.16);
					border-radius: 12rpx;
					box-sizing: border-box;
					overflow: hidden;
					transition: all 0.3s;
					.humen_item_edit {
						position: absolute;
						top: 10rpx;
						right: 30rpx;
						color: $uni-color-primary;
					}
					.humen_item_avatar {
						width: 120rpx;
						height: 120rpx;
						border-radius: 15rpx;
					}
					.humen_basic_info {
						flex: 1;
						display: flex;
						flex-wrap: wrap;
						margin-left: 20rpx;
						.humen_name {
							font-size: 22rpx;
							line-height: 1.5715;
						}
						.humen_item_sexIcon {
							width: 34rpx;
							height: 34rpx;
							margin-left: 20rpx;
						}
						.humens_native_place {
							display: block;
							width: 100%;
						}
					}
					.humen_more {
						position: absolute;
						right: 30rpx;
						top: 90rpx;
						width: 50rpx;
						height: 50rpx;
						color: $uni-color-primary;
						transform: rotate(-90deg);
						transition: all .3s;
					}
					.humen_introduction {
						display: inline-block;
						margin: 30rpx 10rpx 0;
						width: 100%;
						height: auto;
						word-break: break-all;
					}
				}
			}
		}


		::v-deep .uni-popup__wrapper-box {
			// background: #f6f6f6;
			padding-bottom: 0;
		}


	}
</style>
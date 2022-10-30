<template>
	<div class="login_container">
		<image class="login_bg" src="/static/imgs/login/boji1.jpeg" alt="" mode="aspectFill" />
		<uni-button class="login_btn" @tap="goHome" v-if="showBtn">点这里进奥~</uni-button>
		<!-- <uni-popup ref="humenList" type="bottom">
			<div class="Confirm_Bar">
				<span class="Cancel_Text" @tap="cancel">{{$t('common.取消')}}</span>
				<span class="Bar_Title">{{$t('login.绑定精神病')}}</span>
				<span class="Confirm_Text" @tap="confirm">{{$t('common.确定')}}</span>
			</div>
			<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" collection="humens_list" :page-size="999999">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<scroll-view scroll-y="true" class="humens_list_wrapper">
						<radio-group @change="onRadioChange">
							<ul class="humens_list">
								<li 
									class="humen_item_wrapper"
									v-for="(item, index) in getData(data)" 
									:key="item._id"
									@tap="item.checked=true"
								>
									<label class="radio humen_item">
										<radio class="humen_item_edit" v-if="index > 2" color="#409eff" :value="item._id"></radio>
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
						<div class="add_humen" @click="addHumen">没有？那就新增一个吧&gt;&gt;&gt;</div>
					</scroll-view>
				</view>
			</unicloud-db>
		</uni-popup> -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				description: '登录',
				openid: '',
				checkedHumenId: '',
				showBtn: false,
				shareText: [
					'快来记录今天的本院吧！',
					'病友，你有做史官的才能！',
					'历史由你书写！',
					'自盘古开天辟地后......',
					'不要挤，一个一个来。',
					'你在干什么？波吉在盯着你！',
				],
			}
		},
		
		onReady() {
			// this.checkSession()
			this.loginFn()
		},
		
		onShareAppMessage(res) {
			const random = Math.floor(Math.random() * 6)
			return {
			  title: this.shareText[random],
			  path: '/pages/login/index'
			}
		},
		
		methods: {
			// getData(data = []) {
			// 	return data.filter(item => !item.openid).map(item => {
			// 		return {
			// 			...item,
			// 			checked: false,
			// 		}
			// 	})
			// },

			// onRadioChange(e) {
			// 	this.checkedHumenId = e.detail.value
			// },

			// checkSession() {
			// 	uni.checkSession({
			// 		success: () => {
			// 			// uni.switchTab({
			// 			// 	url: '/pages/humens/index'
			// 			// })
			// 			// this.goHome()
			// 			this.login()
			// 		},
			// 		fail: () => {
			// 			this.login()
			// 		}
			// 	})
			// },

			// login() {
			// 	uni.login({
			// 		provider: 'weixin',
			// 		success: (loginRes) => {
			// 			const params = {
			// 				appid: 'wx3ebc9d7e8fd3d444',
			// 				secret: 'd809ad3fa67f8b9146aa4934f99c93ba',
			// 				js_code: loginRes.code,
			// 				grant_type: 'authorization_code',
			// 			}
			// 			this.$server.getOpenId(params).then(res => {
			// 				uni.setStorageSync(this.$const.USER_OPENID, res.openid)
			// 				this.openid = res.openid
			// 				this.checkUser()
			// 			})
			// 		}
			// 	});
			// },

			// /* 检查用户是否绑定过小程序 */
			// checkUser() {
			// 	const humens = uniCloud.importObject('humens')
			// 	humens.checkOpenid(this.openid).then(res => {
			// 		uni.showToast({
			// 			title: res.data + '1',
			// 		})
			// 		if (res.data) {
			// 			this.goHome()
			// 		} else {
			// 			this.getUserInfo()
			// 		}
			// 	})
			// },
			
			// getLoginText() {
			// 	const db = uniCloud.database();
			// 	db.collection('text').where({
			// 		openid: this.openid,
			// 	}).get({one: true}).then(res => {
			// 		const data = res.result.data[0]
			// 		if (data) {
			// 			uni.setStorageSync(this.$const.USER_INFO, {openid: this.openid, ...data.userInfo})
			// 		}
			// 		this.showBtn = true
			// 	})
			// },

			async loginFn() {
				const db = uniCloud.database();
				const { result } = await db.collection('word').get({one: true})
				const secret = result.data[0].name
				const appid = result.data[0].value
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						const params = {
							appid: appid,
							secret: secret,
							js_code: loginRes.code,
							grant_type: 'authorization_code',
						}
						const userCloud = uniCloud.importObject('user')
						userCloud.getOpenid(params).then(res => {
							this.openid = res.openid
							uni.setStorageSync(this.$const.USER_OPENID, res.openid)
							this.checkUser()
						})
					}
				});
			},

			checkUser() {
				uni.setStorageSync(this.$const.USER_INFO, null)
				const db = uniCloud.database();
				db.collection('user').where({
					openid: this.openid,
				}).get({one: true}).then(res => {
					const data = res.result.data[0]
					if (data) {
						uni.setStorageSync(this.$const.USER_INFO, {openid: this.openid, ...data.userInfo})
					}
					this.showBtn = true
				})
			},

			addHumen() {
				uni.reLaunch({
					url: '/pages/humens/edit?openid=' + this.openid
				})
			},

			goHome() {
				uni.redirectTo({
					url: '/pages/diary/index'
				})
			},
			
			cancel() {
				this.$refs.humenList.close()
			},
			
			confirm() {
				const db = uniCloud.database();
				
				db.collection('humens_list').where({
					_id: this.checkedHumenId,
				}).update({
					openid: this.openid,
				}).then(res => {
					uni.showToast({
						title: this.$t('common.绑定成功'),
					})
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/humens/index'
						})
					}, 500)
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
			overflow: hidden;
			.humens_list {
				.humen_item_wrapper {
					position: relative;
					width: 690rpx;
					height: auto;
					padding: 20rpx;
					margin: 30rpx auto 0;
					background: rgba(255, 255, 255, 0.9);
					box-shadow: 0rpx 30rpx 40rpx rgba(151, 151, 151, 0.16);
					border-radius: 12rpx;
					box-sizing: border-box;
					overflow: hidden;
					transition: all 0.3s;
					.humen_item {
						display: flex;
						align-content: flex-start;
						flex-wrap: wrap;
					}
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
							font-size: 32rpx;
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

		.add_humen {
			height: 180rpx;
			line-height: 80rpx;
			text-align: center;
			color: $uni-color-primary;
		}


		::v-deep .uni-popup__wrapper-box {
			// background: #f6f6f6;
			padding-bottom: 0;
		}


	}
</style>
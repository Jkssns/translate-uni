<template>
	<button class="Bottom_Btn" @tap="handleClickConfirm">
		<slot></slot>
	</button>
</template>

<script>
	export default {
		data() {
			return {
				description: '按钮',
				
			}
		},
		methods: {
			handleClickConfirm() {
				const user = uni.getStorageSync(this.$const.USER_INFO)
				if (user) {
					this.$emit('click')
				} else {
					uni.getUserProfile({
						desc: '展示用户信息头像和名称',
						lang: 'zh_CN',
						success: ({ userInfo }) => {
							const db = uniCloud.database();
							db.collection('user').add({
								openid: this.openid,
								userInfo: userInfo
							}).then(res => {
								uni.setStorageSync(this.$const.USER_INFO, {openid: this.openid, ...userInfo})
								this.$emit('click')
							}).catch(() => {
								uni.showToast({
									title: '你网不好吧？',
									icon: 'error'
								})
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni_confirm_button {
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
</style>
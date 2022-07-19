<template>
	<div class="login_container">
		<!-- <image class="login_bg" src="/static/imgs/login/boji1.jpeg" alt="" mode="aspectFill" /> -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				description: '登录'
			}
		},
		
		onReady() {
			this.checkSession()
		},
		
		methods: {
			checkSession() {
				// uni.login({
				// 	provider: 'weixin',
				// 	scopes: 'auth_user',

				// })
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						console.log(loginRes);
						const params = {
							appid: 'wx3ebc9d7e8fd3d444',
							secret: 'd809ad3fa67f8b9146aa4934f99c93ba',
							js_code: loginRes.code,
							grant_type: 'authorization_code',
						}
						this.$server.getOpenId().then(res => {
							console.log("res::: ", res);
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login_container {
		width: 100%;
		height: 100%;
		.login_bg {
			width: 100%;
			height: 100%;
		}
	}
</style>
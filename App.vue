<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.getSystemInfo({
			    success: (res) =>  {
			       this.globalData.info = res
			    }
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {},
	}
</script>

<style lang="scss">
	/* 每个页面公共css */
	page, uni-page-body {
		width: 100%;
		height: 100%;
	}
</style>

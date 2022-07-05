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
	@import "./common/font/iconfont.css";
	ul,ol {
		margin: 0;
		padding: 0;
	}
	li {
		list-style: none;
	}
	/* 每个页面公共css */
	uni-page-body {
		width: 100%;
		height: 100%;
	}
</style>

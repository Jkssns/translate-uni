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
	@import "uview-ui/index.scss";
	@import "./common/font/iconfont.css";
	
	/*每个页面公共css */
	uni-page-body {
		width: 100%;
		height: 100%;
	}
	
	:root {
		--fontColor: #19be6b;
		--secondFontColor: #606266;
		--themeColor: #19be6b;
	}
</style>

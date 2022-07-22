<template>
	<div class="uni_button">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				description: '按钮',
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	.uni_button {
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
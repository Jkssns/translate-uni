<template>
	<view class="container">
		<view class="function-list">
			<view class="function-item" @click="navigateTo('/pages/noise/noise')">
				<view class="function-icon noise-icon">
					<view class="wave"></view>
					<view class="wave"></view>
					<view class="wave"></view>
				</view>
				<view class="function-info">
					<text class="function-title">交通环境噪音检测</text>
					<text class="function-desc">实时检测周围环境噪音分贝值</text>
				</view>
				<view class="arrow"></view>
			</view>
			
			<view class="function-item" @click="navigateTo('/pages/bmi/bmi')">
				<view class="function-icon bmi-icon">
					<view class="bmi-symbol">BMI</view>
				</view>
				<view class="function-info">
					<text class="function-title">BMI值计算</text>
					<text class="function-desc">计算身体质量指数，了解健康状态</text>
				</view>
				<view class="arrow"></view>
			</view>

			<view class="function-item" @click="navigateTo('/pages/qrcode/qrcode')">
				<view class="function-icon qrcode-icon">
					<view class="qrcode-symbol">QR</view>
				</view>
				<view class="function-info">
					<text class="function-title">二维码生成器</text>
					<text class="function-desc">文字转二维码，支持添加Logo</text>
				</view>
				<view class="arrow"></view>
			</view>

			<view class="function-item" @click="navigateTo('/pages/ruler/ruler')">
				<view class="function-icon ruler-icon">
					<view class="ruler-symbol">尺</view>
				</view>
				<view class="function-info">
					<text class="function-title">应急尺子</text>
					<text class="function-desc">应急测量工具，精确到厘米</text>
				</view>
				<view class="arrow"></view>
			</view>

			<view class="function-item" @click="navigateTo('/pages/imagehost/imagehost')">
				<view class="function-icon imagehost-icon">
					<view class="imagehost-symbol">图</view>
				</view>
				<view class="function-info">
					<text class="function-title">图片临时存储</text>
					<text class="function-desc">快速上传和分享图片</text>
				</view>
				<view class="arrow"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			}
		},
		onShareAppMessage() {
			return {
				title: '实用工具集 - 让生活更便捷',
				path: '/pages/other/other',
				imageUrl: '/static/imgs/tabbar/other-active.png'
			}
		}
	}
</script>

<style>
.container {
	padding: 40rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}
.function-list {
	background-color: #ffffff;
	border-radius: 40rpx;
	padding: 20rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}
.function-item {
	display: flex;
	align-items: center;
	padding: 40rpx;
	border-bottom: 2rpx solid #f0f0f0;
	position: relative;
}
.function-item:last-child {
	border-bottom: none;
}
.function-icon {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50rpx;
	background-color: #3cc51f;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 30rpx;
	position: relative;
	overflow: hidden;
}
.noise-icon {
	background-color: #3cc51f;
}
.bmi-icon {
	background-color: #007AFF;
}
.bmi-symbol {
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
}
.wave {
	position: absolute;
	width: 100%;
	height: 100%;
	border: 4rpx solid #ffffff;
	border-radius: 50%;
	animation: wave 2s infinite;
}
.wave:nth-child(2) {
	animation-delay: 0.5s;
}
.wave:nth-child(3) {
	animation-delay: 1s;
}
@keyframes wave {
	0% {
		transform: scale(0.5);
		opacity: 1;
	}
	100% {
		transform: scale(1.5);
		opacity: 0;
	}
}
.function-info {
	flex: 1;
}
.function-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}
.function-desc {
	font-size: 28rpx;
	color: #666;
}
.arrow {
	color: #999;
	font-size: 36rpx;
	margin-left: 20rpx;
	position: relative;
	width: 40rpx;
	height: 40rpx;
}
.arrow::after {
	content: '';
	position: absolute;
	right: -4rpx;
	top: 50%;
	width: 16rpx;
	height: 16rpx;
	border-top: 4rpx solid #999;
	border-right: 4rpx solid #999;
	transform: translateY(-50%) rotate(45deg);
	transition: all 0.3s ease;
}
.function-item:active .arrow::after {
	right: -4rpx;
}
.qrcode-icon {
	background-color: #3cc51f;
}
.qrcode-symbol {
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
}
.ruler-icon {
	background-color: #000000;
}
.ruler-symbol {
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
}
.imagehost-icon {
	background-color: #3cc51f;
}
.imagehost-symbol {
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
}
</style> 
<template>
	<view class="container">
		<view class="ruler-container">
			<!-- 上边刻度 -->
			<view class="ruler ruler-top">
				<view class="ruler-scale" v-for="(scale, index) in scales" :key="'bottom-'+index">
					<view class="scale-line" :class="{ 
						'major': scale.isMajor,
						'medium': scale.isMedium,
						'minor': !scale.isMajor && !scale.isMedium
					}"></view>
					<text class="scale-text" v-if="scale.isMajor">{{scale.value}}cm</text>
				</view>
			</view>
			
			<!-- 下边刻度 -->
			<view class="ruler ruler-bottom">
				<view class="ruler-scale" v-for="(scale, index) in scales" :key="'top-'+index">
					<text class="scale-text" v-if="scale.isMajor">{{scale.value}}cm</text>
					<view class="scale-line" :class="{ 
						'major': scale.isMajor,
						'medium': scale.isMedium,
						'minor': !scale.isMajor && !scale.isMedium
					}"></view>
				</view>
			</view>
			
			<!-- 左边刻度 -->
			<view class="ruler ruler-left">
				<view class="ruler-scale" v-for="(scale, index) in verticalScales" :key="'left-'+index">
					<view class="scale-line" :class="{ 
						'major': scale.isMajor,
						'medium': scale.isMedium,
						'minor': !scale.isMajor && !scale.isMedium
					}"></view>
					<text class="scale-text" v-if="scale.isMajor">{{scale.value}}cm</text>
				</view>
			</view>
			
			<!-- 右边刻度 -->
			<view class="ruler ruler-right">
				<view class="ruler-scale" v-for="(scale, index) in verticalScales" :key="'right-'+index">
					<text class="scale-text" v-if="scale.isMajor">{{scale.value}}cm</text>
					<view class="scale-line" :class="{ 
						'major': scale.isMajor,
						'medium': scale.isMedium,
						'minor': !scale.isMajor && !scale.isMedium
					}"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scales: [],
				verticalScales: []
			}
		},
		onLoad() {
			// 获取屏幕尺寸
			const systemInfo = uni.getSystemInfoSync();
			const screenWidth = systemInfo.windowWidth;
			const screenHeight = systemInfo.windowHeight;
			
			// 计算水平刻度数量（每厘米约38像素）
			const pixelsPerCm = 38;
			const totalCm = Math.floor(screenWidth / pixelsPerCm);
			
			// 生成水平刻度数据
			this.scales = Array.from({ length: totalCm * 10 + 1 }, (_, i) => ({
				value: i % 10 === 0 ? i / 10 : '',
				isMajor: i % 10 === 0,
				isMedium: i % 5 === 0 && i % 10 !== 0
			}));
			
			// 计算垂直刻度数量
			const totalVerticalCm = Math.floor(screenHeight / pixelsPerCm);
			
			// 生成垂直刻度数据
			this.verticalScales = Array.from({ length: totalVerticalCm * 10 + 1 }, (_, i) => ({
				value: i % 10 === 0 ? i / 10 : '',
				isMajor: i % 10 === 0,
				isMedium: i % 5 === 0 && i % 10 !== 0
			}));
		},
		onShareAppMessage() {
			return {
				title: '应急尺子 - 随时测量身边物品',
				path: '/pages/ruler/ruler',
				imageUrl: '/static/imgs/tabbar/other-active.png'
			}
		}
	}
</script>

<style>
.container {
	padding: 0;
	background-color: #ffffff;
	min-height: 100vh;
	position: relative;
}
.ruler-container {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
}
.ruler {
	position: absolute;
	display: flex;
	pointer-events: none;
}
.ruler-top {
	top: 0;
	left: 0;
	right: 0;
	height: 40px;
}
.ruler-bottom {
	bottom: 0;
	left: 0;
	right: 0;
	height: 40px;
}
.ruler-left {
	left: 0;
	top: 0;
	bottom: 0;
	width: 40px;
	flex-direction: column;
}
.ruler-right {
	right: 0;
	top: 0;
	bottom: 0;
	width: 40px;
	flex-direction: column;
}
.ruler-scale {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 3.8px; /* 每毫米的宽度 */
}
.ruler-left .ruler-scale,
.ruler-right .ruler-scale {
	width: auto;
	height: 3.8px; /* 每毫米的高度 */
	flex-direction: row;
	align-items: center;
}
.scale-line {
	width: 1px;
	background-color: #000000;
	opacity: 0.6;
}
.ruler-left .scale-line,
.ruler-right .scale-line {
	width: auto;
	height: 1px;
}
.scale-line.major {
	width: 2px;
	height: 25px;
	opacity: 1;
}
.ruler-left .scale-line.major,
.ruler-right .scale-line.major {
	width: 25px;
	height: 2px;
}
.scale-line.medium {
	width: 1px;
	height: 15px;
	opacity: 0.8;
}
.ruler-left .scale-line.medium,
.ruler-right .scale-line.medium {
	width: 15px;
	height: 1px;
}
.scale-line.minor {
	width: 1px;
	height: 8px;
}
.ruler-left .scale-line.minor,
.ruler-right .scale-line.minor {
	width: 8px;
	height: 1px;
}
.scale-text {
	font-size: 12px;
	color: #000000;
	font-weight: bold;
	white-space: nowrap;
	line-height: 1;
}
.ruler-top .scale-text {
	margin-bottom: 5px;
}
.ruler-bottom .scale-text {
	margin-top: 5px;
}
.ruler-left .scale-text {
	margin-left: 5px;
}
.ruler-right .scale-text {
	margin-right: 5px;
}

.ruler-top .ruler-scale{ 
	justify-content: flex-start;
}
.ruler-left .ruler-scale{ 
	justify-content: flex-start;
}
.ruler-bottom .ruler-scale{ 
	justify-content: flex-end;
}
.ruler-right .ruler-scale{ 
	justify-content: flex-end;
}
</style> 
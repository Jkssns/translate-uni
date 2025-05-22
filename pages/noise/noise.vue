<template>
	<view class="container">
		<view class="noise-card">
			<view class="noise-value">
				<text class="value">{{noiseValue}}</text>
				<text class="unit">dB</text>
			</view>
			<view class="noise-level">
				<text class="level-text">{{noiseLevel}}</text>
			</view>
			<view class="noise-meter">
				<view class="meter-bar" :style="{ width: meterWidth + '%' }"></view>
			</view>
			<view class="meter-labels">
				<text class="label">安静</text>
				<text class="label">正常</text>
				<text class="label">吵闹</text>
				<text class="label">危险</text>
			</view>
			<view class="recording-time" v-if="isRecording">
				<text class="time-text">检测时间：{{formatTime(recordingTime)}}</text>
			</view>
		</view>
		
		<view class="result-card" v-if="showResult">
			<view class="result-title">检测结果</view>
			<view class="result-content">
				<view class="result-item">
					<text class="item-label">平均噪音值：</text>
					<text class="item-value">{{averageNoise}} dB</text>
				</view>
				<view class="result-item">
					<text class="item-label">噪音等级：</text>
					<text class="item-value" :style="{ color: getLevelColor(averageNoise) }">{{getNoiseLevel(averageNoise)}}</text>
				</view>
				<view class="result-item">
					<text class="item-label">检测时长：</text>
					<text class="item-value">{{formatTime(recordingTime)}}</text>
				</view>
				<view class="result-suggestion">
					<text class="suggestion-title">建议：</text>
					<text class="suggestion-content">{{getSuggestion(averageNoise)}}</text>
				</view>
			</view>
		</view>
		
		<view class="info-card">
			<view class="info-title">噪音等级说明</view>
			<view class="info-list">
				<view class="info-item" v-for="(item, index) in noiseLevels" :key="index">
					<view class="level-dot" :style="{ backgroundColor: item.color }"></view>
					<text class="level-range">{{item.range}}</text>
					<text class="level-desc">{{item.desc}}</text>
				</view>
			</view>
		</view>
		
		<view class="action-card">
			<button class="action-btn" :class="{ 'recording': isRecording }" @click="toggleRecording">
				{{isRecording ? '停止检测' : '开始检测'}}
			</button>
			<text class="tip-text">建议检测时间：30秒</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noiseValue: 0,
				isRecording: false,
				recordingTime: 0,
				showResult: false,
				noiseValues: [],
				averageNoise: 0,
				noiseLevels: [
					{ range: '0-30dB', desc: '非常安静，适合休息', color: '#3cc51f' },
					{ range: '30-60dB', desc: '正常环境，舒适', color: '#8a8a8a' },
					{ range: '60-80dB', desc: '较吵闹，可能影响听力', color: '#ff9900' },
					{ range: '80dB以上', desc: '危险噪音，需要防护', color: '#ff0000' }
				]
			}
		},
		computed: {
			noiseLevel() {
				if (this.noiseValue < 30) return '安静';
				if (this.noiseValue < 60) return '正常';
				if (this.noiseValue < 80) return '吵闹';
				return '危险';
			},
			meterWidth() {
				return Math.min((this.noiseValue / 100) * 100, 100);
			}
		},
		methods: {
			toggleRecording() {
				this.isRecording = !this.isRecording;
				if (this.isRecording) {
					this.startRecording();
				} else {
					this.stopRecording();
				}
			},
			startRecording() {
				// 重置数据
				this.noiseValues = [];
				this.showResult = false;
				
				// 开始录音并检测噪音
				uni.getRecorderManager().start({
					duration: 30000, // 最长录音时间，单位ms
					sampleRate: 44100,
					numberOfChannels: 1,
					encodeBitRate: 192000,
					format: 'mp3'
				});
				
				// 模拟噪音值变化
				this.noiseTimer = setInterval(() => {
					const value = Math.floor(Math.random() * 100);
					this.noiseValue = value;
					this.noiseValues.push(value);
				}, 1000);
				
				// 开始计时
				this.recordingTime = 0;
				this.timeTimer = setInterval(() => {
					this.recordingTime++;
					// 30秒后自动停止
					if (this.recordingTime >= 30) {
						this.stopRecording();
					}
				}, 1000);
			},
			stopRecording() {
				// 停止录音
				uni.getRecorderManager().stop();
				clearInterval(this.noiseTimer);
				clearInterval(this.timeTimer);
				
				// 计算平均噪音值
				if (this.noiseValues.length > 0) {
					this.averageNoise = Math.round(
						this.noiseValues.reduce((a, b) => a + b, 0) / this.noiseValues.length
					);
				}
				
				this.showResult = true;
				this.noiseValue = 0;
				this.isRecording = false;
			},
			formatTime(seconds) {
				const mins = Math.floor(seconds / 60);
				const secs = seconds % 60;
				return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
			},
			getNoiseLevel(value) {
				if (value < 30) return '安静';
				if (value < 60) return '正常';
				if (value < 80) return '吵闹';
				return '危险';
			},
			getLevelColor(value) {
				if (value < 30) return '#3cc51f';
				if (value < 60) return '#8a8a8a';
				if (value < 80) return '#ff9900';
				return '#ff0000';
			},
			getSuggestion(value) {
				if (value < 30) {
					return '环境非常安静，适合休息和专注工作。';
				} else if (value < 60) {
					return '环境噪音在正常范围内，适合日常活动。';
				} else if (value < 80) {
					return '环境较吵闹，建议佩戴耳塞或寻找安静场所。';
				} else {
					return '环境噪音较大，建议立即离开或采取防护措施。';
				}
			}
		},
		onUnload() {
			if (this.isRecording) {
				this.stopRecording();
			}
		},
		onShareAppMessage() {
			return {
				title: '交通环境噪音检测 - 保护您的听力健康',
				path: '/pages/noise/noise',
				imageUrl: '/static/imgs/tabbar/other-active.png'
			}
		}
	}
</script>

<style>
.container {
	padding: 40rpx;
	box-sizing: border-box;
	background-color: #f5f5f5;
	min-height: 100vh;
}
.noise-card {
	background-color: #ffffff;
	border-radius: 40rpx;
	padding: 60rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
	margin-bottom: 40rpx;
}
.noise-value {
	text-align: center;
	margin-bottom: 20px;
}
.value {
	font-size: 96rpx;
	font-weight: bold;
	color: #333;
}
.unit {
	font-size: 48rpx;
	color: #666;
	margin-left: 10rpx;
}
.noise-level {
	text-align: center;
	margin-bottom: 60rpx;
}
.level-text {
	font-size: 40rpx;
	color: #3cc51f;
	font-weight: bold;
}
.noise-meter {
	height: 40rpx;
	background-color: #f0f0f0;
	border-radius: 20rpx;
	overflow: hidden;
	margin-bottom: 20rpx;
}
.meter-bar {
	height: 100%;
	background: linear-gradient(to right, #3cc51f, #ff9900, #ff0000);
	transition: width 0.3s ease;
}
.meter-labels {
	display: flex;
	justify-content: space-between;
	padding: 0 20rpx;
}
.label {
	font-size: 24rpx;
	color: #666;
}
.recording-time {
	text-align: center;
	margin-top: 40rpx;
}
.time-text {
	font-size: 32rpx;
	color: #666;
}
.result-card {
	background-color: #ffffff;
	border-radius: 40rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
	margin-bottom: 40rpx;
}
.result-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	padding-left: 20rpx;
	border-left: 8rpx solid #3cc51f;
}
.result-content {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}
.result-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
}
.item-label {
	font-size: 28rpx;
	color: #666;
	min-width: 160rpx;
}
.item-value {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}
.result-suggestion {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 2rpx solid #f0f0f0;
}
.suggestion-title {
	font-size: 28rpx;
	color: #666;
	display: block;
	margin-bottom: 10rpx;
}
.suggestion-content {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
}
.info-card {
	background-color: #ffffff;
	border-radius: 40rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
	margin-bottom: 40rpx;
}
.info-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	padding-left: 20rpx;
	border-left: 8rpx solid #3cc51f;
}
.info-list {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}
.info-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
}
.level-dot {
	width: 24rpx;
	height: 24rpx;
	border-radius: 12rpx;
}
.level-range {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	min-width: 160rpx;
}
.level-desc {
	font-size: 28rpx;
	color: #666;
}
.action-card {
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
}
.action-btn {
	background-color: #3cc51f;
	color: #ffffff;
	border-radius: 50rpx;
	font-size: 32rpx;
	padding: 24rpx 0;
	width: 400rpx;
}
.action-btn.recording {
	background-color: #ff0000;
}
.tip-text {
	font-size: 28rpx;
	color: #666;
}
</style> 
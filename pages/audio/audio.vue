<template>
	<view class="container">
		<view class="audio-player">
			<view class="audio-info">
				<view class="title-container">
					<text class="title">防晕车音频</text>
					<text class="subtitle">100Hz 音频</text>
				</view>
				<view class="wave-animation" :class="{ 'is-playing': isPlaying }">
					<view class="wave-bar"></view>
					<view class="wave-bar"></view>
					<view class="wave-bar"></view>
					<view class="wave-bar"></view>
					<view class="wave-bar"></view>
				</view>
			</view>
			<view class="progress-container">
				<text class="time current">{{formatTime(currentTime)}}</text>
				<slider class="progress-bar" :value="progress" @change="onSliderChange" activeColor="#3cc51f" backgroundColor="#e0e0e0" block-size="12" />
				<text class="time total">{{formatTime(duration)}}</text>
			</view>
			<view class="controls">
				<view class="control-btn stop" @click="stopAudio">
					<view class="icon stop-icon">
						<view class="stop-square"></view>
					</view>
				</view>
				<view class="control-btn main" @click="isPlaying ? pauseAudio() : playAudio()">
					<view class="icon" :class="isPlaying ? 'pause-icon' : 'play-icon'">
						<view v-if="isPlaying" class="pause-bars">
							<view class="pause-bar"></view>
							<view class="pause-bar"></view>
						</view>
						<view v-else class="play-triangle"></view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="info-section">
			<view class="info-item">
				<text class="question">Q：什么时候听？</text>
				<text class="answer">A：最好乘车前，乘车中也有效，至少听1分钟。</text>
			</view>

			<view class="info-item">
				<text class="question">Q：为什么晕车？</text>
				<text class="answer">A：晕车源于内耳前庭系统（感知运动）、视觉、本体感觉的信息冲突。乘车时，前庭觉传递 "运动" 信号，而视觉（如看手机、坐封闭车内）或身体静止感传递 "静止" 信号，大脑因矛盾误判为 "中毒"，引发恶心、眩晕等保护性反应。儿童因前庭发育未成熟、女性受激素影响，更易出现晕车症状。</text>
			</view>
			
			<view class="info-item">
				<text class="question">Q：这段音频有什么作用？</text>
				<text class="answer">A：研究发现，100赫兹的声音能通过听觉系统传递信号，刺激内耳的耳石器官（负责感知直线运动和重力），激活相关神经通路，进而影响前庭系统的平衡调节功能，100秒的声音可能帮助改善晕车、眩晕等与前庭功能异常相关的症状。</text>
			</view>
			
			<view class="notice-section">
				<text class="notice-title">注意事项：</text>
				<view class="notice-list">
					<text class="notice-item">1、双耳要均衡地接收声音；</text>
					<text class="notice-item">2、内耳接收到的声音响度在 80～85 分贝之间，手机音量80%-100%；</text>
					<text class="notice-item">3、声音需要稳定、持续地播放 1 分钟；</text>
				</view>
			</view>
		</view>

		<view class="section">
			<view class="section-title">晕车预防小贴士</view>
			<view class="tips-list">
				<view class="tip-item" v-for="(tip, index) in preventionTips" :key="index">
					<text class="tip-number">{{index + 1}}</text>
					<text class="tip-content">{{tip}}</text>
				</view>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">晕车症状自测</view>
			<view class="symptom-list">
				<view class="symptom-item" v-for="(symptom, index) in symptoms" :key="index">
					<checkbox :checked="symptom.checked" @tap="toggleSymptom(index)" color="#3cc51f" />
					<text class="symptom-text">{{symptom.text}}</text>
				</view>
			</view>
			<view class="result-box" v-if="checkedCount > 0">
				<text class="result-text">您选择了 {{checkedCount}} 个症状</text>
				<text class="result-suggestion">{{getSuggestion()}}</text>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">紧急处理指南</view>
			<view class="emergency-steps">
				<view class="step-item" v-for="(step, index) in emergencySteps" :key="index">
					<view class="step-number">{{index + 1}}</view>
					<view class="step-content">
						<text class="step-title">{{step.title}}</text>
						<text class="step-desc">{{step.desc}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">乘车建议</view>
			<view class="advice-list">
				<view class="advice-item" v-for="(advice, index) in travelAdvice" :key="index">
					<text class="advice-title">{{advice.title}}</text>
					<text class="advice-content">{{advice.content}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext();
	
	export default {
		data() {
			return {
				isPlaying: false,
				progress: 0,
				duration: 0,
				currentTime: 0,
				preventionTips: [
					"乘车前1-2小时避免进食过饱",
					"选择靠窗座位，保持通风",
					"避免在车内阅读或使用手机",
					"保持充足睡眠，避免疲劳",
					"准备一些薄荷糖或姜片"
				],
				symptoms: [
					{ text: "头晕", checked: false },
					{ text: "恶心", checked: false },
					{ text: "呕吐", checked: false },
					{ text: "出冷汗", checked: false },
					{ text: "面色苍白", checked: false },
					{ text: "注意力不集中", checked: false }
				],
				emergencySteps: [
					{
						title: "立即停车",
						desc: "如果可能，让车辆停在安全位置，打开车窗通风"
					},
					{
						title: "调整姿势",
						desc: "让患者平躺或半躺，头部稍微抬高"
					},
					{
						title: "补充水分",
						desc: "少量多次饮用温水，避免一次性大量饮水"
					},
					{
						title: "使用药物",
						desc: "如有晕车药，按说明书服用"
					}
				],
				travelAdvice: [
					{
						title: "座位选择",
						content: "选择靠窗座位，保持通风，避免坐在后排"
					},
					{
						title: "视线控制",
						content: "保持视线在前方远处，避免看近处或窗外快速移动的物体"
					},
					{
						title: "饮食建议",
						content: "乘车前1-2小时避免进食过饱，可准备一些清淡食物"
					},
					{
						title: "心理调节",
						content: "保持心情放松，避免过度紧张"
					}
				]
			}
		},
		computed: {
			checkedCount() {
				return this.symptoms.filter(s => s.checked).length;
			}
		},
		methods: {
			playAudio() {
				innerAudioContext.play();
			},
			pauseAudio() {
				innerAudioContext.pause();
			},
			stopAudio() {
				innerAudioContext.stop();
				this.currentTime = 0;
				this.progress = 0;
			},
			onSliderChange(e) {
				const value = e.detail.value;
				const time = (value / 100) * this.duration;
				innerAudioContext.seek(time);
				this.currentTime = time;
			},
			formatTime(seconds) {
				if (!seconds) return '00:00';
				const minutes = Math.floor(seconds / 60);
				const remainingSeconds = Math.floor(seconds % 60);
				return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
			},
			toggleSymptom(index) {
				this.symptoms[index].checked = !this.symptoms[index].checked;
			},
			getSuggestion() {
				const count = this.checkedCount;
				if (count <= 2) {
					return "症状较轻，建议使用防晕车音频，保持通风";
				} else if (count <= 4) {
					return "症状中等，建议使用防晕车音频，必要时服用晕车药";
				} else {
					return "症状较重，建议立即停车休息，必要时就医";
				}
			}
		},
		onLoad() {
			innerAudioContext.src = '/static/audio/100hz.mp3';
			
			// 监听音频加载完成事件
			innerAudioContext.onCanplay(() => {
				// 尝试获取音频时长
				if (innerAudioContext.duration > 0) {
					this.duration = innerAudioContext.duration;
				} else {
					// 如果无法立即获取时长，设置一个默认值
					this.duration = 100; // 假设音频长度为100秒
				}
			});
			
			// 监听播放开始
			innerAudioContext.onPlay(() => {
				this.isPlaying = true;
				// 开始播放时再次尝试获取时长
				if (innerAudioContext.duration > 0) {
					this.duration = innerAudioContext.duration;
				}
			});
			
			innerAudioContext.onPause(() => {
				this.isPlaying = false;
			});
			
			innerAudioContext.onStop(() => {
				this.isPlaying = false;
				this.progress = 0;
				this.currentTime = 0;
			});
			
			// 优化时间更新逻辑
			innerAudioContext.onTimeUpdate(() => {
				this.currentTime = innerAudioContext.currentTime || 0;
				if (this.duration > 0) {
					this.progress = (this.currentTime / this.duration) * 100;
				}
			});
			
			// 监听错误事件
			innerAudioContext.onError((res) => {
				console.error('音频播放错误：', res);
				uni.showToast({
					title: '音频加载失败',
					icon: 'none'
				});
			});
		},
		onUnload() {
			innerAudioContext.destroy();
		},
		onShareAppMessage() {
			return {
				title: '防晕车音频 - 100Hz声音疗法',
				path: '/pages/audio/audio',
				imageUrl: '/static/imgs/tabbar/audio-active.png'
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
.audio-player {
	background-color: #ffffff;
	border-radius: 40rpx;
	padding: 60rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
	margin-bottom: 40rpx;
}
.audio-info {
	margin-bottom: 60rpx;
}
.title-container {
	text-align: center;
	margin-bottom: 16rpx;
}
.title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8px;
}
.subtitle {
	font-size: 32rpx;
	color: #666;
	display: block;
}
.wave-animation {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8rpx;
	height: 80rpx;
	margin: 40rpx 0;
}
.wave-bar {
	width: 8rpx;
	height: 40rpx;
	background-color: #3cc51f;
	border-radius: 4rpx;
	transition: height 0.3s ease;
}
.wave-animation.is-playing .wave-bar {
	animation: wave 1s ease-in-out infinite;
}
.wave-animation.is-playing .wave-bar:nth-child(2) {
	animation-delay: 0.2s;
}
.wave-animation.is-playing .wave-bar:nth-child(3) {
	animation-delay: 0.4s;
}
.wave-animation.is-playing .wave-bar:nth-child(4) {
	animation-delay: 0.6s;
}
.wave-animation.is-playing .wave-bar:nth-child(5) {
	animation-delay: 0.8s;
}
@keyframes wave {
	0%, 100% { height: 40rpx; }
	50% { height: 80rpx; }
}
.progress-container {
	display: flex;
	align-items: center;
	gap: 20rpx;
	margin: 40rpx 0;
}
.progress-bar {
	flex: 1;
}
.time {
	font-size: 28rpx;
	color: #666;
	min-width: 90rpx;
}
.controls {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 60rpx;
	margin-top: 60rpx;
}
.control-btn {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #f5f5f5;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}
.control-btn.main {
	width: 140rpx;
	height: 140rpx;
	border-radius: 70rpx;
	background-color: #3cc51f;
}

/* 图标样式 */
.icon {
	display: flex;
	justify-content: center;
	align-items: center;
}
.play-icon {
	width: 0;
	height: 0;
	border-style: solid;
	border-width: 24rpx 0 24rpx 40rpx;
	border-color: transparent transparent transparent #ffffff;
	margin-left: 8rpx;
}
.pause-icon {
	width: 48rpx;
	height: 48rpx;
}
.pause-bars {
	display: flex;
	gap: 16rpx;
}
.pause-bar {
	width: 12rpx;
	height: 48rpx;
	background-color: #ffffff;
	border-radius: 6rpx;
}
.stop-icon {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.stop-square {
	width: 32rpx;
	height: 32rpx;
	background-color: #666;
	border-radius: 4rpx;
}

/* 说明文字样式 */
.info-section {
	background-color: #ffffff;
	border-radius: 40rpx;
	padding: 60rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
	margin-bottom: 50rpx;
}
.info-item {
	margin-bottom: 25px;
}
.question {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10px;
}
.answer {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	display: block;
}
.notice-section {
	margin-top: 60rpx;
	padding-top: 40rpx;
	border-top: 2rpx solid #eee;
}
.notice-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 15px;
}
.notice-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}
.notice-item {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

/* 新增功能样式 */
.section {
	background-color: #ffffff;
	border-radius: 40rpx;
	padding: 40rpx;
	margin-bottom: 40rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}
.section-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 15px;
	padding-left: 20rpx;
	border-left: 8rpx solid #3cc51f;
}
.tips-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}
.tip-item {
	display: flex;
	align-items: flex-start;
	gap: 20rpx;
}
.tip-number {
	width: 40rpx;
	height: 40rpx;
	background-color: #3cc51f;
	color: #ffffff;
	border-radius: 20rpx;
	font-size: 24rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
}
.tip-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}
.symptom-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	margin-bottom: 15px;
}
.symptom-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
}
.symptom-text {
	font-size: 28rpx;
	color: #333;
}
.result-box {
	background-color: #f8f8f8;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-top: 15px;
}
.result-text {
	font-size: 28rpx;
	color: #333;
	display: block;
	margin-bottom: 8px;
}
.result-suggestion {
	font-size: 28rpx;
	color: #3cc51f;
	display: block;
}
.emergency-steps {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}
.step-item {
	display: flex;
	gap: 20rpx;
}
.step-number {
	width: 40rpx;
	height: 40rpx;
	background-color: #3cc51f;
	color: #ffffff;
	border-radius: 20rpx;
	font-size: 24rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
}
.step-content {
	flex: 1;
}
.step-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 5px;
}
.step-desc {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}
.advice-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}
.advice-item {
	background-color: #f8f8f8;
	padding: 30rpx;
	border-radius: 20rpx;
}
.advice-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8px;
}
.advice-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}
</style> 
<template>
	<view class="container">
		<view class="input-card">
			<view class="gender-select">
				<view class="gender-option" :class="{ active: gender === 'male' }" @click="selectGender('male')">
					<text class="gender-icon">👨</text>
					<text class="gender-text">男性</text>
				</view>
				<view class="gender-option" :class="{ active: gender === 'female' }" @click="selectGender('female')">
					<text class="gender-icon">👩</text>
					<text class="gender-text">女性</text>
				</view>
			</view>
			
			<view class="input-group">
				<text class="input-label">身高 (cm)</text>
				<input type="number" v-model="height" class="input-field" placeholder="请输入身高" />
			</view>
			
			<view class="input-group">
				<text class="input-label">体重 (kg)</text>
				<input type="number" v-model="weight" class="input-field" placeholder="请输入体重" />
			</view>
			
			<view class="input-group">
				<text class="input-label">是否经常运动</text>
				<switch :checked="isActive" @change="toggleActive" color="#007AFF" />
			</view>
			
			<button class="calculate-btn" @click="calculateBMI">计算BMI</button>
		</view>
		
		<view class="result-card" v-if="showResult">
			<view class="result-title">计算结果</view>
			<view class="result-content">
				<view class="bmi-value">
					<text class="value">{{bmiValue}}</text>
					<text class="unit">kg/m²</text>
				</view>
				<view class="bmi-level" :style="{ color: getBMIColor(bmiValue) }">
					{{getBMILevel(bmiValue)}}
				</view>
				<view class="bmi-suggestion">
					<text class="suggestion-title">健康建议：</text>
					<text class="suggestion-content">{{getBMISuggestion(bmiValue)}}</text>
				</view>
			</view>
		</view>
		
		<view class="info-card">
			<view class="info-title">BMI说明</view>
			<view class="info-content">
				<text class="info-text">BMI（身体质量指数）是衡量人体胖瘦程度的标准，计算公式为：体重(kg) / 身高(m)²</text>
				<view class="bmi-ranges">
					<view class="range-item" v-for="(item, index) in getBMIRanges" :key="index">
						<view class="range-dot" :style="{ backgroundColor: item.color }"></view>
						<text class="range-text">{{item.range}}</text>
						<text class="range-desc">{{item.desc}}</text>
					</view>
				</view>
				<view class="special-notes">
					<text class="note-title">注意事项：</text>
					<text class="note-item">1. 运动员或经常锻炼的人，由于肌肉含量较高，BMI可能偏高</text>
					<text class="note-item">2. 老年人BMI标准可能略高</text>
					<text class="note-item">3. 不同人种BMI标准可能略有差异</text>
					<text class="note-item">4. BMI仅供参考，具体健康状况请咨询医生</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gender: 'male',
				height: '',
				weight: '',
				isActive: false,
				showResult: false,
				bmiValue: 0,
				bmiRanges: [
					{ range: '偏瘦', desc: 'BMI < 18.5', color: '#007AFF' },
					{ range: '正常', desc: '18.5 ≤ BMI < 24', color: '#3cc51f' },
					{ range: '超重', desc: '24 ≤ BMI < 28', color: '#ff9900' },
					{ range: '肥胖', desc: 'BMI ≥ 28', color: '#ff0000' }
				]
			}
		},
		methods: {
			selectGender(gender) {
				this.gender = gender;
			},
			toggleActive(e) {
				this.isActive = e.detail.value;
			},
			calculateBMI() {
				if (!this.height || !this.weight) {
					uni.showToast({
						title: '请输入身高和体重',
						icon: 'none'
					});
					return;
				}
				
				const height = parseFloat(this.height) / 100; // 转换为米
				const weight = parseFloat(this.weight);
				
				if (height <= 0 || weight <= 0) {
					uni.showToast({
						title: '请输入有效的身高和体重',
						icon: 'none'
					});
					return;
				}
				
				this.bmiValue = (weight / (height * height)).toFixed(1);
				this.showResult = true;
			},
			getBMILevel(value) {
				value = parseFloat(value);
				if (this.gender === 'male') {
					if (value < 18.5) return '偏瘦';
					if (value < 24) return '正常';
					if (value < 28) return '超重';
					return '肥胖';
				} else {
					if (value < 18.5) return '偏瘦';
					if (value < 23) return '正常';
					if (value < 27) return '超重';
					return '肥胖';
				}
			},
			getBMIColor(value) {
				value = parseFloat(value);
				if (this.gender === 'male') {
					if (value < 18.5) return '#007AFF';
					if (value < 24) return '#3cc51f';
					if (value < 28) return '#ff9900';
					return '#ff0000';
				} else {
					if (value < 18.5) return '#007AFF';
					if (value < 23) return '#3cc51f';
					if (value < 27) return '#ff9900';
					return '#ff0000';
				}
			},
			getBMISuggestion(value) {
				value = parseFloat(value);
				if (this.gender === 'male') {
					if (this.isActive) {
						if (value < 18.5) {
							return '您的BMI偏低，但考虑到您经常运动，肌肉含量可能较高，建议适当增加营养摄入，保持运动习惯。';
						} else if (value < 24) {
							return '您的BMI在正常范围内，且经常运动，建议继续保持良好的运动习惯和饮食习惯。';
						} else if (value < 28) {
							return '您的BMI略高，但考虑到您经常运动，建议适当控制饮食，保持运动习惯，注意运动强度。';
						} else {
							return '您的BMI偏高，建议在专业指导下进行减重，注意运动强度和方式，避免关节损伤。';
						}
					} else {
						if (value < 18.5) {
							return '您的BMI偏低，建议适当增加营养摄入，可以考虑开始适当的运动。';
						} else if (value < 24) {
							return '您的BMI在正常范围内，建议保持健康的生活方式，可以适当增加运动。';
						} else if (value < 28) {
							return '您的BMI略高，建议控制饮食，增加运动量，保持健康的生活方式。';
						} else {
							return '您的BMI偏高，建议在专业指导下进行减重，注意饮食控制和运动。';
						}
					}
				} else {
					if (this.isActive) {
						if (value < 18.5) {
							return '您的BMI偏低，但考虑到您经常运动，肌肉含量可能较高，建议适当增加营养摄入，保持运动习惯。注意女性BMI标准略低于男性。';
						} else if (value < 23) {
							return '您的BMI在正常范围内，且经常运动，建议继续保持良好的运动习惯和饮食习惯。';
						} else if (value < 27) {
							return '您的BMI略高，但考虑到您经常运动，建议适当控制饮食，保持运动习惯，注意运动强度。';
						} else {
							return '您的BMI偏高，建议在专业指导下进行减重，注意运动强度和方式，避免关节损伤。';
						}
					} else {
						if (value < 18.5) {
							return '您的BMI偏低，建议适当增加营养摄入，可以考虑开始适当的运动。注意女性BMI标准略低于男性。';
						} else if (value < 23) {
							return '您的BMI在正常范围内，建议保持健康的生活方式，可以适当增加运动。';
						} else if (value < 27) {
							return '您的BMI略高，建议控制饮食，增加运动量，保持健康的生活方式。';
						} else {
							return '您的BMI偏高，建议在专业指导下进行减重，注意饮食控制和运动。';
						}
					}
				}
			}
		},
		computed: {
			getBMIRanges() {
				if (this.gender === 'male') {
					return [
						{ range: '偏瘦', desc: 'BMI < 18.5', color: '#007AFF' },
						{ range: '正常', desc: '18.5 ≤ BMI < 24', color: '#3cc51f' },
						{ range: '超重', desc: '24 ≤ BMI < 28', color: '#ff9900' },
						{ range: '肥胖', desc: 'BMI ≥ 28', color: '#ff0000' }
					];
				} else {
					return [
						{ range: '偏瘦', desc: 'BMI < 18.5', color: '#007AFF' },
						{ range: '正常', desc: '18.5 ≤ BMI < 23', color: '#3cc51f' },
						{ range: '超重', desc: '23 ≤ BMI < 27', color: '#ff9900' },
						{ range: '肥胖', desc: 'BMI ≥ 27', color: '#ff0000' }
					];
				}
			}
		},
		onShareAppMessage() {
			return {
				title: 'BMI值计算器 - 科学管理您的体重',
				path: '/pages/bmi/bmi',
			}
		}
	}
</script>

<style>
.container {
	padding: 20px;
	background-color: #f5f5f5;
	min-height: 100vh;
}
.input-card {
	background-color: #ffffff;
	border-radius: 20px;
	padding: 20px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	margin-bottom: 20px;
}
.gender-select {
	display: flex;
	justify-content: space-around;
	margin-bottom: 20px;
}
.gender-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 15px 30px;
	border-radius: 15px;
	background-color: #f5f5f5;
}
.gender-option.active {
	background-color: #007AFF;
}
.gender-option.active .gender-text {
	color: #ffffff;
}
.gender-icon {
	font-size: 24px;
	margin-bottom: 5px;
}
.gender-text {
	font-size: 14px;
	color: #333;
}
.input-group {
	margin-bottom: 20px;
}
.input-label {
	font-size: 14px;
	color: #666;
	margin-bottom: 8px;
	display: block;
}
.input-field {
	width: 100%;
	height: 40px;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 0 15px;
	font-size: 16px;
}
.calculate-btn {
	background-color: #007AFF;
	color: #ffffff;
	border-radius: 25px;
	font-size: 16px;
	padding: 12px 0;
	margin-top: 10px;
}
.result-card {
	background-color: #ffffff;
	border-radius: 20px;
	padding: 20px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	margin-bottom: 20px;
}
.result-title {
	font-size: 18px;
	font-weight: bold;
	color: #333;
	margin-bottom: 15px;
	padding-left: 10px;
	border-left: 4px solid #007AFF;
}
.result-content {
	text-align: center;
}
.bmi-value {
	margin-bottom: 15px;
}
.value {
	font-size: 36px;
	font-weight: bold;
	color: #333;
}
.unit {
	font-size: 16px;
	color: #666;
	margin-left: 5px;
}
.bmi-level {
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 15px;
}
.bmi-suggestion {
	text-align: left;
	padding-top: 15px;
	border-top: 1px solid #f0f0f0;
}
.suggestion-title {
	font-size: 14px;
	color: #666;
	display: block;
	margin-bottom: 8px;
}
.suggestion-content {
	font-size: 14px;
	color: #333;
	line-height: 1.6;
}
.info-card {
	background-color: #ffffff;
	border-radius: 20px;
	padding: 20px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.info-title {
	font-size: 18px;
	font-weight: bold;
	color: #333;
	margin-bottom: 15px;
	padding-left: 10px;
	border-left: 4px solid #007AFF;
}
.info-content {
	display: flex;
	flex-direction: column;
	gap: 15px;
}
.info-text {
	font-size: 14px;
	color: #666;
	line-height: 1.6;
}
.bmi-ranges {
	display: flex;
	flex-direction: column;
	gap: 12px;
}
.range-item {
	display: flex;
	align-items: center;
	gap: 10px;
}
.range-dot {
	width: 12px;
	height: 12px;
	border-radius: 6px;
}
.range-text {
	font-size: 14px;
	color: #333;
	font-weight: bold;
	min-width: 50px;
}
.range-desc {
	font-size: 14px;
	color: #666;
}
.special-notes {
	margin-top: 15px;
	padding-top: 15px;
	border-top: 1px solid #f0f0f0;
}
.note-title {
	font-size: 14px;
	color: #666;
	display: block;
	margin-bottom: 10px;
}
.note-item {
	font-size: 14px;
	color: #666;
	line-height: 1.6;
	display: block;
	margin-bottom: 5px;
}
</style> 
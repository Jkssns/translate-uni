<template>
	<view class="container">
		<view class="qr-section">
			<view class="qr-preview">
				<canvas type="2d" id="qrcode" class="qrcode-canvas"></canvas>
				<image v-if="qrCodePath" :src="qrCodePath" mode="aspectFit" class="qrcode-image"></image>
			</view>
			
			<view class="input-section">
				<input type="text" v-model="qrContent" placeholder="请输入要生成二维码的内容" class="content-input" />
			</view>
			
			<view class="logo-section">
				<view class="logo-title">添加Logo</view>
				<view class="logo-upload" @click="chooseLogo">
					<image v-if="logoPath" :src="logoPath" mode="aspectFit" class="logo-preview"></image>
					<view v-else class="upload-placeholder">
						<text class="upload-icon">+</text>
						<text>点击添加Logo</text>
					</view>
				</view>
			</view>
			
			<view class="action-buttons">
				<button class="action-btn generate" @click="generateQRCode">生成二维码</button>
				<button class="action-btn download" @click="downloadQRCode">下载二维码</button>
				<button class="action-btn share" open-type="share">分享二维码</button>
			</view>
		</view>
	</view>
</template>

<script>
	import QRCode from 'qrcode'
	
	export default {
		data() {
			return {
				qrContent: '',
				logoPath: '',
				qrCodePath: ''
			}
		},
		onLoad() {
			// 页面加载时初始化
		},
		methods: {
			async generateQRCode() {
				if (!this.qrContent) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					})
					return
				}
				
				try {
					const options = {
						width: 400,
						margin: 1,
						color: {
							dark: '#000000',
							light: '#ffffff'
						},
						errorCorrectionLevel: 'H'
					}
					
					// 获取canvas上下文
					const query = uni.createSelectorQuery()
					const canvas = await new Promise(resolve => {
						query.select('#qrcode')
							.fields({ node: true, size: true })
							.exec((res) => {
								const canvas = res[0].node
								const ctx = canvas.getContext('2d')
								canvas.width = options.width
								canvas.height = options.width
								resolve(canvas)
							})
					})
					
					// 生成二维码
					await QRCode.toCanvas(canvas, this.qrContent, options)
					
					// 如果有Logo，添加Logo
					if (this.logoPath) {
						const logo = await new Promise((resolve, reject) => {
							uni.getImageInfo({
								src: this.logoPath,
								success: resolve,
								fail: reject
							})
						})
						
						const logoSize = canvas.width * 0.3
						const logoX = (canvas.width - logoSize) / 2
						const logoY = (canvas.height - logoSize) / 2
						
						const logoImg = canvas.createImage()
						await new Promise((resolve, reject) => {
							logoImg.onload = resolve
							logoImg.onerror = reject
							logoImg.src = logo.path
						})
						
						canvas.getContext('2d').drawImage(logoImg, logoX, logoY, logoSize, logoSize)
					}
					
					// 保存二维码图片路径
					this.qrCodePath = await new Promise(resolve => {
						uni.canvasToTempFilePath({
							canvas,
							success: res => resolve(res.tempFilePath),
							fail: () => resolve('')
						})
					})
					
					uni.showToast({
						title: '生成成功',
						icon: 'success'
					})
				} catch (error) {
					console.error(error)
					uni.showToast({
						title: '生成失败',
						icon: 'none'
					})
				}
			},
			
			async chooseLogo() {
				try {
					const [error, res] = await uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						sourceType: ['album', 'camera']
					})
					
					if (error) {
						throw error
					}
					
					if (res && res.tempFilePaths && res.tempFilePaths.length > 0) {
						this.logoPath = res.tempFilePaths[0]
						if (this.qrCodePath) {
							this.generateQRCode()
						}
					}
				} catch (error) {
					console.error('选择图片失败', error)
					uni.showToast({
						title: '选择图片失败',
						icon: 'none'
					})
				}
			},
			
			async downloadQRCode() {
				if (!this.qrCodePath) {
					uni.showToast({
						title: '请先生成二维码',
						icon: 'none'
					})
					return
				}
				
				try {
					await uni.saveImageToPhotosAlbum({
						filePath: this.qrCodePath
					})
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					})
				} catch (error) {
					console.error(error)
					uni.showToast({
						title: '保存失败',
						icon: 'none'
					})
				}
			}
		},
		onShareAppMessage() {
			return {
				title: '快来生成你的专属二维码',
				path: '/pages/qrcode/qrcode',
				imageUrl: this.qrCodePath || ''
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

.qr-section {
	background-color: #ffffff;
	border-radius: 40rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.qr-preview {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 40rpx;
	width: 400rpx;
	height: 400rpx;
	margin: 0 auto 40rpx;
	position: relative;
}

.qrcode-canvas {
	width: 400rpx;
	height: 400rpx;
	position: absolute;
	left: -9999rpx;
}

.qrcode-image {
	width: 100%;
	height: 100%;
}

.input-section {
	margin-bottom: 40rpx;
}

.content-input {
	width: 100%;
	height: 80rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 16rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
}

.logo-section {
	margin-bottom: 40rpx;
}

.logo-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.logo-upload {
	width: 200rpx;
	height: 200rpx;
	border: 4rpx dashed #e0e0e0;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.logo-preview {
	width: 100%;
	height: 100%;
}

.upload-placeholder {
	text-align: center;
	color: #999;
}

.upload-icon {
	font-size: 48rpx;
	margin-bottom: 10rpx;
}

.action-buttons {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.action-btn {
	height: 88rpx;
	border-radius: 44rpx;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.generate {
	background-color: #3cc51f;
	color: #ffffff;
	border: 2rpx solid #3cc51f;
}

.download {
	background-color: #ffffff;
	color: #3cc51f;
	border: 1px solid #3cc51f;
}

.share {
	background-color: #007AFF;
	color: #ffffff;
}
</style> 
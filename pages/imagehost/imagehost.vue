<template>
	<view class="container">
		<view class="upload-section">
			<button class="upload-btn" @click="chooseImage" :disabled="imageList.length >= maxUploadCount">
				<text class="upload-icon">+</text>
				<text>上传图片</text>
			</button>
			<text class="upload-tip">最多上传{{ maxUploadCount }}张图片，单张图片不超过{{ maxFileSize / 1024 / 1024 }}MB</text>
		</view>
		
		<view class="content-section">
			<view class="image-list">
				<view class="image-item" v-for="(item, index) in imageList" :key="index">
					<image :src="item.url" mode="aspectFit" class="preview-image" @click="previewImage(index)"></image>
					<view class="image-actions">
						<button class="action-btn copy" @click="copyUrl(item.url)">复制外链</button>
						<button class="action-btn delete" @click="deleteImage(index, item._id)">删除</button>
					</view>
				</view>
			</view>
			<view class="footer-tip">
				<text>图片存储服务部署在国外，有问题请微信联系：Ted-Mosdy</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageList: [],
				maxFileSize: 25 * 1024 * 1024, // 25MB
				maxUploadCount: 5,
				key: 'chv_S0SCJ_25d71803f56507efb5123c3b279fd9d643a1bff8ea1e4d4019ab4884aed52a7111ad40b0c7cff4f6eef537e01e5d7aaed1733571abdf93769a94e047487649d7'
			}
		},
		onLoad() {
			// 页面加载时获取已上传的图片
			this.getUploadedImages();
		},
		methods: {
			// 获取已上传的图片
			async getUploadedImages() {
				uni.showLoading({
					title: '加载中...'
				});
				
				try {
					const db = uniCloud.database();
					// 从数据库获取最新的3张图片
					const updatedData = await db.collection('image_files')
					.orderBy('uploadTime', 'desc')
					.limit(this.maxUploadCount)
					.get();
					
					this.imageList = updatedData.result.data;
				} catch (err) {
					console.error('获取图片列表失败:', err);
					uni.showToast({
						title: '获取图片列表失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},
			
			chooseImage() {
				if (this.imageList.length >= this.maxUploadCount) {
					uni.showToast({
						title: `最多只能上传${this.maxUploadCount}张图片`,
						icon: 'none'
					});
					return;
				}
				
				uni.chooseImage({
					count: 1,
					success: (res) => {
						// 检查文件大小
						uni.getFileInfo({
							filePath: res.tempFilePaths[0],
							success: (fileInfo) => {
								if (fileInfo.size > this.maxFileSize) {
									uni.showToast({
										title: `图片大小不能超过${this.maxFileSize / 1024 / 1024}MB`,
										icon: 'none'
									});
									return;
								}
								this.uploadImage(res.tempFilePaths[0]);
							},
							fail: () => {
								uni.showToast({
									title: '获取文件信息失败',
									icon: 'none'
								});
							}
						});
					}
				});
			},
			
			async uploadImage(filePath) {
				uni.showLoading({
					title: '上传中...'
				});
				
				try {
					// 上传到Chevereto图床
					const [err, uploadRes] = await uni.uploadFile({
						url: 'https://www.picgo.net/api/1/upload',
						filePath: filePath,
						name: 'source',
						header: {
							'X-API-Key': this.key,
							'Content-Type': 'multipart/form-data',
						},
					});
					
					if (err) {
						throw new Error('上传失败');
					}
					
					// 检查响应状态
					if (uploadRes.statusCode !== 200) {
						throw new Error('上传失败');
					}
					
					// 解析响应数据
					let result;
					try {
						result = JSON.parse(uploadRes.data);
					} catch (e) {
						console.error('解析响应数据失败:', e);
						throw new Error('解析响应数据失败');
					}
					
					if (result.status_code === 200) {
						// 保存到数据库
						const db = uniCloud.database();
						const { id } = await db.collection('image_files').add({
							url: result.image.url,
							delete_url: result.image.delete_url,
						});
						
						// 更新图片列表
						this.imageList.unshift({
							_id: id,
							url: result.image.url,
							delete_url: result.image.delete_url,
						});
						
						uni.showToast({
							title: '上传成功',
							icon: 'success'
						});
					} else {
						if (result.status_code === 400 && result.error.code === 101) {
							uni.showToast({
								title: '图片已存在',
								icon: 'none'
							});
						} else {
							throw new Error(result.status_txt || '上传失败');
						}
					}
				} catch (err) {
					console.error('上传失败:', err);
					uni.showToast({
						title: err.message || '上传失败，请检查网络',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},
			
			previewImage(index) {
				const urls = this.imageList.map(item => item.url);
				uni.previewImage({
					urls: urls,
					current: index,
					indicator: 'number',
					loop: true
				});
			},
			
			copyUrl(url) {
				uni.setClipboardData({
					data: url,
					success: () => {
						uni.showToast({
							title: '链接已复制',
							icon: 'success'
						});
					}
				});
			},
			
			async deleteImage(index, id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张图片吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								// 获取要删除的图片信息
								const imageToDelete = this.imageList[index];
								
								// 从图床删除图片
								if (imageToDelete.delete_url) {
									try {
										uni.showLoading({
											title: '删除中...'
										});
										await uni.request({
											url: imageToDelete.delete_url,
											method: 'GET'
										});
										uni.hideLoading();
									} catch {
										uni.hideLoading();
									}

								}
								
								// 从数据库中删除记录
								const db = uniCloud.database();
								await db.collection('image_files')
									.where({
										_id: id
									})
									.remove();
								
								// 从界面中移除
								this.imageList.splice(index, 1);
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
							} catch (err) {
								console.error('删除文件失败:', err);
								uni.showToast({
									title: err.message || '删除失败',
									icon: 'none'
								});
							}
						}
					}
				});
			}
		},
		onShareAppMessage() {
			return {
				title: '图床工具 - 快速上传和分享图片',
				path: '/pages/imagehost/imagehost',
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
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
}
.upload-section {
	background-color: #ffffff;
	padding: 40rpx;
	border-radius: 20rpx;
	margin-bottom: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.upload-btn {
	width: 400rpx;
	height: 400rpx;
	background-color: #f0f0f0;
	border: 4rpx dashed #cccccc;
	border-radius: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.upload-btn[disabled] {
	opacity: 0.5;
}
.upload-icon {
	font-size: 80rpx;
	color: #999999;
	margin-bottom: 20rpx;
}
.upload-tip {
	font-size: 28rpx;
	color: #999999;
	margin-top: 20rpx;
}
.content-section {
	flex: 1;
	display: flex;
	flex-direction: column;
}
.image-list {
	display: flex;
	flex-direction: column;
	gap: 40rpx;
}
.image-item {
	background-color: #ffffff;
	padding: 30rpx;
	border-radius: 20rpx;
}
.preview-image {
	width: 100%;
	height: 400rpx;
	margin-bottom: 30rpx;
	border-radius: 10rpx;
	cursor: pointer;
}
.image-actions {
	display: flex;
	gap: 20rpx;
}
.action-btn {
	flex: 1;
	font-size: 28rpx;
	padding: 16rpx 0;
}
.copy {
	background-color: #3cc51f;
	color: #ffffff;
}
.delete {
	background-color: #ff4d4f;
	color: #ffffff;
}
.footer-tip {
	text-align: center;
	padding: 40rpx;
	color: #999;
	font-size: 28rpx;
	margin-top: auto;
}
</style> 
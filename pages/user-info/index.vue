<template>
	<uni-index
		header-bg="https://tsp-pub.oss-cn-beijing.aliyuncs.com/wechat/user/user_header.png"
		bg-color="#F5F4F4"
	>
		<uni-header title="个人信息" class="header" background="transparent"></uni-header>
		<view class="user_detail_avatar" >
			<div class="user_avatar_wrapper" @click="open('avatar')">
				<image class="user_avatar" :src="userInfo.avatar || defSrc" mode="widthFix"></image>
				<div class="user_avatar_edit">
					<image class="user_detail_camera" src="/static/imgs/user/camera_white.svg" mode="heightFix" ></image>
				</div>
			</div>
			<div class="user_avatar_blur"></div>
		</view>

		<view class="user_detail_info">
			<view class="user_detail_item" @click="routerTo('userName')">
				<image class="label_icon" src="/static/imgs/user/user-icon.svg" mode=""></image>
				<text class="label_name">用户名</text>
				<text  class="label_title">{{userInfo.name}}</text>
				<image class="label_icon_arrow" src="/static/imgs/common/back-right.svg" mode=""></image>
			</view>
			<view class="user_detail_item" @click="open('gender')">
				<image class="label_icon" src="/static/imgs/user/sex-icon.svg" mode=""></image>
				<text class="label_name">性别</text>
				<text class="label_title">{{userInfo.gender ? userInfo.gender === 1 ? '男' : '女' : ''}}</text>
				<image class="label_icon_arrow" src="/static/imgs/common/back-right.svg" mode=""></image>
			</view>
			<view class="user_detail_item" @click="open('birthday')">
				<image class="label_icon" src="/static/imgs/user/birthday-icon.svg" mode=""></image>
				<text class="label_name">出生日期</text>
				<text class="label_title">{{userInfo.birthday || ''}}</text>
				<image class="label_icon_arrow" src="/static/imgs/common/back-right.svg" mode=""></image>
			</view>   
			<view class="user_detail_item" @click="routerTo('oldPhone')">
				<image class="label_icon" src="/static/imgs/user/relation-icon.svg" mode=""></image>
				<text class="label_name">自我介绍</text>
				<text class="label_title"></text>
				<image class="label_icon_arrow" src="/static/imgs/common/back-right.svg" mode=""></image>
				<div class="label_textarea">
					{{userInfo.introduce}}
				</div>
			</view>
			<!-- <view class="user_detail_item" @click="routerTo(userInfo.email ? 'unBindEmail' : 'bindEmail')">
				<image class="label_icon" src="/static/imgs/user/email-icon.svg" mode="widthFix"></image>
				<text class="label_name">邮箱</text>
				<text class="label_title">{{userInfo.email || ''}}</text>
				<image class="label_icon_arrow" src="/static/imgs/common/back-right.svg" mode="widthFix"></image>
			</view> -->
		</view>
		<!-- 编辑性别 -->
		<edit-sex ref="gender" :sex="userInfo.gender" @change="onSexChange"></edit-sex>
		<!-- 编辑生日 -->
		<uni-date-picker ref="birthday" :datestring="userInfo.birthday" @change="onBirthdayChange"></uni-date-picker>
		<!-- 编辑头像 -->
		<edit-avatar ref="avatar" @avatarUrl="getAvatarUrl" fromType="userEdit"></edit-avatar>
	</uni-index>
</template>

<script>
	import editSex from './components/edit-sex.vue'
	import editAvatar from './components/edit-avatar.vue'

	export default {
		components: { 
			editSex,
			editAvatar
		},
		data() {
			return {
				userInfo:{
					name: '',
					gender: 0,
					birthday: '',
					phone: '',
					email: '',
					avatar: ''
				}
			}
		},
	
		onShow() {
			this.getUserInfo()
		},

		methods: {
			/* 跳转编辑信息页面 */
			routerTo(flag) {
                this.$store.commit('setUserData', this.userInfo);
				uni.navigateTo({ url: `/pages-user/user-edit?type=${flag}&from=userEdit` })
			},

			/* 打开弹框 */
			open(flag) {
				this.$refs[flag].open()
			},
			// 编辑性别
			onSexChange(gender) {
				const data = {
					id: this.userInfo.id,
					gender: gender,
				}
                this.userInfo.gender = gender
				this.setUser(data)
				this.$refs.gender.close()
			},
			// 编辑生日
			onBirthdayChange(birthday) {
				const data = {
					id: this.userInfo.id,
					birthday: new Date(birthday).getTime(),
				}
                this.userInfo.birthday = birthday
				this.setUser(data)
				this.$refs.birthday.close()
			},
			// 获取上传或拍着的图片信息
			getAvatarUrl(avatar){
				const data = {
					id: this.userInfo.id,
					avatar: avatar,
				}
                this.userInfo.avatar = avatar
				this.setUser(data)
				this.$refs.avatar.close()
			},

			/* 更新用户信息 */
			setUser(data) {
				this.$server.updateUserInfo(data).then(res => {
					if(res.code ===200){
                        this.$store.commit('setUserData', this.userInfo);
					}
				})
			},
			// // 查询用户信息
			getUserInfo(){
				this.$server.getUserInfo().then(res => {
					Object.assign(this.userInfo, res.data)
					res.data.birthday && (this.userInfo.birthday = this.$utils.formatTime('YYYY-MM-DD', +res.data.birthday))
					this.$store.commit('setUserData', res.data)
				})
			},
		},
	}
</script>

<style lang="less" scoped>
.user_detail{
	width: 100%;
	height: 100%;
	background: #fff;
	.header {
		/deep/ .top_bar {
			margin-bottom: 0;
		}
	}
}

.avatar_mask {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	width: 100%;
	height: 470rpx;
	background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0));
}
.avatar_bg {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	width: 100%;
	height: 470rpx;
	background-repeat: no-repeat;
	background-size: 100%;
	background-position: 50% 50%;
	filter: blur(50px);
	opacity: 0.2;
}
.user_detail_info {
	// width: 100%;
	margin: 0 16rpx 60rpx;
	padding: 0 60rpx;
	box-sizing: border-box;
	position: relative;
	z-index: 99;
	background: #fff;
	background: #FFFFFF;
	box-shadow: 0rpx 4rpx 20rpx rgba(0, 0, 0, 0.05);
	border-radius: 24rpx;
	overflow-y: auto;
}
.user_detail_avatar {
	position: relative;
	margin: 26rpx auto 50rpx;
	.user_avatar_wrapper {
		position: relative;
		z-index: 1;
		width: 200rpx;
		height: 200rpx;
		border-radius: 68rpx;
		overflow: hidden;
		.user_avatar {
			width: 200rpx;
			height: 200rpx;
		}
		.user_avatar_edit {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.4);
			.user_detail_camera {
				width: 50rpx;
				height: 50rpx;
			}
		}
	}
	.user_avatar_blur {
		position: absolute;
		z-index: 0;
		top: 110rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 160rpx;
		height: 160rpx;
		background: #D1AA00;
		filter: blur(40rpx);
		border-radius: 20rpx;
	}
}

.user_detail_item {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	width: 100%;
	min-height: 160rpx;
	overflow: visible;
	line-height: 160rpx;
	border-bottom: 1px solid #E7E7E7;
	&:last-child {
		height: auto;
		padding-bottom: 30rpx;
		border-bottom: none;
	}
	.label_textarea {
		width: 100%;
		line-height: normal;
		word-break: break-all;
	}
}
.label_icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 30rpx;
}
.label_icon_arrow {
	width: 14rpx;
	height: 24rpx;
	margin-left: 30rpx;
}
.label_name {
	display: inline-block;
	width: 140rpx;
	font-family:'JRound400';
	font-size: var(--font-34);
	color: var(--font-color-one);
}
.label_title {
	display: inline-block;
	width: calc(100% - 255rpx);
    line-height: 1;
	text-align: right;
	font-family:'JRound400';
	font-size: var(--font-32);
	color: var(--font-color-two);
}
</style>

<template>
	<div class="diary_container">
		 <zzx-calendar 
			showBack
			:dotList="dotList"
			@days-change="daysChange"
			@selected-change="selectChange"
		></zzx-calendar>

		<template v-if="edited">
			<template v-if="diffDate()">
				<p class="diary_wrapper">
					{{currentDayDiary.diary}}
				</p>
				<div class="edit_user_wrapper">
					<span class="user_name">{{currentDayDiary.createdUser || ''}}</span>
					<div class="user_avatar_box">
						<image class="user_avatar" v-if="currentDayDiary.createdUserAvatar" :src="currentDayDiary.createdUserAvatar" mode="heightFix" />
					</div>
				</div>
			</template>
			
			<div v-else>
				123
			</div>
		</template>


		<template v-else>
			<textarea  class="diary_textarea" v-model="currentDayDiary.diary" maxlength="-1" :placeholder="$t('common.请输入日记')"></textarea>
			<uni-confirm-button @click="addDiray">{{$t('diary.写好了')}}</uni-confirm-button>
		</template>
	</div>
</template>

<script>
	export default {
		data() {
			const date = new Date()
			return {
				description: '群日记',
				dotList: [], // 有日期的标记
				currentDayDiary: {
					diary: '',
				}, // 当天的日记
				currentMonth: '', // 本月
				monthList: [], // 已经请求过数据的月份列表
				edited: false, // 是否编辑过
				today: this.formatDate(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()), // 今天
				currentDay: '', // 选择的当前天
			}
		},

		onReady() {
			this.selectChange({fullDate: this.today})
		},

		onShow(){
			uni.hideHomeButton && uni.hideHomeButton(); 
		},
		
		onShareAppMessage(res) {
			const imageUrl = this.currentDayDiary.diary ? '/static/imgs/diary/nice.jpeg' : '/static/imgs/diary/beg.jpeg'
			let currentDiary = this.currentDayDiary.diary || '快来写日记啦！'
			if (currentDiary.length > 20) {
				currentDiary = currentDiary.slice(0, 20) + '...'
			}
			return {
			  title: currentDiary,
			  imageUrl,
			  path: '/pages/login/index'
			}
		},

		methods: {
			diffDate() {
				console.log(new Date() <= new Date(this.currentDay), '123123')
				return new Date() >= new Date(this.currentDay)
			},
			
			selectChange(e) {
				uni.s()
				this.currentDay = e.fullDate
				const db = uniCloud.database();
				console.log(e.fullDate, 'e.fullDate')
				db.collection('diary').where({
					date: e.fullDate
				}).get({one: true}).then(res => {
					uni.h()
					const data = res.result.data[0]
					if (data) {
						this.currentDayDiary = data
						this.edited = true
					} else {
						this.currentDayDiary = {}
						this.edited = false
					}
				})
			},

			daysChange(e) {
				const month = new Date(e.start).getMonth() + 1
				const year = new Date(e.start).getFullYear()
				const yearMonth = year + '-' + month
				if (this.monthList.includes(yearMonth)) {
					const monthEnd = new Date(e.end).getMonth() + 1
					const yearEnd = new Date(e.end).getFullYear()
					if (!this.monthList.includes(yearEnd + '-' + monthEnd)) {
						this.daysChange({ start: e.end })
					}
					return;
				} else {
					this.monthList.push(yearMonth)
				}
				
				const monthDays = new Date(year, month, 0).getDate()
				const monthStart = new Date(yearMonth + '-1').getTime()
				const monthEnd = monthStart + (monthDays * 86400000) + 86399999

				uni.s()
				this.currentMonth = month
				const db = uniCloud.database();
				const dbCmd = db.command
				db.collection('diary').where({
					timeStamp: dbCmd.gte(monthStart).and(dbCmd.lte(monthEnd))
				}).get().then(res => {
					uni.h()
					this.dotList.push(...res.result.data)
				}).finally(() => {
					uni.h()
				})
			},

			async addDiray() {
				const userInfo = uni.getStorageSync(this.$const.USER_INFO)
				const db = uniCloud.database();

				if (new Date(this.currentDay) > new Date()) {
					uni.showToast({
						icon: 'none',
						title: this.$t('diary.你未卜先知？')
					})
					db.collection('action').add({
						timeStamp: Date.now(),
						createdUser: userInfo.nickName,
						createdUserAvatar: userInfo.avatarUrl,
						createdUserOpenid: userInfo.openid,
					}).then()
					return;
				}
					
				if (!this.currentDayDiary.diary) {
					uni.showToast({
						icon: 'none',
						title: Math.random() > 0.5 ? '今天吃了什么呢？' : '今天喝了什么呢？'
					})
					return
				}

				uni.s()
				const data = {
					date: this.currentDay,
					timeStamp: Date.now(),
					diary: this.currentDayDiary.diary,
					createdUser: userInfo.nickName,
					createdUserAvatar: userInfo.avatarUrl,
					createdUserOpenid: userInfo.openid,
				}
				const { result } = await db.collection('diary').add(data).finally(() => {
					uni.h()
				})
				if (result.code === 0) {
					this.edited = true
					this.currentDayDiary = data
					this.dotList.push(data)
				}
			},

			formatDate(dateStr) {
				return dateStr.split('/').map(item2 => item2 >= 10 ? item2 : '0' + item2).join('-')
			}
		}
	}
</script>

<style lang="scss" scoped>
.diary_container {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	padding-bottom: 30rpx;
	box-sizing: border-box;
	.diary_textarea {
		flex: 1;
		width: 700rpx;
		height: auto;
		margin: 40rpx auto 50rpx;
		padding: 10rpx;
		line-height: normal;
		border: 1px solid $uni-border-color;
		border-radius: 16rpx;
	}
	.diary_wrapper {
		width: 100%;
		text-align: left;
		margin: 40rpx auto 50rpx;
		padding: 10rpx 20rpx;
		line-height: normal;
		box-sizing: border-box;
		white-space: pre-wrap;
		word-break: break-all;
	}
	.edit_user_wrapper {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		height: 70rpx;
		padding: 0 20rpx 50rpx;
		.user_name {
			line-height: 70rpx;
		}
		.user_avatar {
			height: 80rpx;
		}
		.user_avatar_box {
			display: flex;
			align-content: center;
			justify-content: center;
			width: 80rpx;
			height: 80rpx;
			margin-left: 20rpx;
			border: 1px solid $uni-border-color;
			border-radius: 50%;
			overflow: hidden;
		}
	}
}
</style>
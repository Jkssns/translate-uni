<template>
	<div class="diary_container">
		 <zzx-calendar 
			showBack
			:dotList="dotList"
			@days-change="daysChange"
			@select-change="selectChange"
		></zzx-calendar>

		<textarea class="diary_textarea" v-model="content" maxlength="-1" :placeholder="$t('common.请输入日记')"></textarea>

		<button class="Bottom_Btn" @tap="addDiray">编撰完成</button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				description: '群日记',
				dotList: [{date:  '2022-07-22'}],
				month: new Date().getMonth() + 1,
				content: '',
				todayEdited: false, // 今天是否编辑过
				currentMonth: '', // 本月
			}
		},

		created() {
			this.getThreeMonthsDate()
		},
		
		computed: {
			
		},

		methods: {
			getThreeMonthsDate() {
				const data = {
					start:  ''
				}
				// this.$server.getDate().then(res => {

				// })
			},
			
			selectChange(e) {
				// this.currentMonth = e
			},

			daysChange(e) {
				const start = new Date(e.start).getTime()
				const end = new Date(e.end).getTime()
				const month = new Date(e.start).getMonth() + 1
				console.log("start, end::: ", start, end);
				if (month !== this.currentMonth) {
					this.currentMonth = month
					const db = uniCloud.database();
					const dbCmd = db.command
					db.collection('diary').where({
						timeStamp: dbCmd.gt(start).and(dbCmd.lt(end))
					}).get().then(res => {
						res.result.data.forEach(item => {
							item.date = item.date.split('/').map(item2 => item2 >= 10 ? item2 : '0' + item2).join('-')
						})
						this.dotList.push(...res.result.data)
						console.log("this.dotList::: ", this.dotList);
					})
				}
			},

			async addDiray() {
				const db = uniCloud.database();
				const today = new Date().toLocaleDateString().split('/').map(item2 => item2 >= 10 ? item2 : '0' + item2).join('-')
				const data = {
					date: today,
					timeStamp: Date.now() ,
					content: this.content,
					createdUser: '123'
				}
				const { result } = await db.collection('diary').add(data)
				if (result.code === 0) {
					this.dotList.push(data)
				}
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
		margin: 60rpx auto 50rpx;
		padding: 10rpx;
		border: 1px solid $uni-border-color;
		border-radius: 16rpx;
	}
}
</style>
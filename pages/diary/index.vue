<template>
	<div>
		 <zzx-calendar 
			showBack
			:dotList="dotList"
			@days-change="daysChange"
		></zzx-calendar>

		<textarea v-model="content"></textarea>


		<button @tap="addDiray">编撰完成</button>
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
			}
		},

		created() {
			this.getThreeMonthsDate()
		},

		methods: {
			getThreeMonthsDate() {
				const data = {
					start:  ''
				}
				// this.$server.getDate().then(res => {

				// })
			},

			daysChange(e) {
				let month = e.start.getMonth() + 1
			},

			async addDiray() {
				const db = uniCloud.database();
				const today = new Date().toLocaleDateString()
				const data = {
					date: today,
					timeStamp: new Date(today).getTime(),
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

<style>
</style>
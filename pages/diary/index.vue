<template>
	<div>
		 <zzx-calendar 
			showBack
			:dotList="dotList"
			@days-change="daysChange"
		></zzx-calendar>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				description: '群日记',
				dotList: [{date:  '2022-07-22'}],
				preMonth: new Date().getMonth() + 1
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
				
				const start = e.start.getMonth() + 1
				const end = e.end.getMonth() + 1
				console.log("start, end::: ", start, end);
				if (this.preMonth )
				

				this.preMonth
			}
		}
	}
</script>

<style>
</style>
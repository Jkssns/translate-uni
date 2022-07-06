<template>
	<div>
		<input type="text">
		<button @click="add">add</button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				description: '人员列表'
			}
		},
		methods: {
			async add() {
				const humens = uniCloud.importObject('humens')
				const res = await humens.add('asdf', 'content demo')
				console.log(res, 'res')
			}
		}
	}
</script>

<style scoped lang="scss">
	
</style>
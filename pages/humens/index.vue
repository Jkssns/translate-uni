<template>
	<div>
		<unicloud-db v-slot:default="{data, loading, error, options}" collection="humens_list">
			<view v-if="error">{{error.message}}</view>
			<view v-else>
				<li v-for="item in data" :key="item._id">{{item.name}}</li>
			</view>
		</unicloud-db>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	
</style>
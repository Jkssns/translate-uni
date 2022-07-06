<template>
	<div>
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" collection="humens_list">
			<view v-if="error">{{error.message}}</view>
			<view v-else>
				<ul>
					<li v-for="(item, index) in data" :key="item._id">{{index + 1}}{{item.name}}
					<span @click="remove(item)">删除</span>
					</li>
				</ul>
			</view>
		</unicloud-db>
		<button @click="add">add</button>
		<button @click="update">update</button>
		<button @click="get">get</button>
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

			get(){
				this.$refs.udb.refresh()
			},
			add() {
				const db = uniCloud.database();
				db.collection('humens_list').add({name: '1', introduce: '123123'}).then(res => {
					console.log(res, 'res')
					this.$refs.udb.refresh()
				})
			},
			
			update() {
				const db = uniCloud.database();
				const dbCmd = db.command
				db.collection('humens_list').where({
					_id: '62c5ab29257bc8000186cb43'
				}).update({
					name: 'asdfa'
				}).then(res => {
					this.$refs.udb.refresh()
				})
			},
			
			remove(item) {
				const db = uniCloud.database();
				const dbCmd = db.command
				db.collection('humens_list').doc(item._id).remove().then(res => {
					this.get()
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	
</style>
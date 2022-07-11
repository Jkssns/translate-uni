<template>
	<div class="humens_list_container">
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" collection="humens_list">
			<view v-if="error">{{error.message}}</view>
			<view v-else>
				<scroll-view scroll-y="true" class="humens_list_wrapper">
					<ul class="humens_list">
						<li class="humen_item" v-for="(item, index) in data" :key="item._id">
							<image class="humen_item_avatar" src="https://jkssns.oss-cn-hangzhou.aliyuncs.com/images/user.jpeg" />
							<div class="humen_basic_info">
								<span class="humen_name">{{item.name}}</span>
								<image v-if="item.sex" class="humen_item_sexIcon" :src="`https://jkssns.oss-cn-hangzhou.aliyuncs.com/images/${item.sex === 1 ? 'boy' : 'girl'}.svg`" />
								<image class="humen_item_sexIcon" :src="`https://jkssns.oss-cn-hangzhou.aliyuncs.com/images/${item.sex === 1 ? 'boy' : 'girl'}_icon.svg`" />
								<p class="humens_native_place">{{item.nativePlace || '河南'}}</p>
							</div>
							<!-- <span class="humen_more">更多></span> -->
							<!-- <span > -->
							<svg class="humen_more" t="1657540309118" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4179" width="200" height="200"><path d="M544.907636 684.544a46.545455 46.545455 0 0 1-65.815272 0l-279.272728-279.272727a46.545455 46.545455 0 1 1 65.815273-65.815273L512 585.821091 758.365091 339.456a46.545455 46.545455 0 1 1 65.815273 65.815273l-279.272728 279.272727z" p-id="4180" fill="currentColor" ></path></svg>
							<!-- </span> -->
							<p class="humen_introduce">{{item.introduce}}</p>
						</li>
					</ul>
				</scroll-view>
			</view>
		</unicloud-db>
		<!-- <button @click="add">add</button>
		<button @click="update">update</button>
		<button @click="get">get</button> -->
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
.humens_list_container {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
	.humens_list_wrapper {
		.humens_list {
			.humen_item {
				position: relative;
				width: 690rpx;
				display: flex;
				flex-wrap: wrap;
				padding: 12rpx;
				margin: 12rpx auto 0;
				background: rgba(255, 255, 255, 0.9);
				box-shadow: 0rpx 30rpx 40rpx rgba(151, 151, 151, 0.16);
				border-radius: 12rpx;
				box-sizing: border-box;
				overflow: hidden;
				&.humen_item:nth-of-type(1) {
					margin-top: 0rpx;
				}
				.humen_item_avatar {
					width: 120rpx;
					height: 120rpx;
					border-radius: 15rpx;
				}
				.humen_basic_info {
					flex: 1;
					display: flex;
					flex-wrap: wrap;
					margin-left: 20rpx;
					.humen_name {
						font-size: 22rpx;
						line-height: 1.5715;
					}
					.humen_item_sexIcon {
						width: 34rpx;
						height: 34rpx;
						margin-left: 20rpx;
					}
					.humens_native_place {
						display: block;
						width: 100%;
					}
				}
				.humen_more {
					position: absolute;
					right: 30rpx;
					top: 100rpx;
					width: 50rpx;
					height: 50rpx;
					color: $uni-color-primary;
				}
				.humen_introduce {
					margin: 20rpx 10rpx;
					width: 100%;
				}
			}
		}
	}
}

</style>
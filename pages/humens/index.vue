<template>
	<div class="humens_list_container">
		<!-- <button @click="expendAll">{{expendAllItem ? $t('humens.收起所有自我介绍') : $t('humens.展开所有自我介绍')}}</button> -->
		<!-- <button @click="remove">remove</button> -->
		<button @click="add">add</button>
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" collection="humens_list" :page-size="10" @load="onDataLoad">
			<view v-if="error">{{error.message}}</view>
			<view v-else>
				<scroll-view scroll-y="true" class="humens_list_wrapper">
					<ul class="humens_list">
						<li 
							class="humen_item" 
							:class="{open: item.open}" 
							:style="{'--height': item.introductionHeight + 'px'}" 
							v-for="(item, index) in data" 
							:key="item._id"
							@tap="openMore(item)"
						>
							<span class="humen_item_edit" @tap.stop="toEdit(item)">{{$t('common.编辑')}}</span>
							<image class="humen_item_avatar" src="https://jkssns.oss-cn-hangzhou.aliyuncs.com/images/user.jpeg" />
							<div class="humen_basic_info">
								<span class="humen_name">{{item.name}}</span>
								<image v-if="item.sex" class="humen_item_sexIcon" :src="`/static/imgs/humens/${item.sex == 1 ? 'boy' : 'girl'}_icon.svg`" />
								<p class="humens_native_place">{{item.nativePlace}}</p>
							</div>
							<svg class="humen_more" :class="{open: item.open}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4179" width="200" height="200"><path d="M544.907636 684.544a46.545455 46.545455 0 0 1-65.815272 0l-279.272728-279.272727a46.545455 46.545455 0 1 1 65.815273-65.815273L512 585.821091 758.365091 339.456a46.545455 46.545455 0 1 1 65.815273 65.815273l-279.272728 279.272727z" p-id="4180" fill="#b7b8b3" ></path></svg>
							<p class="humen_introduction" :class="{open: item.open}">{{item.introduction}}</p>
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
	import humens from './humens.js'
	export default {
		data() {
			return {
				description: '人员列表',
				expendAllItem: false, // 打开全部自我介绍
			}
		},
		onPullDownRefresh() {
			this.$refs.udb.loadData({
				clear: true
			}, () => {
				// 停止下拉刷新
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() { //滚动到底翻页
			this.$refs.udb.loadMore()
		},
		methods: {
			onDataLoad() {
				this.$nextTick(() => {
					const query = uni.createSelectorQuery().in(this);
					query.selectAll('.humen_introduction').boundingClientRect(data => {
						if (data[0]) {
							this.$refs.udb.dataList = this.$refs.udb.dataList.map((item, index) => {
								return {
									...item,
									open: this.expendAllItem,
									introductionHeight: data[index].height
								}
							})
						}
					}).exec();
				})
			},
			
			get(){
				this.$refs.udb.refresh()
			},
			
			async add() {
				const db = uniCloud.database();
				for (let item of humens) {d
					delete item.id
					await db.collection('humens_list').add(item).then(res => {
						// console.log(res, 'res')
						// this.$refs.udb.refresh()
					})
				}
				
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
			
			remove(itemw) {
				const db = uniCloud.database();
				const dbCmd = db.command
				this.$refs.udb.dataList.forEach(item => {
					db.collection('humens_list').doc(item._id).remove().then(res => {
						// this.get()
					})
				})
			},
			
			/* 去编辑页面 */
			toEdit(item) {
				console.log(item, 'item');
			},
			
			/* 打开/关闭全部自我介绍 */
			expendAll() {
				this.expendAllItem = !this.expendAllItem
				this.$refs.udb.dataList.forEach(item => {
					item.open = this.expendAllItem
				})
			},

			/* 打开 */
			openMore(item) {
				item.open = !item.open
			}
		}
	}
</script>

<style scoped lang="scss">
.humens_list_container {
	width: 100%;
	height: 100%;
	.humens_list_wrapper {
		background: #f6f6f6;
		padding-bottom: 100rpx;
		box-sizing: border-box;
		.humens_list {
			.humen_item {
				position: relative;
				width: 690rpx;
				height: 160rpx;
				display: flex;
				align-content: flex-start;
				flex-wrap: wrap;
				padding: 20rpx 20rpx 0;
				margin: 30rpx auto 0;
				background: rgba(255, 255, 255, 0.9);
				box-shadow: 0rpx 30rpx 40rpx rgba(151, 151, 151, 0.16);
				border-radius: 12rpx;
				box-sizing: border-box;
				overflow: hidden;
				transition: all 0.3s;
				&.open {
					height: calc(190rpx + var(--height));
				}
				&.humen_item:nth-of-type(1) {
					margin-top: 0rpx;
				}
				.humen_item_edit {
					position: absolute;
					top: 10rpx;
					right: 30rpx;
					color: $uni-color-primary;
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
					top: 90rpx;
					width: 50rpx;
					height: 50rpx;
					color: $uni-color-primary;
					transform: rotate(-90deg);
					transition: all .3s;
					&.open {
						transform: rotate(0deg);
					}
				}
				.humen_introduction {
					display: inline-block;
					margin: 30rpx 10rpx 0;
					width: 100%;
					height: auto;
					word-break: break-all;
				}
			}
		}
	}
}

</style>
<template>
	<uni-popup ref="popup" type="bottom" :maskClick="false">
		<div class="sex_container pt40">
			<view class="sex_container_item" v-for="item in sexList" :key="item.value" @click="chooseItem(item.value)">
				{{item.name}}
			</view>
			<p class="cancel_text JRound500" @click="close">取消</p>
		</div>
	</uni-popup>
</template>

<script>
	export default {
		props: { 
			sex: {
				type: Number,
				default: 0,
			}
		},
		data() {    
			return {
				sexList: [
					{
						value: 1,
						name: '男',
					},
					{
						value: 2,
						name: '女',
					},
				],
				value: 0,
			}
		},

		methods: {
			open() {
				this.$refs.popup.open()
				this.value = this.sex
			},

			close() {
				this.$refs.popup.close()
			},

			chooseItem(value) {
				this.value = value
				this.$emit('change', value)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.sex_container {
		border-radius: 66rpx 66rpx 0 0;
		height: 450rpx;
		background: #fff;
		display: block;
		overflow: hidden;
		font-size: var(--font-36);
		padding-top: 32rpx;
		box-sizing: border-box;
		.sex_container_item {
			height: 104rpx;
			line-height: 104rpx;
			font-family: "JRound400";
			font-size: var(--font-36);
			text-align: center;
			color: var(--font-color-one);
			border-bottom: 2rpx solid #F4F4F4;
		}

		.cancel_text {
			position: absolute;
			bottom: 80rpx;
			width: 100%;
			text-align: center;
			height: 144rpx;
			line-height: 144rpx;
			font-family: "JRound500";
			text-align: center;
			color: var(--font-color-three);
		}
	}
	
</style>
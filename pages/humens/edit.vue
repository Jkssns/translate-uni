<template>
	<div class="humen_edit_wrapper">
		<label class="form_item">
			<span class="form_item_title">{{$t('humens.名字')}}：</span>
			<div class="form_item_value">
				<input type="text" :placeholder="$t('humens.请输入名字')" v-model="form.name" >
			</div>
		</label>
		<label class="form_item">
			<span class="form_item_title">{{$t('humens.性别')}}：</span>
			<div class="form_item_value">
				<radio-group v-model="form.sex">
					<label><radio value="1" />{{$t('humens.男')}}</label>
					<label style="margin-left: 20rpx;"><radio value="2" />{{$t('humens.女')}}</label>
				</radio-group>
			</div>
		</label>
		<label class="form_item">
			<span class="form_item_title">{{$t('humens.自我介绍')}}：</span>
			<div class="form_item_value">
				<textarea class="form_item_textarea" :placeholder="$t('humens.请简洁地写个500字')" maxlength="-1" rows="10" auto-height v-model="form.introduction"></textarea>
			</div>
		</label>
		<label class="form_item">
			<span class="form_item_title">{{$t('humens.我的缺点')}}：</span>
			<div class="form_item_value">
				<textarea class="form_item_textarea" :placeholder="$t('humens.写多一点，让泰德有依据地攻击你')" maxlength="-1" rows="10" auto-height v-model="form.defect"></textarea>
			</div>
		</label>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				description: '人员添加编辑',
				isEdit: false,
				form: {
					name: '',
					sex: '',
					introduction: '',
					defect: '',
				}
			}
		},

		onLoad(options) {
			this.isEdit = options.isEdit === true
		},
		
		onShow() {
			
		},

		created() {
			
		},

		computed: {
				
		},

		methods: {
				
		}

	}
</script>


<style lang="scss" scoped>
	.humen_edit_wrapper {
		display: inline-block;
		width: 100%;
		height: 100%;
		padding: 0 50rpx;
		box-sizing: border-box;
		.form_item {
			width: 100%;
			display: flex;
			margin-top: 40rpx;
			min-height: 80rpx;
			border-bottom: 1px solid #efefef;
			// &:nth-last-of-type(1) {
			// 	border-bottom: none; 
			// }
			.form_item_title {
				display: inline-block;
				white-space: nowrap;
			}
			.form_item_value {
				width: 100%;
				textarea {
					width: 100%;
				}
			}
		}
	}
</style>
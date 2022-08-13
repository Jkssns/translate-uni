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
				<radio-group v-model="form.sex" @change="onSexChange">
					<label><radio :value="1" :checked="form.sex === 1" />{{$t('humens.男')}}</label>
					<label style="margin-left: 20rpx;"><radio :value="2" :checked="form.sex === 2" />{{$t('humens.女')}}</label>
				</radio-group>
			</div>
		</label>
		<label class="form_item">
			<span class="form_item_title">{{$t('humens.自我介绍')}}：</span>
			<div class="form_item_value">
				<textarea class="form_item_textarea" :placeholder="$t('humens.请简洁地写个500字')" maxlength="-1" rows="10" :auto-height="form.introduction ? true : false" v-model="form.introduction"></textarea>
			</div>
		</label>
		<label class="form_item">
			<span class="form_item_title">{{$t('humens.我的缺点')}}：</span>
			<div class="form_item_value">
				<textarea class="form_item_textarea" :placeholder="$t('humens.写多一点，让泰德有依据地攻击你')" maxlength="-1" rows="10" :auto-height="form.defect ? true : false" v-model="form.defect"></textarea>
			</div>
		</label>

		<button @tap="onDone">{{$t('common.完成')}}</button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				description: '人员添加编辑',
				isEdit: false,
				_id: "62d68cb468cebc0001b84754",
				form: {
					name: '',
					sex: '',
					introduction: '',
					defect: '',
				}
			}
		},

		onLoad(options) {
			if (options._id) {
				this._id = options._id
				this.getHumenDetail()
				this.isEdit = true
			} else {
				this.isEdit = false
			}
		},
		
		onShow() {
			
		},

		created() {
			
		},

		computed: {
				
		},

		methods: {
			async getHumenDetail(_id) {
				const db = uniCloud.database();
				const { result } = await db.collection('humens_list').doc(
					this._id
				).get({ getOne: true, })
				
				if (result && result.data) {
					this.form = result.data
				}
			},

			onSexChange(e) {
				this.form.sex = parseInt(e.detail.value)
			},

			update() {
				const db = uniCloud.database();
				const data = {
					...this.form,
				}
				delete data._id
				console.log("data::: ", data);
				db.collection('humens_list').where({
					_id: this._id
				}).update(data).then(res => {
					console.log("res::: ", res);
				})
			},

			onDone() {
				this.update()
			},
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
			&:nth-last-of-type(1) {
				.form_item_textarea {
					height:100rpx;
				}
			}
			&:nth-last-of-type(2) {
				.form_item_textarea {
					height: 50rpx;
				}
			}
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
<template>
  <div>
	<button @click="file.a++">click</button>
    <!-- 历史记录页面 -->
	<view :file="file" :change:file="test.update" class="echarts__item" ></view>
  </div>
</template>

<script>
  export default {
    name: 'history',
	data() {
		return {
			file: {a: 1}
		}
	},

    created() {
        
    },

    computed: {
        
    },

    methods: {
        // video
		setBase64(base64) {
			base64ToPath(base64).then(filePath => {
				console.log(filePath, 'filepath')
			})
		}
    }

  }
</script>

<script lang="renderjs" module="test">
	export default {
		mounted() {
			console.log(this.file)
		},
		watch: {
			file: {
				deep: true,
				handler() {
					console.log(this.file, 'watch')
				}
			}
		},
		methods: {
			getBase64(file) {
				const reader = new FileReader()
				reader.readAsDataURL(file[0])
				reader.onload = function (e) {
					console.log(e.target.result, 'base64')
					this.$ownerInstance.callMethod('setBase64', e.target.result);
				}
			},
			update(e, e1, e2) {
				console.log(e, e1, e2, 'change')
				if (this.file) {
					this.getBase64(this.file)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>

  
</style>
<template>
	<div @click.prevent="onGlobalClick" :prop="themeObj" :change:prop="theme.onChange">
		<slot />
	</div>
</template>
	
<script>
	export default {
		name: 'uniGlobalPage',
		computed: {
			themeObj() {
				return this.$store.themeObj[this.$store.currentTheme]
			},
		},
		
		mounted() {
			console.log(this.$store)
		},
		
		// watch: {
		// 	'themeObj': {
		// 		deep: true,
		// 		handler(newV) {
		// 			console.log("newV::: ", newV); 
		// 		}
		// 	}
		// },
		
		methods: {
			onGlobalClick(e) {
				uni.$emit('global-click', e)
			},
		}
	}
</script>

<script module="theme" lang="renderjs">
	export default {
		methods: {
			onChange(newV, oldV) {
				console.log(newV, 123)
				this.changeThemeColor(newV)
			},
			changeThemeColor(obj) {
				console.log("obj::: ", obj);
				for (let i in obj) {
					document.body.style.setProperty('--' + i, obj[i]);
				}
			}
		}
	}
</script>

<style>
</style>
  
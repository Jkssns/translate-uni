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
				return this.$store.state.themeObj[this.$store.state.currentTheme]
			},
		},
		mounted() {
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
				this.changeThemeColor(newV)
			},
			changeThemeColor(obj) {
				for (let i in obj) {
					document.body.style.setProperty('--' + i, obj[i]);
				}
			}
		}
	}
</script>

<style>
</style>
  
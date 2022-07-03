<template>
	<div class="uni_index" :style="{backgroundColor: bgColor,}">
		<header 
			class="index_header" 
			v-if="headerBg"
			:style="{backgroundImage: `url(${headerBg})`}"
		></header>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		props: {
			bgColor: {
				type: String,
				default: 'none'
			},
			/* 头部图片类型 */
			headerBg: {
				type: String,
				default: ''
			},
		},
	}
</script>

<style lang="scss" scoped>
.uni_index {
	position: relative;
	z-index: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background-repeat: no-repeat;
	background-size: cover;
	overflow: hidden;
	.index_header {
		position: absolute;
		z-index: -1;
		width: 100%;
		height: 620rpx;
		background-repeat: no-repeat;
		background-size: cover;	
	}
}
</style>
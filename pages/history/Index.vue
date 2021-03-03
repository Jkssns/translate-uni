<template>
  <div>
    历史记录页面
	<div class="t__main__history">
		<span class="history__item" v-for="item in 40" :key="item">{{item + '' + Math.random() }}</span>
	</div>
  </div>
</template>

<script>
  export default {
    name: 'history',
    data() {
      return {
        description: '历史记录页面',
        
      }
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
			.t__main__history {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				margin-top: 70rpx;
				.history__item {
					display: inline-block;
					min-width: 0;
					width: 20%;
					height: auto;
					margin: 0 2%;
					margin-bottom: 50rpx;
					line-height: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
  
</style>
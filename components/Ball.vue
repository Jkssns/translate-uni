<template>
   <movable-area class="move__container">
		<movable-view 
			class="move__wrapper" 
			:out-of-bounds="true"
			:x="x" 
			:y="y" 
			:disabled="!hidden"
			:direction="direction" 
			@change="onChange"
		>
			<image v-if="showSide" class="img" src="../common/images/side.svg" @click="showBall"></image>
			<div v-else id="ball" class="floatBall__container" >
				<div class="floatBall__side"></div>
				<div class="floatBall__wrapper" @click="handleShow"></div>
				<ul class="floatBall__actions" :class="{hidden: hidden}">
					<li
						v-for="(item, index) in actions"
						:key="index"
						class="action ball"
						:class="{hide: hide}"
						:style="{ transform: `rotate(${30 * index}deg) translate(-50%, -50%)` }"
						@click="onClick(item)"
					>
						<div :style="{ transform: `rotate(${360 - 30 * index}deg)` }">
							{{ item.label }}
						</div>
					</li>
				</ul>
			</div>
		</movable-view>
	</movable-area>
</template>

<script>
export default {
	name: "Ball",
	data() {
		return {
			description: "悬浮球",

			actions: [
				{ label: "换肤", value: "theme", src: "", },
				{ label: "中文", value: "zh", src: "", },
				{ label: "骚话", value: "love", src: "", },
				{ label: "点赞", value: "like", src: "", },
				{ label: "仓库", value: "github", src: "", },
				{ label: "作者", value: "author", src: "", },
				{ label: "打赏", value: "pay", src: "", },
			],
			
			x: 0,
			y: getApp().globalData.info.windowHeight / 2,
			
			showSide: true,
            hidden: false,
            hide: false,
			canClick: true,
			isPc: this.$utils.isPc(),
		};
    },
	
	computed: {
		// 移动的方向 all、vertical
		direction() {
			return this.showSide ? "vertical" : "all"
		}
	},
	
	methods: {
		
		showBall() {
			this.showSide = false
		},

		handleShow() {
            if (!this.hidden) {
                this.hide = true
                setTimeout(() => {
                    this.hidden = true
				}, 450)
            } else {
                this.hide = false
                this.hidden = false
            }
		},
		
		onClick(e) {
			this.$emit('ball-click', e)
		},
		
		onChange(e) {
			if (e.detail.x < -4) {
				this.showSide = true
			}
		}
	},
};
</script>

<style lang="scss" scoped>
div,
ul,
li {
	margin: 0;
	padding: 0;
	list-style: none;
}

.move__container {
	position: absolute;
	z-index: 999;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	height: 100%;
	width: 100%;
}
.move__wrapper {
	width: 40px;
	height: 40px;
}
.img {
	position: absolute;
	width: 15px;
	height: 40px;
}

.ball {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.5);
	cursor: pointer;
	text-align: center;
	line-height: 40px;
	font-size: 10px;
	color: #fff;
}

.floatBall__container {
	width: 40px;
	height: 40px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
}
.floatBall__wrapper {
	position: absolute;
	z-index: 2;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 25px;
	height: 25px;
	border-radius: 50%;
	border: 1px solid #fff;
	box-sizing: border-box;
	cursor: pointer;
}
.floatBall__side {
	position: absolute;
	left: 0;
	border-radius: 50%;
}
.floatBall__actions {
	position: absolute;
	top: -75px;
	left: -75px;
	width: 200px;
	height: 200px;
	border-radius: 50%;
}
.floatBall__actions.hidden {
	width: 0;
	height: 0;
	opacity: 0;
	visibility: hidden;
}
.floatBall__actions > .action {
	position: absolute;
	left: 50%;
	top: 0;
	opacity: 1;
	transform-origin: 0 100px;
	transition: all 0.45s;
}
.action.hide {
	z-index: -1;
	opacity: 0;
	visibility: hidden;
	transform: rotate(0deg) translate(-50%, -50%)!important;
}
</style>

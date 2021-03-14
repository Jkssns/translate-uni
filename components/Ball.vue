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
			<image v-if="showSide" class="img" src="../common/images/side.svg" @click.stop="showBall"></image>
			<div v-else id="ball" class="floatBall__container">
				<div class="floatBall__side"></div>
				<div v-if="hide" class="floatBall__wrapper" @click.stop="handleShow"></div>
				<image v-else class="close__img" src="../common/images/close.svg"  @click.stop="handleShow"></image>
				<ul class="floatBall__actions" :class="{hidden: hidden}">
					<li
						v-for="(item, index) in actions"
						:key="index"
						class="action ball"
						:class="{hide: hide}"
						:style="{ transform: `rotate(${30 * index}deg) translate(-50%, -50%)` }"
						@click.stop="onClick(item, index)"
					>
						<div :style="{ transform: `rotate(${360 - 30 * index}deg)` }">
							{{ item.labels[item.activeIndex || 0] | filterText}}
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
				{ key: "theme",    src: "", labels: [{label: "墨绿", value: 'green'},{label: "深灰", value: 'grey'}, {label: "艳红", value: 'red'}, {label: "樱粉", value: 'pink'}], activeIndex: 0 },
				{ key: "language", src: "", labels: [{label: "中文", value: 'chinese'},{label: "Eng", value: 'english'},{label: "Fra", value: 'Fra'},{label: "Deu", value: 'Deu'}], activeIndex: 0 },
				{ key: "ad",       src: "", labels: ["广告","感谢"], activeIndex: 0 },
				{ key: "like",     src: "", labels: ["点赞","感谢"], activeIndex: 0 },
				{ key: "github",   src: "", labels: ["仓库"],},
				{ key: "author",   src: "", labels: ["作者"],},
				{ key: "pay",      src: "", labels: ["打赏","感谢"], activeIndex: 0 },
			],
			
			x: 0,
			y: getApp().globalData.info.windowHeight / 2,
			showSide: true,
            hidden: false,	// 控制动画时间
            hide: false,	// 控制显示隐藏 
			canClick: true,
		};
    },
	
	computed: {
		// 移动的方向 all、vertical
		direction() {
			return this.showSide ? "vertical" : "all"
		},
	},
	
	filters: {
		filterText(val) {
			if (typeof val === 'object') {
				return val.label
			} else {
				return val
			}
		}
	},
	
	mounted() {
		uni.$on('global-click', (e) => {
			if (!this.hide) {
				this.handleShow()
			}
		})
	},
	
	methods: {
		/* 显示悬浮球 */
		showBall() {
			this.showSide = false
		},
		
		/* 切换悬浮球显示隐藏 */
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
		
		/* 点击悬浮球 */
		onClick(item, index) {
			if (item.labels && item.labels.length && item.activeIndex !== undefined) {
				let len = item.labels.length - 1
				if (item.activeIndex >= len) {
					item.activeIndex = 0
				} else {
					item.activeIndex++
				}
			}
			this.$emit('ball-click', item, item.labels[item.activeIndex || 0])
			// this.handleShow() // 点击功能后隐藏悬浮球
		},
		
		/* 悬浮球贴边 */
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
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	height: 100%;
	width: 100%;
	pointer-events: none;
}
.move__wrapper {
	width: 40px;
	height: 40px;
	pointer-events: auto;
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
.close__img {
	@extend .floatBall__wrapper;
	border: none;
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

<template>
	<div class="floatBall__container">
		<div class="floatBall__side"></div>
		<div class="floatBall__wrapper" @click="handleShow"></div>
		<ul class="floatBall__actions" :class="{hidden: hidden}">
			<li
				v-for="(item, index) in actions"
				:key="index"
				class="action ball"
                :class="{hide: hide}"
				:style="{ transform: `rotate(${30 * index}deg) translate(-50%, -50%)` }"
			>
				<div :style="{ transform: `rotate(${360 - 30 * index}deg)` }">
					{{ item.text + index }}
				</div>
			</li>
		</ul>
	</div>
</template>

<script>

export default {
	name: "Ball",
	data() {
		return {
			description: "悬浮球",

			actions: [
				{ text: "换色" },
				{ text: "换色" },
				{ text: "换色" },
				{ text: "换色" },
				{ text: "换色" },
				{ text: "换色" },
				{ text: "换色" },
			],
			event: this.$utils.isPc()
				? {
						start: "mousedown",
						move: "mousemove",
						end: "mouseup",
				  }
				: {
						start: "touchstart",
						move: "touchmove",
						end: "touchend",
				  },

            hidden: false,
            hide: false,
			moving: false,
			canClick: true,
		};
    },
    
	computed: {},

	methods: {

		handleShow() {
            if (!this.hidden) {
                this.hide = true
                setTimeout(() =>  
                    this.hidden = true,
                450)
            } else {
                this.hide = false
                this.hidden = false
            }
		},

		move(e) {
			moving = true["on" + event.start];

			document.addEventListener([event.move], function (e) {
				if (!moving) return;

				if (moving) {
					if (isPc) {
						floatBallContainer.style.left = e.clientX - 20 + "px";
						floatBallContainer.style.top = e.clientY - 20 + "px";
					} else {
						floatBallContainer.style.left =
							e.changedTouches[0].clientX - 20 + "px";
						floatBallContainer.style.top =
							e.changedTouches[0].clientY - 20 + "px";
					}
					canClick = false;
				}
			});
			document.addEventListener([event.end], function (e) {
				moving = false;
				if (!isPc) canClick = true;
			});
		},
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
	position: absolute;
	top: 200px;
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

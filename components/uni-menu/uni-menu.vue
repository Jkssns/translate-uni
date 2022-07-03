<template>
    <div class="AMenu" :style="{position: showAdd ? 'relative' : 'static'}">
        <template v-if="showAdd">
            <image @click="open" class="file__image" :src="src" />
            <text @click="open">{{title}}</text>
        </template>

        <div class="menus" :class="{ani: isOpen}" v-show="isOpen" :style="{top: propsStyle.top, right: propsStyle.right, bottom: propsStyle.bottom }">
            <div
                class="menu__item"
                v-for="(item, index) in options"
                :key="item.label"
                @click="handleClick(item, index)"
                :class="{active: item.active}"
            >
                <image class="menu__item__img" :src="item.src" v-if="item.src" />
                <span class="menu__item__text">{{item.label}}</span>
            </div>
        </div>
        <div class="mask" v-if="isOpen" @click.prevent="isOpen=false"></div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            default: () => []
        },
        src: {
            type: String,
            default: ''
        },
        /* 是否显示添加按钮 */
        showAdd: {
            type: Boolean,
            default: true,
        },
        /* 父级传过来的位置信息 */
        propsStyle: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            isOpen: false,
            activeIndex: 0,
            title: ''
        }
    },

    mounted () {

    },

    watch: {
        isOpen () {
            const str = this.isOpen ? 'open' : 'close'
            this.$emit(str)
        }
    },

    methods: {
        open () {
            this.isOpen = !this.isOpen
        },
        handleClick (item, index) {
            this.isOpen = !this.isOpen
            this.activeIndex = index
            this.$emit('click', item)
        }
    }
}
</script>

<style scoped lang="scss">
.AMenu {
    display: inline-block;
    position: relative;

    .file__image {
        width: 44rpx;
        height: 44rpx;
        vertical-align: middle;
    }

    .menus {
        z-index: 10000;
        position: absolute;
        top: 65rpx;
        right: -20rpx;
        width: 298rpx;
        padding: 0 40rpx;
        background: #ffffff;
        box-shadow: 0px 24px 12px rgba(65, 65, 65, 0.1);
        border-radius: 36rpx;
        box-sizing: border-box;
        // TODO: 这里应该改成支持4个角，暂时先支持右边了
        &::after {
            position: absolute;
            top: 40%;
            right: 10rpx;
            display: inline-block;
            width: 36rpx;
            height: 36rpx;
            transform: rotate(45deg) translate(50%, -50%);
            background: #fff;
            content: '';
            border-radius: 4rpx;
        }

        .menu__item {
            display: flex;
            align-items: center;
            height: 110rpx;
            line-height: 110rpx;
            overflow: hidden;
            .menu__item__img {
                width: 50rpx;
                height: 50rpx;
                margin-right: 24rpx;
            }
            .menu__item__text {
                font-family: 'JRound500';
                font-size: var(--font-36);
                color: var(--font-color-one);
            }
        }
        .menu__item.active,
        .menu__item.active .menu__item__text {
            // color: #42A5F5;
            // color: var(--tabBarLineColor);
        }
    }
}
.mask {
    z-index: 9;
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: transparent;
}
.ani {
    animation: ani 0.1s;
}
@keyframes ani {
    0% {
        transform: scaleY(0);
    }
    100% {
        transform: scaleY(1);
    }
}
</style>

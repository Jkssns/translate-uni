<template>
    <view class="avatar_cont">
        <view :style="{'width':width,'height':height||width,'border': border +' solid ' + borderColor,'border-radius':radius}" class="cl_avatar">
            <image :src="src || defSrc"  :mode="mode"></image>
        </view>
        <view class="number" :style="'top: '+(parseInt(this.width)-20)+'rpx'"><text v-if="number" class="num fs28 black2">{{number}}</text></view>
    </view>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            default: () => ""
        },
        number: {
            type: String,
            default: () => ""
        },
        width: {
            type: String,
            default: () => "200rpx"
        },
        height: {
            type: String,
            default: () => ""
        },
        mode:{
            type: String,
            default: "scaleToFill" // 图片裁剪、缩放的模式
        },
        radius: {
            type: String,
            default: () => "200rpx"
        },
        border: {
            type: String,
            default: () => "0"
        },
        borderColor: {
            type: String,
            default: () => "#fff"
        }
    },
    data() {
        return {
            defSrc: require('static/images/common/avatar.png')
        }
    },
    mounted(){

    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.avatar_cont{
    position: relative;
    box-sizing: border-box;
    position: relative;
    z-index: 10;
    display: inline-block;
}
.cl_avatar {
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    z-index: 10;
    display: inline-block;
    image {
        width: 100%;
        height: 100%;
    }
}
.number{
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 15;
    line-height: 40rpx;
    .num{
        border-radius: 100rpx;
        display: inline-block;
        background: #fff;
        border: 2px solid #E8E8E8;
        width: 40rpx;
        height: 40rpx;
        overflow: hidden;
    }
}
</style>
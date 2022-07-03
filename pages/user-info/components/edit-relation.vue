<template>
    <uni-popup ref="popup" type="bottom">
        <div class="relationship_container">
            <div class="relationship_header">
                <view class="relationship_title JRound500">选择关系</view>
            </div>
            <div class="relationship_inner">
                <div class="relationship_item" @click="changeItem('father')">爸爸</div>
                <div class="relationship_item" @click="changeItem('mother')">妈妈</div>
                <div class="relationship_item" @click="changeItem('other')">其他</div>
            </div>
            <p class="cancel_text JRound500" @click="close">取消</p>
        </div>
    </uni-popup>
</template>

<script>
export default {
    name: 'editRelationship',
    data () {
        return {}
    },

    methods: {
        // 打开popup
        open () {
            this.$refs.popup.open()
        },
        // 关闭popup
        close () {
            this.$refs.popup.close()
        },
        // 选择item
        changeItem (value) {
            this.$emit('change', value)
        }
    },
}
</script>

<style lang="scss" scoped>
.relationship_container {
    width: 100%;
    border-radius: 66rpx 66rpx 0 0;
    // height: 591rpx;
    background: #fff;
    padding: 40rpx 0 108rpx 0;
    box-sizing: border-box;
    position: relative;
    .relationship_header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40rpx 0;
        .relationship_title {
            font-size: var(--font-36);
            line-height: 42rpx;
            color: var(--font-color-one);
            text-align: center;
        }
        .relationship_close {
            width: 40rpx;
            height: 40rpx;
        }
    }

    .relationship_inner {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .relationship_item {
            width: 100%;
            height: 104rpx;
            text-align: center;
            line-height: 104rpx;
            color: var(--font-color-one);
            font-size: var(--font-36);
            font-family: 'JRound400';
        }
    }

    .cancel_text {
        width: 100%;
        text-align: center;
        font-size: 36rpx;
        line-height: 42rpx;
        text-align: center;
        color: #626262;
        border-top: 2rpx solid #f8f8f8;
        padding-top: 40rpx;
        margin-top: 15rpx;
    }
}
</style>
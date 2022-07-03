<template>
    <uni-popup ref="popup" type="bottom">
        <div class="avatar_container pt40">
            <view
                class="avatar_container_item"
                v-for="item in eventList"
                :key="item.name"
                @click="chooseItem(item)"
            >{{item.name}}</view>
            <p class="cancel_text JRound500" @click="close">取消</p>
        </div>
    </uni-popup>
</template>

<script>
export default {
    name: 'change-avatar',
    props: {
        fromType: {
            type: String,
            default: 'man'
        }
    },
    data () {
        return {
            eventList: [
                {
                    id: 1,
                    type: 'album',
                    name: '从相册选择',
                },
                {
                    id: 2,
                    type: 'default',
                    name: '默认头像',
                },
                {
                    id: 3,
                    type: 'camera',
                    name: '拍照',
                }
            ]
        }
    },

    methods: {
        // 开启弹窗
        open () {
            this.$refs.popup.open()
        },
        // 关闭弹窗
        close () {
            this.$refs.popup.close()
        },
        // 点击事件
        chooseItem (item) {
            if (item.type === 'album') {
                this.getLocalAlbum('album')
            }
            if (item.type === 'camera') {
                this.getLocalAlbum('camera')
            }
            if (item.type === 'default') {
                uni.navigateTo({
                    url: "/pages-user/edit-default-avatar?fromType=" + this.fromType
                })
            }
            this.close()
        },
        // 获取相册信息、摄像头功能
        getLocalAlbum (type) {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: [type],
                success: res => {
                    const tempFilePaths = res.tempFilePaths;
                    let avatarPath = tempFilePaths[0];
                    this.uploadImg(avatarPath)
                },
                fail: err => {
                    console.log(err, 'err')
                }
            })
        },
        // 图片上传到服务器
        uploadImg (avatarPath) {
            // let token = uni.getStorageSync("token")
            // wx.uploadFile({
            //     url: config.base_url + '/aliyun/upload',     // 后端api接口
            //     filePath: avatarPath, // chooseImage函数调用后获取的本地文件路劲
            //     name: "file", // 类型
            //     header: {
            //         'Authorization': token
            //     },
            //     success: (res) => {
            //         let data = JSON.parse(res.data) // 返回字符串类型，需要转换
            //         if (data.code === 200) {
            //             this.$emit('avatarUrl', data.data)
            //         }
            //     },
            //     fail: err => {
            //         console.log(err, 'err')
            //     }
            // });
        },
        // 点击默认头像
    },
}
</script>

<style lang="scss" scoped>
.avatar_container {
    border-radius: 66rpx 66rpx 0 0;
    background: #fff;
    display: block;
    overflow: hidden;
    font-size: var(--font-36);
    padding: 40rpx 80rpx 108rpx 80rpx;
    .avatar_container_item {
        font-family: 'JRound400';
        font-size: var(--font-36);
        text-align: center;
        color: var(--font-color-one);
        margin-bottom: 50rpx;
    }

    .cancel_text {
        // position: absolute;
        // bottom: 80rpx;
        width: 100%;
        text-align: center;
        line-height: 42rpx;
        font-family: 'JRound500';
        text-align: center;
        color: var(--font-color-three);
        border-top: 2rpx solid #f8f8f8;
        padding-top: 40rpx;
    }
}
</style>
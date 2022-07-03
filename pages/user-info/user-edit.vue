<template>
    <div class="user_edit">
        <uni-header :title="titles[type]"></uni-header>

        <main class="user_edit_main">
            <template v-if="type === 'userName'">
                <uni-easyinput class="input_field" placeholder="请输入" :placeholderStyle="placeholderStyle"
                    v-model="userData.userName.value"></uni-easyinput>
            </template>

            <template v-if="type === 'oldPhone'">
                <uni-easyinput class="input_field" placeholder="请输入原手机号" :placeholderStyle="placeholderStyle"
                    v-model="userData.oldPhone.value"></uni-easyinput>

                <uni-easyinput class="input_field" placeholder="请输入验证码" :placeholderStyle="placeholderStyle"
                    v-model="userData.oldPhoneCode.value">
                    <template #right>
                        <span class="code" @click="getCode('phoneCode')" v-if="countDown <= 0">获取验证码</span>
                        <span class="code" v-else>重新获取({{countDown}}s)</span>
                    </template>
                </uni-easyinput>
            </template>

            <template v-if="type === 'newPhone'">
                <uni-easyinput class="input_field" placeholder="请输入新手机号" :placeholderStyle="placeholderStyle"
                    v-model="userData.newPhone.value"></uni-easyinput>

                <uni-easyinput class="input_field" placeholder="请输入验证码" :placeholderStyle="placeholderStyle"
                    v-model="userData.newPhoneCode.value">
                    <template #right>
                        <span class="code" @click="getCode('phoneCode')" v-if="countDown <= 0">获取验证码</span>
                        <span class="code" v-else>重新获取({{countDown}}s)</span>
                    </template>
                </uni-easyinput>
            </template>

            <template v-if="type === 'bindEmail'">
                <uni-easyinput class="input_field" placeholder="请输入邮箱" :placeholderStyle="placeholderStyle"
                    v-model="userData.email.value"></uni-easyinput>
                <span v-if="sendOk" class="sendOk_text">已发送验证码至邮箱，请注意查收</span>

                <uni-easyinput class="input_field" placeholder="请输入验证码" :placeholderStyle="placeholderStyle"
                    v-model="userData.emailCode.value">
                    <template #right>
                        <span class="code" @click="getCode('emailCode')" v-if="countDown <= 0">获取验证码</span>
                        <span class="code" v-else>重新获取({{countDown}}s)</span>
                    </template>
                </uni-easyinput>
            </template>

            <template v-if="type === 'unBindEmail'">
                <p class="unbind_email_text JRound500">{{userData.email.value}}</p>
                <span v-if="sendOk" class="sendOk_text">已发送验证码至邮箱，请注意查收</span>

                <uni-easyinput class="input_field" placeholder="请输入验证码" :placeholderStyle="placeholderStyle"
                    v-model="userData.emailCode.value">
                    <template #right>
                        <span class="code" @click="getCode('emailCode')" v-if="countDown <= 0">获取验证码</span>
                        <span class="code" v-else>重新获取({{countDown}}s)</span>
                    </template>
                </uni-easyinput>
            </template>

            <footer style="margin-top:120rpx;">
                <button class="footer_btn JRound500" @click="nextStep" v-if="type === 'oldPhone'">下一步</button>
                <uni-button v-else @tap="confirm" title="确定"></uni-button>
            </footer>
        </main>
    </div>
</template>

<script>
    export default {
        name: 'edituser',
        data() {
            return {
                description: '修改用户信息',

                titles: {
                    userName: '用户名',
                    oldPhone: '手机号',
                    unBindEmail: '解绑邮箱',
                    bindEmail: '绑定邮箱'
                },
                type: 'userName',

                userData: {
                    userName: {
                        value: '',
                        reg: /^[\s\S]*.*[^\s][\s\S]*$/,
                        errMsg: '请输入正确的用户名'
                    },
                    oldPhone: {
                        value: '',
                        reg: /^[1][3-8]\d{9}$/,
                        errMsg: '请输入正确的手机号'
                    },
                    oldPhoneCode: {
                        value: '',
                        reg: /^[\s\S]*.*[^\s][\s\S]*$/,
                        errMsg: '请输入正确的验证码'
                    },
                    newPhone: {
                        value: '',
                        reg: /^[1][3-8]\d{9}$/,
                        errMsg: '请输入正确的手机号'
                    },
                    newPhoneCode: {
                        value: '',
                        reg: /^[\s\S]*.*[^\s][\s\S]*$/,
                        errMsg: '请输入正确的验证码'
                    },
                    email: {
                        value: '',
                        reg: /^\w+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/,
                        errMsg: '请输入正确的邮箱'
                    },
                    emailCode: {
                        value: '',
                        reg: /^[\s\S]*.*[^\s][\s\S]*$/,
                        errMsg: '请输入正确的验证码'
                    },
                },
                userStateData: {}, // 用户信息
                placeholderStyle: {
                    fontFamily: 'JRound400',
                    fontSize: '36rpx',
                    color: 'var(--af06)',
                },
                countDown: 0, // 倒计时
                timer: null, // 计时器
                sendOk: false, // 发送成功
                fromPage: ''
            }
        },
        onShow() {
            let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
            let options = routes[routes.length - 1].options; // 进来的路由
            this.fromPage = options.from
            this.type = options.type; // userName/用户名 oldPhone/更换手机号 unBindEmail/解绑手机号 bindEmail/绑定手机号

            if (this.fromPage === 'userEdit') { // 用户编辑进来的
                this.userStateData = this.$store.state.userData; // 接受 store 数据
                this.userData.id = this.userStateData.id;
                this.userData.userName.value = this.userStateData.name;
                this.userData.oldPhone.value = this.userStateData.phone;
                this.userData.email.value = this.userStateData.email;
            }
            if (this.fromPage === 'babyAdd') {
                this.titles.userName = '用户名'
                this.userStateData = this.$store.state.babyData
                this.userData.userName.value = this.userStateData.name;
            }
        },
        destroyed() {
            clearInterval(this.timer)
        },

        methods: {
            /* 验证错误 */
            returnErr(obj) {
                if (!obj.reg.test(obj.value)) {
                    uni.showToast({
                        title: obj.errMsg,
                        icon: 'none'
                    })
                    return 'err'
                }
            },

            /* 获取验证码 */
            getCode(flag) {
                this.sendOk = false
                let api = null,
                    params = null
                const {
                    oldPhone,
                    newPhone,
                    email
                } = this.userData

                if (flag === 'phoneCode') {
                    const phone = this.type === 'oldPhone' ? oldPhone : newPhone
                    if (this.type === 'oldPhone' && oldPhone.value !== this.userStateData.phone) {
                        uni.showToast({
                            title: '请输入正确的手机号',
                            icon: 'none'
                        })
                        return
                    }

                    if (this.returnErr(phone)) {
                        return
                    }

                    params = {
                        phone: phone.value
                    }
                    api = this.$server.getPhoneCode
                } else if (flag === 'emailCode') {
                    if (this.returnErr(email)) {
                        return
                    }

                    params = {
                        email: email.value,
                    }
                    api = this.$server.sendEmailCode
                }
                uni.showLoading({
                    title: 'Loading...'
                })
                api(params).then(res => {
                    flag === 'emailCode' && (this.sendOk = true)

                    this.countDown = 59
                    this.timer = setInterval(() => {
                        this.countDown--
                        if (this.countDown <= 0) {
                            this.countDown = 0
                            clearInterval(this.timer)
                        }
                    }, 1000)

                    uni.showToast({
                        title: '发送成功',
                        icon: 'none'
                    })
                }).finally(() => {
                    uni.hideLoading()
                })
            },

            /* 下一步 */
            nextStep() {
                const {
                    oldPhone,
                    oldPhoneCode
                } = this.userData

                if (oldPhone.value !== this.userStateData.phone) {
                    uni.showToast({
                        title: '请输入正确的手机号',
                        icon: 'none'
                    })
                    return
                } else {
                    if (this.returnErr(oldPhone) || this.returnErr(oldPhoneCode)) {
                        return
                    }
                    // 校验旧手机号验证码
                    let params = {
                        phone: oldPhone.value,
                        code: oldPhoneCode.value
                    }
                    this.$server.checkPhoneCode(params).then(res => {
                        if (res.data) {
                            this.countDown = 0
                            this.type = 'newPhone'
                            clearInterval(this.timer)
                        } else {
                            uni.showToast({
                                title: '校验原手机号失败',
                                icon: 'none'
                            })
                        }
                    })
                }
            },

            /* 确定修改 */
            confirm() {
                if (this.type === 'userName') {
                    if (this.returnErr(this.userData.userName)) {
                        return
                    }
                    this.editUserName()
                } else if (this.type === 'newPhone') {
                    if (this.returnErr(this.userData.newPhone) || this.returnErr(this.userData.newPhoneCode)) {
                        return
                    }
                    this.editUserPhone()
                } else if (this.type === 'bindEmail') {
                    if (this.returnErr(this.userData.email) || this.returnErr(this.userData.emailCode)) {
                        return
                    }
                    this.bindEmail()
                } else if (this.type === 'unBindEmail') {
                    this.unBindEmail()
                }
            },

            /* 修改用户名 */
            editUserName() {
                if (this.fromPage === 'babyAdd') { // 宝贝新增时候的返回事件，根据id判断是编辑还是新增
                    this.userStateData.name = this.userData.userName.value
                    this.$store.commit('setBabyData', this.userStateData);
                    if (this.userStateData.id) { // 编辑详情宝贝信息时调接口
                        let data = {
                            id: this.userStateData.id,
                            name: this.userData.userName.value,
                        }
                        this.$server.updateUserInfo(data)
                            .then(res => {
                                if (res.code === 200) {
                                    uni.showToast({
                                        title: '修改成功',
                                        icon: 'none'
                                    })
                                    uni.navigateBack({
                                        delta: 1
                                    })
                                }
                            })
                        return
                    }
                    uni.navigateBack({
                        delta: 1
                    })
                    return
                }
                let data = {
                    id: this.userData.id,
                    name: this.userData.userName.value,
                }
                /* 更新用户名 */
                this.$server.updateUserInfo(data).then(res => {
                    this.$nextTick(() => {
                        uni.showToast({
                            title: '修改成功',
                            icon: 'none'
                        })
                    })
                    this.userStateData.name = this.userData.userName.value
                    this.$store.commit('setUserData', this.userStateData);
                    uni.navigateBack({
                        delta: 1
                    })
                })
            },

            /* 修改手机号 */
            editUserPhone() {
                let data = {
                    userId: this.userStateData.id,
                    oldPhone: this.userStateData.phone,
                    newPhone: this.userData.newPhone.value,
                    newCode: this.userData.newPhoneCode.value,
                }
                this.$server.changePhone(data).then(res => {
                    uni.navigateBack({
                        delta: 1
                    })
                    this.userStateData.phone = this.userData.newPhone.value
                    this.$store.commit('setUserData', this.userStateData);
                })
            },

            /* 解绑邮箱 */
            unBindEmail() {
                let data = {
                    userId: this.userStateData.id,
                    type: "email"
                }
                this.$server.userUnBind(data).then(res => {
                    if (res.message === 'ok') {
                        uni.navigateBack({
                            delta: 1
                        })
                        this.userStateData.email = ''
                        this.$store.commit('setUserData', this.userStateData);
                    } else {
                        uni.showToast({
                            title: '解绑失败',
                            icon: 'none'
                        })
                    }
                })
            },

            /* 绑定邮箱 */
            bindEmail() {
                let data = {
                    source: "parent",
                    thirdPartyType: "email",
                    identifier: this.userStateData.phone,
                    thirdPartyId: this.userData.email.value,
                    code: this.userData.emailCode.value,
                }
                this.$server.userBind(data).then(res => {
                    if (res.message === 'ok') {
                        uni.navigateBack({
                            delta: 1
                        })
                        this.userStateData.email = this.userData.email.value
                        this.$store.commit('setUserData', this.userStateData);
                    } else {
                        uni.showToast({
                            title: '绑定失败',
                            icon: 'none'
                        })
                    }
                })
            },
        }

    }
</script>

<style lang="scss" scoped>
    uni-page-body {
        width: 100%;
        height: 100%;
    }

    .user_edit {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #fff;

        .user_edit_main {
            padding: 0 60rpx;
            box-sizing: border-box;
        }
    }

    .input_field  {
        margin-top: 56rpx;
    }

    .code {
        margin-right: 40rpx;
        font-size: 32rpx;
        color: #fece00;
    }


    .sendOk_text {
        display: block;
        margin: 5rpx 0 -16rpx 0rpx;
        font-size: 22rpx;
        line-height: 37rpx;
        color: var(--af);
    }

    .unbind_email_text {
        width: 630rpx;
        margin: 56rpx 0 40rpx 10rpx;
        font-size: 32rpx;
        line-height: 37rpx;
        color: #080808;
    }
</style>
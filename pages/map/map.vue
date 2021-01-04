<template>
<!--pages/map/map.wxml-->
<view class="background">

  <!-- 顶部选择语言区域 --> 
  <view class="chooseLanguage">
    <button @tap="changeFrom">{{from.name}}</button><text class="bottomTip">◢</text>
    <view>to</view>
    <text>↔</text>
    <button @tap="changeTo">{{to.name}}</button><text class="bottomTip">◢</text>
  </view>

  <!-- 顶部翻译区域 -->
  <view class="header">
    <input placeholder="请输入翻译内容" placeholder-style="color: #18BE74" @input="changeVal"></input>
    <button @tap="translate">点击翻译</button>
  </view>

  <!-- 中间译文区域 -->
  <view class="section">
    <textarea disabled placeholder="译文" placeholder-style="color: #18BE74" :value="translateVal" @input="changeTranslateVal"></textarea>
    <button @tap="copy">复制</button>
  </view>

  <!-- 底部嘴贱区域 -->
  <view class="footer">
    <text>新年新气象</text>
    <text>肥宅翻译祝你的英语水平直线下降</text>
  </view>

  <!-- 底部弹窗区域 -->
  <view class="language" :style="'display:' + (showLanguage?'block':'none') + ';'">
    <picker-view indicator-style="height: 40px;" class="bottomWindow" :value="value" @change="bindChange">
    <picker-view-column>
      <view v-for="(item, index) in list" :key="index" style="line-height: 40px;text-align: center;">{{item.name}}</view>
    </picker-view-column>
    </picker-view>
    <button @tap="cancel">取消</button>
    <button @tap="ok">确定</button>
  </view>
</view>
</template>

<script>
// pages/map/map.js
// 这是引入百度翻译的md5加密文件，接口也是百度的翻译api，凡是后面注释百度的，都不用想，复制粘贴就行
import MD5 from './md5'; // 百度
import data from './data.json'
// 百度
const appid = '20191120000358960'; // 百度
// 百度
const key = 'ptma_HAnUgrQlJ9MdzGX'; // 百度
// 百度
let salt = new Date().getTime(); // 百度

export default {
  data() {
    return {
      list: [],
      // auto: { val: 'auto', name: '自动检测' }, // 自动检测
      val: '',
      // 翻译内容
      translateVal: '',
      // 已翻译内容
      from: {
        val: 'auto',
        name: '自动检测'
      },
      to: {
        val: 'en',
        name: '英语'
      },
      listIndex: 0,
      // 切换翻译语言的索引值
      formOrTo: 0,
      // 0为from,1为to
      showLanguage: false // 翻译底部弹窗的显示/隐藏

    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	   console.log(JSON.stringify([{
	val: 'zh',
	name: '中文'
}, {
	val: 'en',
	name: '英语'
}, {
	val: 'yue',
	name: '粤语'
}, {
	val: 'wyw',
	name: '文言文'
}, {
	val: 'kor',
	name: '韩语'
}, {
	val: 'fra',
	name: '法语'
}, {
	val: 'spa',
	name: '西班牙语'
}, {
	val: 'th',
	name: '泰语'
}, {
	val: 'ara',
	name: '阿拉伯语'
}, {
	val: 'ru',
	name: '俄语'
}, {
	val: 'pt',
	name: '葡萄牙语'
}, {
	val: 'de',
	name: '德语'
}, {
	val: 'it',
	name: '意大利语'
}, {
	val: 'el',
	name: '希腊语'
}, {
	val: 'nl',
	name: '荷兰语'
}, {
	val: 'pl',
	name: '波兰语'
}, {
	val: 'bul',
	name: '保加利亚语'
}, {
	val: 'est',
	name: '爱沙尼亚语'
}, {
	val: 'dan',
	name: '丹麦语'
}, {
	val: 'fin',
	name: 'fin'
}, {
	val: 'cs',
	name: '捷克语'
}, {
	val: 'rom',
	name: '罗马尼亚语'
}, {
	val: 'slo',
	name: '斯洛文尼亚语'
}, {
	val: 'swe',
	name: '瑞典语'
}, {
	val: 'hu',
	name: '匈牙利语'
}, {
	val: 'cht',
	name: '繁体中文'
}, {
	val: 'vie',
	name: '越南语'
}]
))
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    // 切换翻译语种
    changeFrom() {
      this.setData({
        formOrTo: 0,
        showLanguage: true
      });
    },

    // 切换翻译为语种
    changeTo() {
      this.setData({
        formOrTo: 1,
        showLanguage: true
      });
    },

    // 选择语言
    bindChange(e) {
      this.setData({
        listIndex: e.detail.value[0]
      });
    },

    // 绑定翻译的内容
    changeVal(e) {
      this.setData({
        val: e.detail.value
      });
    },

    // 绑定翻译的内容
    changeTranslateVal(e) {
      console.log(e);
      this.setData({
        translateVal: e.detail.value
      });
    },

    // 取消隐藏底部弹窗
    cancel() {
      this.setData({
        showLanguage: false
      });
    },

    // 点击确定切换语言
    ok() {
      if (this.formOrTo === 0) {
        this.setData({
          from: this.list[this.listIndex],
          showLanguage: false
        });
      } else {
        this.setData({
          to: this.list[this.listIndex],
          showLanguage: false
        });
      }
    },

    // 点击翻译
    translate() {
      var str1 = appid + this.val + salt + key; // 百度

      var sign = MD5(str1); // 百度

      const that = this;
      uni.request({
        url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
        // 百度
        data: {
          // 百度
          q: this.val,
          appid: appid,
          salt: salt,
          from: this.from.val,
          to: this.to.val,
          sign: sign,
          time: new Date().getTime()
        },
        header: {
          'content-type': 'application/json' // 默认值 // 百度

        },

        success(res) {
          that.setData({
            translateVal: res.data.trans_result[0].dst
          });
        }

      });
    },

    // 点击复制
    copy() {
      const that = this;
      if (that.translateVal === "") return;
      uni.setClipboardData({
        data: that.translateVal,

        success(res) {
          uni.getClipboardData({
            success(res) {// do nothing 这里也可以让复制成功的弹窗消失，因为它会存在1.5s，如果不会问我就行
            }

          });
        }

      });
    }

  }
};
</script>
<style>
/* pages/map/map.wxss */

/* 设置隔开的距离 */
.header,.section,.footer{
  margin: 20rpx 0;
}

.background{
  width: 100%;
  height: 100vh;
  background: white;
}

/* 顶部选择语言和其下后代元素的样式 */
.chooseLanguage{
  display: flex;
  align-items: center;
  position: relative;
  color: #4B4640;
}
.chooseLanguage button{
  width: auto;
  color: #4B4640;
  background: transparent;
}
.chooseLanguage view{
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%,0);
}
.chooseLanguage text{
  position: absolute;
  left: 48%;
  margin-top: 20rpx;
}
.chooseLanguage .bottomTip{
  position: relative;
  left: -15%;
}



/* 顶部翻译区域 */
.header{
  display: flex;
  width: 100%;
  height: 80rpx;
}
.header input{
  width: 38%;
  height: 80rpx;
  margin-left: 5%;
  border: 1rpx solid #18BE74;
  border-radius: 5rpx;
  padding-left: 2%;
}
.header button{
  float: right;
  width: 40%;
  height: 80rpx;
  margin-left: 10%;
  color: white;
  background: #18BE74;
}



/* 中间译文区域 */
.section{
  position: relative;
}
.section textarea{
  width: 86%;
  height: 300rpx;
  margin: 0 auto;
  padding: 2%;
  border: 1rpx solid #18BE74;
  border-radius: 5rpx;
}
.section button{
  position: absolute;
  right: 7%;
  bottom: 4%;
  z-index: 10;
  width: 200rpx;
  color: white;
  background: #18BE74;
}



/* 底部嘴贱区域 */
.footer{
 position: absolute;
 bottom: 300rpx;
 width: 100%;
}
.footer text{
  display: block;
  margin-top: 20rpx;
  color: #18BE74;
  text-align: center;
}



/* 底部弹窗区域 */
.language .bottomWindow{
  position: absolute;
  bottom: 0rpx;
  width: 100%; 
  height: 500rpx;
  color: white;
  background: #18BE74;
}
.language button{
  position: absolute;
  width: 50%;
}
.language button:nth-of-type(1){
  left: 0%;
  bottom: 0;
  color: #18BE74;
  background: white;
  border: 1px solid #18BE74;
}
.language button:nth-of-type(2){
  right: 0%;
  bottom: 0;
  color: white;
  background: #18BE74;
}
</style>
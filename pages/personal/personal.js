import request from "../../utils/request";

let startY = 0; // 起始坐标
let moveY = 0; // 实时坐标
let distance = 0; // 移动的距离

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {}, // 用户信息
    recentList: [], // 播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 读取本地用户信息数据
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
    }
    
    // 获取用户播放记录
    let recentListData = await request('/user/record', {uid: this.data.userInfo.userId, type: 0})
    
    let index = 0;
    recentListData.allData.forEach(item => item.id = index++)
    this.setData({
      recentList: recentListData.allData
    })
  },
  
  handleTouchStart(event){
    // 清除过渡效果
    this.setData({
      coverTransition: ''
    })
    // 获取手指起始坐标
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event){
    moveY = event.touches[0].clientY;
    
    // 计算得到手指移动的距离
    distance = moveY - startY;
    if(distance < 0){
      return;
    }
    
    if(distance >= 80){
      distance = 80;
    }
    this.setData({
      coverTransform: `translateY(${distance}rpx)`
    })
  },
  handleTouchEnd(){
    this.setData({
      coverTransform: `translateY(0)`,
      coverTransition: 'transform 1s linear'
    })
  },
  
  // 跳转至登录界面
  toLogin(){
    // 验证用户是否登录
    if(this.data.userInfo){
      return;
    }
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

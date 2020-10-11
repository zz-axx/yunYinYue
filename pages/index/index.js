import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 轮播图数据
    recommendList: [], // 推荐歌曲
    topList: [], // 排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerListData = await request('/banner', {type: 2});
    // 更新bannerList状态数据
    this.setData({
      bannerList: bannerListData.banners
    })
    
    // 获取推荐歌曲的数据
    let recommendListData = await request('/personalized', {limit: 10})
    this.setData({
      recommendList: recommendListData.result
    })
    
    
    // 获取topList排行榜数据
    /*
    * 1. 一个idx对应一个分类的数据
    * 2. 需要5个分类的数据，所以发送5次
    * 3. idx参数范围： 0 - 4
    * */
    let index = 0;
    let resultArr = [];
    while(index < 5){
      let result = await request('/top/list', {idx: index++});
      /*
      * splice()
      * slice()
      * 详情见test.js
      * */
      let obj = {name: result.playlist.name, tracks: result.playlist.tracks.slice(0, 3)}
      resultArr.push(obj)
      // 提高首屏的渲染效率，缩短首屏渲染等待的时间，渲染的次数增多，用户体验好
      this.setData({
        topList: resultArr
      })
    }
    // 渲染的次数少，首屏渲染等待的时间多长，用户体验差
    // this.setData({
    //   topList: resultArr
    // })
    
    
  },
  
  // 跳转至recommendSong页面
  toRecommend(){
    wx.navigateTo({
      url: '/song/pages/recommendSong/recommendSong'
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

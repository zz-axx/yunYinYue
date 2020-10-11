import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../../utils/request';

// 获取全局App实例
let appInstance = getApp();
// console.log(appInstance);
// appInstance.globalData.musicId = 123;
// console.log(appInstance);
let currentTime = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 标识音乐是否播放，默认为未播放
    song: {}, // 音乐详情
    musicId: '', // 音乐id
    musicLink: '', // 音乐链接
    currentTime: '00:00', // 实时时间
    durationTime: '00:00', // 歌曲总时间
    currentWidth: 0, // 动态进度条
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // options是专门用于接收路由跳转传参的对象
    let musicId = options.id;
    
    // 根据音乐的id获取对应的音乐详情
    this.getMusicInfo(musicId);
    
    
    // 根据全局存储的状态判断当前页面的音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){ // 当前页面音乐在播放
      this.setData({
        isPlay: true
      })
    }
    
    // 监听音乐播放/暂停/停止
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      // 修改全局播放的状态
      this.changeIsPlayState(true)
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      this.changeIsPlayState(false)
    });
    this.backgroundAudioManager.onStop(() => {
      this.changeIsPlayState(false)
    })
  
    // 监听音乐自然播放结束
    this.backgroundAudioManager.onEnded(() => {
      // 停掉当前音乐
      this.backgroundAudioManager.stop();
      // 自动切换至下一首
      PubSub.publish('switchType', 'next');
    })
    
    // 监听音乐播放进度实时发生改变
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log('总时长: ', this.backgroundAudioManager.duration);
      // console.log('实时时间: ', this.backgroundAudioManager.currentTime);
      // 格式化实时的时间
      let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss');
  
      // 动态计算实时进度条的长度
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })
      
      
    })
    
    
    // 订阅 recommendSong 发送的消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      console.log('recommend发送过来的musicId: ', musicId);
      // 获取音乐信息
      this.getMusicInfo(musicId);
      
      // 自定播放音乐,切歌
      this.musicControl(true, musicId)
    })
    
  },
  // 封装获取音乐信息的功能函数
  async getMusicInfo(musicId){
    let songData = await request('/song/detail', {ids: musicId})
    // console.log(songData.songs[0].dt);
    // moment格式化时间的单位是ms
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      musicId,
      durationTime
    })
    // 动态设置窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  // 封装修改状态方法
  changeIsPlayState(isPlay){
    // 修改当前页面播放状态
    this.setData({
      isPlay
    })
    // 修改全局播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  
  // 控制音乐播放/暂停的回调
  musicPlay(){
    let isPlay = !this.data.isPlay
    // 1. 修改播放状态
    // this.setData({
    //   isPlay
    // })
    
    // 2. 控制音乐播放
    let {musicId, musicLink} = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },

  
  // 封装控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink){
    if(isPlay){ // 音乐播放
      // 1) 根据音乐id获取音乐链接
      /*
      * 思考：
      *   1. 首次播放需要发送请求获取音乐链接
      *   2. 再次播放，不需要发请求，直接使用之前的链接
      *
      * */
      if(!musicLink){
        let musicLinkData = await request('/song/url', {id: musicId})
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        })
      }
      
      // 2) 播放音乐 wx.getBackgroundAudioManager()
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
    }else { // 音乐暂停
      this.backgroundAudioManager.pause();
     
      // appInstance.globalData.musicId = musicId;
    }
  },
  
  // 切换歌曲的回调
  switchMusic(event){
    let type = event.currentTarget.id;
    // 停掉当前音乐
    this.backgroundAudioManager.stop();
    
    PubSub.publish('switchType', type);
    // PubSub.subscribe('musicId', (msg, musicId) => {
    //   console.log('recommend发送过来的musicId: ', musicId);
    //
    //   // 取消订阅
    //   PubSub.unsubscribe('musicId')
    // })
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

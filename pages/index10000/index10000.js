// pages/index10000/index10000.js
var appInstance = getApp();
Page({
  data:{
    real_value:false,
  },
  foundphoto:function(){
    wx.navigateTo({
      url: '../index10001/index10001',
      success: function(res){
        console.log(res);
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  getphoto:function(){
    var that = this;
    appInstance.sendRequest({
      method:'POST',
      url:'photo',
      success:function(res){
        var data = res.data;       
        if(res.code==200){
         that.setData({
            real_value:true
          })
          
          wx.setStorage({
            key: 'photo',
            data: data
          })
        }
      },
      fail:function(res){
        console.log('get photo fail')
      }
    },'https://chaye.j8j0.com/api/img/')
  },  
  navphoto:function(){
      wx.navigateTo({
        url: '../indexphoto/indexphoto',
        success: function(res){
          console.log(res);
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    },
  setfullscreen:function(){
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        appInstance.globalData.windowHeight=res.windowHeight+'px';
      }
    })
  },    
  onLoad:function(options){
      //appInstance.checkLogin();
    this.setfullscreen();    
      //appInstance.setPageUserInfo();     
    // var data = appInstance.getUserInfo();
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    var that = this;
    var a = wx.getStorageSync('session_key');
    that.getphoto()
    },
  onShow:function(){

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
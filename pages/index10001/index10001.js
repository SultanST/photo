var appInstance = getApp();
Page({
  data:{
    photo:[
      {src:"../../images/add.png"}
    ],
    photoadd:[]
  },
  // chooseImage:function(){
  //   return appInstance.chooseImage();
  // },
  chooseImage:function(callback, count){
    var that = this;
    wx.chooseImage({
        count: 9,
        sizeType: ['compressed'], 
        //sizeType: ['original','compressed'],
        sourceType: ['album'], 
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
         // that.photoadd.push(tempFilePaths);
         var photo = that.data.photoadd;
        for (var i = 0; i < tempFilePaths.length; i++) {
         photo.unshift(tempFilePaths[i]);
        }
         appInstance.globalData.photo_loca = photo;
          that.setData({
            photoadd:photo
          })
        }
      })
  },
  gonext:function(){
    var that = this;
    var photoadd = this.data.photoadd,
        imageUrls = []; 
    var session_key = appInstance.globalData.sessionKey;
    if(photoadd.length!=0){
      var date = Date.now();
      for (var i = 0; i < photoadd.length; i++) {
        console.log(i)
          wx.uploadFile({
            formData: {'session_key':session_key,add_img_time:date},
            url : 'https://chaye.j8j0.com/api/img/add_img',
            filePath: photoadd[i],
            name: 'file',
            success: function(res){
              var data1 = JSON.parse(res.data);
              var data = data1.data;
              console.log(data);
              imageUrls.push(data.portrait);
            console.log(imageUrls);    
            },
            fail: function(res){
              console.log(res.errMsg);
            }
          })
        }
    appInstance.globalData.photo_line = imageUrls;
    // 重置showonly的值为  1
    appInstance.globalData.showonly = 1;
    console.log(appInstance.globalData.showonly);
    console.log(appInstance.globalData.photo_line)
     wx.navigateTo({
        url: '../index/index',
        success: function(res){}
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请先选择图片',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
   }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
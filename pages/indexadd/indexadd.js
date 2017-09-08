var appInstance = getApp();
Page({
  data:{
    photo:[
      {src:"../../images/add.png"}
    ],
    photoadd:[]
  },
  chooseImage:function(callback, count){
    var that = this;
   // console.log(count);
    wx.chooseImage({
        count: 9,
        sizeType: ['original','compressed'], 
        sourceType: ['album'], 
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths);
         // that.photoadd.push(tempFilePaths);
         var photo = that.data.photoadd;
        for (var i = 0; i < tempFilePaths.length; i++) {
         photo.unshift(tempFilePaths[i]);
        }
         console.log(photo);
         appInstance.globalData.photo = photo;
          that.setData({
            photoadd:photo
          })
        }
      })
  },
  gonext:function(event){
    var photoadd = this.data.photoadd,
        imageUrls = [];
     console.log(appInstance.globalData.photo);   
    if(photoadd.length!=0){
       wx.uploadFile({
        url : appInstance.globalData.siteBaseUrl+ '/index.php?r=AppData/uploadImg',
        filePath: photoadd,
        name: 'img_data',
        success: function(res){
          var data = JSON.parse(res.data);
          appInstance.globalData.photoad = data;
          if(data.status == 0){
            imageUrls.push(data.data);
        //typeof callback == 'function' && callback(imageUrls);
              wx.navigateTo({
                  url: '../index/index?photo'+photoadd,
                  success: function(res){}
                })
          } else {
            that.showModal({
              content: data.data
            })
          }
        },
        fail: function(res){
          console.log(res.errMsg);
        }
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
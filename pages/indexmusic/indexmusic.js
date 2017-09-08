// pages/indexmusic/indexmusic.js
var app = getApp()  
Page({  
  data: {  
    navbar: ['热门', '流行', '网络','怀旧','童真','纯音乐'],  
    currentTab: 0, 
    musicitem:{
      hot:[{'music':'光辉岁月','id':'0'},{'music':'光辉碎月','id':'1'},{'music':'光辉碎玉','id':'2'},{'music':'光辉约束','id':'3'}],
      fashion:[],
      online:[],
      old:[],
      child:[],
      simple:[]
    }
  },  
  navbarTap: function(e){
    var id = e.currentTarget.dataset.idx;
    var navbar = this.data.navbar;
    this.setData({  
      currentTab: id  
    })
    this.getmusiclist(navbar[id]);
  },
  getnavbar:function(){
    var that =this;
    app.sendRequest({
        url:'edit_music',
        method:'POST',
        success: function(res){
          var data = res.data;
          var navbar = [];
          for(var i=0;i<data.length;i++){
            var name=data[i].name;
            navbar.push(name);
          }
          that.setData({
            navbar:navbar
          });
          that.getmusiclist(navbar[0]);               
        },
        fail: function(res){
          console.log('getmuscinarbar fail');
        },
        complete: function(res){
        }
      },'https://chaye.j8j0.com/api/img/')
  },
  choosemusic:function(){
    var musicid = e.currentTarget.dataset.idx;
    app.globalData.music = musicid;
    app.sendRequest({
      url:'edit_music',
      method:'POST',
      data:{
        name:musicid
      },
      success: function(res){
        var data = res.data;
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function(res){
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
      fail: function(res){
        console.log('setmusci fail');
      },
      complete: function(res){
      }
    },'https://chaye.j8j0.com/api/img/')
  },
  getmusiclist:function(e){
    var e = this.data.currentTab;
    var that = this;
    app.sendRequest({
      url:'music',
      method:'POST',
      data:{
        name:e
      },
      success: function(res){
        var data = res.data;
        that.setData({
          musicitem:{'hot':data}
        })              
      },
      fail: function(res){
        console.log('getmuscilist fail');
      },
      complete: function(res){
      }
    },'https://chaye.j8j0.com/api/img/')
  },
  onLoad: function () {
     this.getnavbar();
    //appInstance.setPageUserInfo();   
    // appInstance.checkLogin();
  },
}) 
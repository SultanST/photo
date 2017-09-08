//flip/flipInX/flipInY翻转//rotation/zoom//rotateInDownLeft//  slideIn//slide弹性上下（相框动画）
//zoom/fadeOutUp/fadeOutDown/fadeOutleansU D上移 下移 (小动画(闪光，落叶，气球等) )
//swing (中等动画（兔子，云朵等）)
//index.js 
//获取应用实例
var playon=true;
var app = getApp()
Page({
  data: {
    showonly:1,
    theme:'',
    //music  AND  background AND rabit_box
    rabit:{  
      music_src: '',
      background_img:'background-image: url(../../images/none.png)',
      //rabit_box:'../../images/rabit.png',//花朵
      rabit_position:['position: absolute;bottom: 338rpx;right: 100rpx;','width: 104px;height: 158px;'],
      rabit_box:'../../images/none.png'
       },
      //music旋转
    rotation:'animation-play-state: running',
    //爱心特效1是闪星 2是落叶 3是上升
    bling_box:1,
    bling:{
      love_style:'fadeOutDown',
      lover_src:'../../images/none.png'
    },
    bling2:{
      love_style:'fadeOutDown',
      lover_src:'../../images/none.png'
    },
    //如果是slide效果加'overflow: hidden;'
    overflow:'width: 488rpx;height: 867rpx;top:150rpx;position:absolute;right:150rpx;z-index:100',
    //白色邮票相框配置
    pbox_style:"border:20rpx solid #fff;border-image:url(../../images/border.png) repeat 13;",
    iframe:{
      iframe_style:'zoom',
    },
    iframe_animatelist:['zoom','flipInX','flipInY','rotation','rotateInDownLeft'],
    //图片
    photo:[],
    photo_right:0,
    windowHeight:'',
  },
  //事件处理函数
pausemusi: function() {
    if(this.playon == true){
      this.audioCtx.pause();  
      this.playon = false;
      this.setData({
        rotation:'animation-play-state: paused'
      })
    }else{
        this.audioCtx.play();
        this.playon = true;
        this.setData({
        rotation:'animation-play-state: running'
      })
    }    
  },   //animate("选择器","动画","次数","时延")
love_animate: function (animation_one,animation_twi, delay_onc,delay_twi) {
     var that = this;
      var timer = null;
      timer = setInterval( function() {
        that.setData({
          bling:{
            love_style:animation_one            
          }
        })
        console.log('setInterval');
        setTimeout(function(){
          that.setData({
          bling:{
            love_style:animation_twi
          }
        })
        },delay_onc)
      }, delay_twi)
  },
iframe_animate: function (delay_time) { 
    var that = this ;
     var  animo = this.data.iframe_animatelist;
     var i = 0;
     var  timer = setInterval( function() {    
        var randon = Math.floor(Math.random()*5),
        photo_length= app.globalData.photo_loca.length;
       if(i!=photo_length-1){
           i++;
          }else{i=0}       
        that.setData({
          iframe:{
            iframe_style1:animo[randon],
            },
          photo_right:i 
          })       
      }, delay_time)
  },
randomInteger:function (low, high) {
      return low + Math.floor(Math.random() * (high - low));
        },
randomFloat: function (low, high) {
            return low + Math.random() * (high - low);
        },
pixelValue :function (value) {
            return value + 'px';
        },
durationValue: function (value) {
            return value + 's';
        },
create_animate:function(){
  //image.src ='../../images/2.2'+ randomInteger(1, 10) + '.png';
},
navtomodel:function(){
    wx.navigateTo({
      url: '../indexmodel/indexmodel',
      success: function(res){
        console.log(res)
      },
    })
  },
navtomusic:function(){
    wx.navigateTo({
      url: '../indexmusic/indexmusic',
      success: function(res){
        console.log(res)
      },
    })
  },
navtophoto:function(){
    wx.navigateTo({
      url: '../indexadd/indexadd',
      success: function(res){
        console.log(res)
      },
    })
  },
navtokeep:function(){
  app.showModal({
      content:'相册保存成功，请点击右上角的菜单分享！'
    })
  }, 
setscreenheight:function(){
  var windowHeight = app.globalData.windowHeight;
  this.setData({
    windowHeight:'height:'+windowHeight
  })
},    
onLoad: function () {
    var that = this;
    this.setscreenheight();
    this.iframe_animate(6000);
    // that.setData({
    //   showonly:1
    // })
    //console.log(that.data.userInfo)
  },
onReady:function(e){
  },
onHide:function(){
  if(this.playon == true){
    this.pausemusi();
   }
  },
initiatlizate:function(){
  var that= this;
  var theme = app.globalData.theme;
  var theme_old = this.data.theme;
    console.log(theme_old);
  //通讯获取mude
    if(theme!=theme_old){      
     that.setData({
       theme:theme
     });
     console.log(that.data.theme);
      app.sendRequest({
          url:'img',         
          method:'POST',
          success: function(res){
            var data = res.data;
            console.log(data)           
            var components={};
            for(var i=0,l=data.length;i<l;i++){
              if(data[i].type==1){
                components.url = that.data.windowHeight+';background-image: url('+data[i].img+')'; 
                components.music = data[i].music;
                components.theme = data[i].t_id;
              }
              if(data[i].type==2){
                components.pbox_style = 'border:22rpx solid #fff;border-image:url('+data[i].img+') repeat 13;'; 
              }
              if(data[i].type==3){
                var img = data[i].img;
                if(img.length!=1){
                components.bling1 = img[0];
                components.bling2 = img[1]; 
                }else{
                  components.bling1 = img[0];
                  components.bling2= '../../images/2.1.png'
                }
              }
              if(data[i].type==4){
                components.rabit_box = data[i].img; 
              }
              if(data[i].type==5){
                components.photo = data[i].img; 
              }
            }
            that.setcomponents(components)
          },
          fail: function(res){
            console.log('getmode fail');
          },
          complete: function(res){
          }
        },'https://chaye.j8j0.com/api/img/')  
    }else{
      console.log('same theme call fail')
    }
},
setcomponents:function(e){
  //这里添加10个模板的配置文件
  console.log(e)
  this.setData({
      theme:e.theme,
      rabit:{
        music_src: e.music,
        background_img:e.url,
        //rabit_box:'../../images/rabit.png',
        rabit_position:['position: absolute;bottom: 0rpx;left: 40rpx;','width: 300rpx;height: 580rpx;'],
        rabit_box:e.rabit_box
        },
      bling_box:1,
      bling:{
        love_style:'zoom',
        lover_src:e.bling1
      },
      bling2:{
        love_style:'zoom',
        lover_src:e.bling2
      },
      //如果是slide效果加'overflow: hidden;'
      overflow:'width: 488rpx;height: 700rpx;top:200rpx;position:absolute;right:150rpx;z-index:100',
      //白色邮票相框配置
      pbox_style:e.pbox_style,
      iframe:{
        iframe_style1:'flipInY',
        iframe_style2:'rotation'
      },
      //图片
      photo:app.globalData.photo_loca,
      photo_right:0,
      showonly:app.globalData.showonly
   })  
  this.audioCtx = wx.createAudioContext('myAudio');
  this.audioCtx.play()
},
onShow:function(e){
    this.initiatlizate();
    // this.setData({
    //   showonly: 1
    // })  
    if(this.playon == false){
      this.pausemusi();
    }  
  }
})

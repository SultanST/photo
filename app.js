//app.js
App({
  onLaunch: function () {
    this.checkLogin();
  },
  onShow: function(){
    console.log('onShow');
  },
  onHide: function(){
    console.log('onHide');
  },
  sendRequest: function(param, customSiteUrl){
    var that = this,
        data = param.data || {},
        header = param.header,
        requestUrl;  
    data._app_id = this.getAppId();
    data.app_id = this.getAppId();
    //if(!this.globalData.notBindXcxAppId){
      data.session_key = this.getSessionKey();
   // }

    if(customSiteUrl) {
      requestUrl = customSiteUrl + param.url;
    } else {
      requestUrl = this. globalData.siteBaseUrl + param.url;
    }

    if(param.method){
      if(param.method.toLowerCase() == 'post'){
        data = this.modifyPostParam(data);
        header = header || {
          'content-type': 'application/x-www-form-urlencoded;'
        }
      }
      param.method = param.method.toUpperCase();
    }

    this.showToast({
      title: '请求中...',
      icon: 'loading'
    });
    wx.request({
      url: requestUrl,
      data: data,
      method: param.method || 'GET',
      header: header || {
        'content-type': 'application/json'
      },
      success: function(res) {
        if(res.statusCode && res.statusCode != 200){
          that.hideToast();
          that.showModal({
            content: ''+res.errMsg
          });
          return;
        }
        if(res.data.status){
          if(res.data.status == 401){
            that.login();
            return;
          }
          if(res.data.status != 0){
            that.hideToast();
            that.showModal({
              content: ''+res.data.data
            });
            return;
          }
        }
        typeof param.success == 'function' && param.success(res.data);
      },
      fail: function(res){
        that.showModal({
          content: '请求失败 '+res.errMsg
        })
        typeof param.fail == 'function' && param.fail(res.data);
      },
      complete: function(res){
        typeof param.complete == 'function' && param.complete(res.data);
      }
    });
  },
  login: function(){
    var that = this;
    wx.login({
      success: function(res){
        if (res.code) {
          that.sendCode(res.code);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function(res){
        console.log('login fail: '+res.errMsg);
      }
    })
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
      console.log('userInfo is in');     
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  setPageUserInfo: function(){
    var currentPage = this.getCurrentP(),
        newdata = {};
        //var ad = this.getUserInfo();
    newdata['userInfo'] = this.globalData.userInfo;
    currentPage.setData(newdata);
  },
  getCurrentP: function(){
    var pages = getCurrentPages();
    console.log(pages);
    return pages[pages.length - 1];
  },
  getAppId: function(){
    return this.globalData.appId;
  },
  getDefaultPhoto: function(){
    return this.globalData.defaultPhoto;
  },
  setUserInfoStorage: function(info){
    this.globalData.userInfo = info;
    wx.setStorage({
      key: 'userInfo',
      data: this.globalData.userInfo
    })
  },
  checkLogin: function(){
    if(!this.getSessionKey()){
      this.sendSessionKey();
    } else {
      this.login();
    }
  },
  pageInitial: function(){
    this.getCurrentP().dataInitial();
  },
  sendCode: function(code){
    var that = this;
    var url = 'login';
    this.sendRequest({
      url:url,
      data:{
        code:code
      },
      success: function(res){
        if(res.data.is_login == 1) {
          //that.getPhoto();
        }
        that.setSessionKey(res.data.session_key);
       that.requestUserInfo(res.data.is_login);
       console.log(res.message)
      },
      fail: function(res){
        console.log('sendCode fail');
      },
      complete: function(res){
      }
    })
  }, 
  getSessionKey: function(){
    return this.globalData.sessionKey;
  },
  setSessionKey: function(session_key){
    this.globalData.sessionKey = session_key;
    wx.setStorage({
      key: 'session_key',
      data: session_key
    })
  },
  sendSessionKey: function(){
    var that = this;
    try {
      var key = wx.getStorageSync('session_key');
    } catch(e) {

    }

    if (!key) {
      console.log("check login key=====");
      this.login();
//确认登录态
    } else {
      this.globalData.sessionKey = key;
      this.sendRequest({
        method:'POST',
        url: 'getUserinfo',
        success: function(res){
          if(res.code == 400){
            console.log(res.code)
            // 如果没有登录
            that.login();
            //return;
          } else if(res.code == 200) {
             that.setUserInfoStorage(res.data);
             //that.getPhoto();
          }      
        },
        fail: function(res){
          console.log('sendSessionKey fail');
        }
      });
    }
  },
  //  向wx服务器check
  // sendSessionKeywx: function(){
  //   var that = this;
  //   try {
  //     var key = wx.getStorageSync('session_key');
  //   } catch(e) {

  //   }

  //   if (!key) {
  //     console.log("check login key=====");
  //     this.login();

  //   } else {
  //     this.globalData.sessionKey = key;
  //     wx.checkSession({
  //       success: function(res){   
  //        console.log('checkLogin success');       
  //       },
  //       fail: function(res){
  //         that.login();
  //         console.log('checkLogin fail');
  //       }
  //     });
  //   }
  // },
  requestUserInfo: function(is_login){
    if(is_login==1){
      this.requestUserXcxInfo();
    } else {
      this.requestUserWxInfo();
    }
  },
  requestUserXcxInfo: function(){
    var that = this;
    this.sendRequest({
      method:'POST',
      url: 'getUserInfo',
      success: function(res){
          if(res.data){
            that.setUserInfoStorage(res.data);
          }
      },
      fail: function(res){
        console.log('requestUserXcxInfo fail');
      }
    })
  },
  requestUserWxInfo: function(){
    var that = this;
    wx.getUserInfo({
      success: function(res){
        that.sendUserInfo(res);
      },
      fail: function(res){
        console.log('requestUserWxInfo fail');
      }
    })
  },
  sendUserInfo: function(res){
    var that = this;
    this.sendRequest({
      url: 'updateUserInfo',
      method: 'POST',
      data: {
        encryptedData: res['encryptedData'],
        iv: res['iv'],
      },
      success: function(res){
         console.log(res)
        if(res.code == 200){
          that.setUserInfoStorage(res.data);
        }
      },
      fail: function(res){
        console.log('requestUserXcxInfo fail');
      }
    })
  },
  modifyPostParam: function(obj) {
    let query = '',
        name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this.modifyPostParam(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this.modifyPostParam(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  },
  turnToPage: function(url, isRedirect){
    if(!isRedirect){
      wx.navigateTo({
        url: url
      });
    } else {
      wx.redirectTo({
        url: url
      });
    }
  },
  switchToTab: function(url){
    wx.switchTab({
      url: url
    });
  },
  turnBack: function(){
    wx.navigateBack();
  },
  setPageTitle: function(title){
    wx.setNavigationBarTitle({
      title: title
    });
  },
  showToast: function(param){
    wx.showToast({
      title: param.title,
      icon: param.icon,
      duration: param.duration || 1500,
      success: function(res){
        typeof param.success == 'function' && param.success(res);
      },
      fail: function(res){
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function(res){
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  hideToast: function(){
    wx.hideToast();
  },
  showModal: function(param){
    wx.showModal({
      title: param.title || '提示',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#3CC51F',
      success: function(res) {
        if (res.confirm) {
          typeof param.confirm == 'function' && param.confirm(res);
        } else {
          typeof param.cancel == 'function' && param.cancel(res);
        }
      },
      fail: function(res){
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function(res){
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  chooseVideo: function(callback, maxDuration){
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: maxDuration || 60,
      camera: ['front', 'back'],
      success: function (res) {
        typeof callback == 'function' && callback(res.tempFilePaths[0]);
      }
    })
  },
  chooseImage: function(callback, count){
    var that = this;
    wx.chooseImage({
      count: count || 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths,
            imageUrls = [];

        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url : that.globalData.siteBaseUrl+ 'add_img',
            filePath: tempFilePaths[i],
            name: 'img_data',
            success: function(res){
              var data = JSON.parse(res.data);
              if(data.status == 0){
                imageUrls.push(data.data);
                if(imageUrls.length == tempFilePaths.length){
                  typeof callback == 'function' && callback(imageUrls);
                }
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
        }

      }
    })
  },
  previewImage: function(previewUrl, previewUrlsArray){
    wx.previewImage({
      current: previewUrl,
      urls: previewUrlsArray
    })
  },
  playVoice: function(filePath){
    wx.playVoice({
      filePath: filePath
    });
  },
  pauseVoice: function(){
    wx.pauseVoice();
  },
  wxPay: function(param){
    var _this = this;
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': 'MD5',
      'paySign': param.paySign,
      success: function(res){
        typeof param.success === 'function' && param.success();
        _this.wxPaySuccess(param);
      },
      fail: function(res){
        if(res.errMsg === 'requestPayment:fail cancel'){
          return;
        }
        _this.showModal({
          content: res.errMsg
        })
        _this.wxPayFail(param, res.errMsg);
      }
    })
  },
  wxPaySuccess: function(param){
    var orderId = param.orderId,
        goodsType = param.goodsType,
        formId = param.package.substr(10),
        t_num = goodsType == 1 ? 'AT0104':'AT0009';

    this.sendRequest({
      url: '/index.php?r=AppShop/SendXcxOrderCompleteMsg',
      data: {
        formId: formId,
        t_num: t_num,
        order_id: orderId
      }
    })
  },
  wxPayFail: function(param, errMsg){
    var orderId = param.orderId,
        formId = param.package.substr(10);

    this.sendRequest({
      url: '/index.php?r=AppShop/SendXcxOrderCompleteMsg',
      data: {
        formId: formId,
        t_num: 'AT0010',
        order_id: orderId,
        fail_reason: errMsg
      }
    })
  },
  // 拨打电话
  makePhoneCall: function(number, callback){
    if(number.currentTarget){
      var dataset = number.currentTarget.dataset;

      number = dataset.number;
    }
    wx.makePhoneCall({
      phoneNumber: number,
      success: callback
    })
  },
  globalData:{
    defaultPhoto:1,
    sessionKey: '',
    notBindXcxAppId:false,
    appId:"wxbba3ee7b6a963833",
    userInfo:null,
    siteBaseUrl:'https://chaye.j8j0.com/api/user/',
    photo_loca:[],
    photo_line:[],
    theme:'7',
    music:'defalut',
    windowHeight:'',
    // 0是分享 1是正常编辑 2是从分享进入
    showonly:1,
  }
})


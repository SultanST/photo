var appInstance = getApp();

var pageData    = {
  data: {
    "free_vessel4":{"content":[{"content":"http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",'name':'exlm',"eventParams":"8","eventHandler":"tapInnerLinkHandler"},{"content":"http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",'name':'exlm',"eventParams":"7","eventHandler":"tapInnerLinkHandler"},]}
  },
  onLoad: function (e) {
    var that =this;
    appInstance.sendRequest({
        url:'templet',
        method:'POST',
        success: function(res){
          var data = res.data;
          var contentall=[];
           for(var i=0,l=data.length;i<l;i++){
                var free_vessel={}
                free_vessel.content = data[i].photo;
                free_vessel.name = data[i].name;
                free_vessel.eventParams = data[i].id;
                free_vessel.eventHandler = "tapInnerLinkHandler"; 
              contentall.push(free_vessel);
            //  console.log(free_vessel.name)
           }
          console.log(contentall)
          that.setData({
            free_vessel4:{
             "content" :contentall
            }  
          })
        },
        fail: function(res){
          console.log('getmodelist fail');
        },
        complete: function(res){
        }
      },'https://chaye.j8j0.com/api/img/')
    //appInstance.setPageUserInfo();   
    // appInstance.checkLogin();
     },
  onShow: function(){ 
  },
  tapInnerLinkHandler:function(e){
    console.log(e);
    var tapeven = e.currentTarget.dataset.eventParams;
     appInstance.globalData.theme=tapeven;
    console.log(tapeven);
    if(tapeven!=null){
      appInstance.sendRequest({
            url:'templet',
            data:{
              id:tapeven
            },
            method:'POST',
            success: function(res){
              var data = res.data;
              console.log(data)  
              wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                  success: function(res){
                    //appInstance.globalData.theme=tapeven;
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
              console.log('getmode fail');
            },
            complete: function(res){
            }
          },'https://chaye.j8j0.com/api/img/') 
      }
    // var tab = JSON.parse(tapeven);
    // console.log(tab.inner_page_link);
  }
};
Page(pageData);
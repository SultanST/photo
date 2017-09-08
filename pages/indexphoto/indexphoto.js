var appInstance = getApp();

var pageData    = {
  data: {
    "free_vessel4":{"content":[{"content":"http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",'time':'2017','theme_detail':'123','found_time':'',"eventParams":"1","eventHandler":"tapInnerLinkHandler"},{"content":"http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",'name':'exlm','theme_detail':'123','found_time':'',"eventParams":"2","eventHandler":"tapInnerLinkHandler"},]}
  },
  onLoad: function (e) {
    var that =this;
    try {
        var photo = wx.getStorageSync('photo')
        if (photo) {
          var content=[];
          for(var key in photo){
            var arr = [];
            var content_obj = {};
            var _this = photo[key];
            //if photo·two
            for(var i=0;i<_this.length;i++){
              arr.push(_this[i].img)
            }
            content_obj.photo = arr;
            content_obj.content=_this[0].img;
            content_obj.found_time = _this[0].add_time;
            content_obj.eventParams = _this[0].t_id;
            content_obj.eventHandler = "tapInnerLinkHandler";
            content.push(content_obj);
          }
        }
        that.setData({
          free_vessel4:{
            'content':content
          }
        })
      } catch (e) {
      console.log(e)
    }
  },
  onShow: function(){ 
  },
  tapInnerLinkHandler:function(e){
    var that = this; 
    appInstance.globalData.showonly = e.currentTarget.dataset.op;
    var tapeven = e.currentTarget.dataset.eventParams;
    console.log(tapeven);
    var content = this.data.free_vessel4.content;
    for(var i=0;i<content.length;i++){
        if(content[i].eventParams == tapeven){
           appInstance.globalData.photo_loca=content[i].photo;
        }
    }
    if(tapeven!=null){
      appInstance.sendRequest({
            url:'templet',
            data:{
              id:tapeven
            },
            method:'POST',
            success: function(res){
              var data = res.data;
              console.log(data);
              wx.navigateTo({
                url: '../index/index',
                success: function(res){
                 appInstance.globalData.theme=tapeven;
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
  },
  nav_index:function(e){

  }
};
Page(pageData);
//常用公用方法封装
var CommonMixin = {
  //获取url参数
  getUrlParams: function(p) {
      var url = location.href;
      var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
      var paraObj = {};
      for (var i = 0, j = 0; j = paraString[i]; i++) {
          paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
      }
      var returnValue = paraObj[p.toLowerCase()];
      if (typeof(returnValue) == "undefined") {
          return "";
      } else {
          return returnValue;
      }
  },
  //分享链接异常处理
  fixWxUrl: function(url){
    // var a='http://dist.green-stone.cn/mobile/?from=singlemessage&isappinstalled=0#/index002?ownUri=e442&_k=v8x6jb';
    var newUrl = '';
    if(url.indexOf('?from=singlemessage&isappinstalled=0#')>-1){
      newUrl = url.replace('?from=singlemessage&isappinstalled=0#','#');
    }else{
      newUrl = url;
    }
    console.log('newUrl:'+newUrl+',url:'+url);
    return newUrl;
  }
};

module.exports = CommonMixin;

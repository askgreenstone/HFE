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
  }
};

module.exports = CommonMixin;

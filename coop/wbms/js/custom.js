// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($){
	var sess = Common.getUrlParam('session');
  var openid = Common.getUrlParam('openId');   
  var api =new Api();
  $('#custom_begin').click(function(event) {
  	window.location.href = 'template.html?session='+sess;
  });
  $('#custom_logout').click(function(event) {
    if(openid){
      window.location.href = '../index.html?openId='+openid;
    }else{
      window.location.href = '../index.html';
    }
  });
  $('#custom_preview').click(function(event) {
      $.ajax({
        type : 'GET',
        url : Common.globalDistUrl() + 'exp/CreateMicWebQrCode.do?session='+ sess,
        success : function(data) {
          console.log(data);
          window.location.href = data.url;
        },
        error : function(){
          alert('网络连接错误或服务器异常！');
        }
      })
  });
  $('#custom_reset').click(function(event) {
    window.location.href = 'template.html?session='+sess+'&ts='+new Date().getTime();
  });

  $('#downloadApp').click(function(event) {
    var ua = navigator.userAgent.toLowerCase();
    //ios专家版:https://itunes.apple.com/us/app/lu-shi-zhuan-jia-ban/id976040724
    //android专家版:http://cdn.askgreenstone.com/client/android.exp.apk
    //微信版: http://a.app.qq.com/o/simple.jsp?pkgname=com.greenstone.exp
    if(ua.indexOf('micromessenger') > -1){
      window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.greenstone.exp";
    }else{
      if (u.indexOf('android') > -1 || u.indexOf('linux') > -1) { //安卓手机
          window.location.href = "http://cdn.askgreenstone.com/client/android.exp.apk";
      } else if (u.indexOf('iphone') > -1) { //苹果手机
          window.location.href = "https://itunes.apple.com/us/app/lu-shi-zhuan-jia-ban/id976040724";
      } else {
          alert("暂不支持下载！");
      }
    }
  });

  // getMicroState();
})
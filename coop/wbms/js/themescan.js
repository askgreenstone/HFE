jQuery(function($) {
  var sess = Common.getUrlParam('session');
  function getLocationUrl(){
    $.ajax({
      type : 'GET',
      url : Common.globalDistUrl() + 'exp/CreateMicWebQrCode.do?session='+ sess,
      success : function(data) {
        console.log(data);
        $(".iframe_box iframe").attr('src',data.url);
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })
  }
  function checkIOSVersion(){
    // alert(window.navigator.appVersion);
    // 判断是否 iPhone 或者 iPod
    if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {
      // 判断系统版本号是否大于 4
      return Boolean(navigator.userAgent.match(/OS [9]_\d[_\d]* like Mac OS X/i));
    } else {
      return false;
    }
  }
  $(".iframe_box .themeScan_Iframe").click(function(){
    var confirm = window.confirm('保存并继续？点“取消”返回修改！');
    if(confirm){
      window.location.href = 'card.html?session='+sess;
    }else{
      window.location.href = 'themebg.html?session='+sess;
    }
  })
  function isAndroid(){
    var u = navigator.userAgent, 
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    return isAndroid;
  }
  //检测ios客户端
  function isIOS(){
    var u = navigator.userAgent, 
        app = navigator.appVersion;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isiOS;
  }
//初始化所有
  function initAll() {
    getLocationUrl();
    var temp = checkIOSVersion();
    // alert(this.isAndroid());
    if(!temp&&isIOS()){
      $('#bottomBar').css('bottom','12px');
      $('body').css('backgroundColor','#2D3132');
    }else if(isAndroid()){
      $('#bottomBar').css('bottom','-40px');
      $('body').css('backgroundColor','#2D3123');
    }
  }

  initAll();


})



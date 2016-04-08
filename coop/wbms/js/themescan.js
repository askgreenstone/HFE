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
  getLocationUrl();
  $(".iframe_box .themeScan_Iframe").click(function(){
    var confirm = window.confirm('结束预览？');
    var ratio = window.localStorage.getItem('ar');
    if(confirm){
      window.location.href = 'themebg.html?session='+sess+'&ratio='+ratio+'&_ts='+new Date().getTime();
    }
  })
})



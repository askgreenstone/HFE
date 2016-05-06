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
  
  $(".iframe_box .themeScan_Iframe").click(function(){
    var confirm = window.confirm('保存并继续？点“取消”返回修改！');
    if(confirm){
      window.location.href = 'card.html?session='+sess;
    }else{
      window.location.href = 'themebg.html?session='+sess;
    }
  })
//初始化所有
  function initAll() {
      getLocationUrl();
      var iframe = document.getElementById('iframe');
      iframe.onload = function(){
        console.log('fewvwegfewj');
        $('iframe #bottomBar').css('background','red');
      }
  }

  initAll();


})



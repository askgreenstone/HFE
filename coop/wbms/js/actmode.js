Zepto(function($){
    var session = Common.getUrlParam('session');
  
  
  $('.actmode_btn').click(function() {
    var data = {ad:7,ac:$(".actmode_inp".val())};
    $.ajax({
      type : 'post',
      url : Common.globalDistUrl() + 'exp/ActivateMicWeb.do?session='+ session,
      data: JSON.stringify(data) ,
      dataType:'json',
      contentType:'application/json',
      success : function(data) {
        console.log(data);
        if(data.c == 1000){
           window.location.href = 'custom.html?session='+session;
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })
  });
})
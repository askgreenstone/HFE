Zepto(function($){
    var session = Common.getUrlParam('session');
  
  
  $('.actmode_btn').click(function() {
    var ac = $(".actmode_inp").val();
    var data = {ad:7,ac:ac};
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
        }else if(data.c == 1046){
          alert("无效的体验码！")
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })
  });
})
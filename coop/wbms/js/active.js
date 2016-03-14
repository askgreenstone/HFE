Zepto(function($){
    var session = Common.getUrlParam('session');
  $.ajax({
      type : 'post',
      url : Common.globalDistUrl() + 'exp/QueryMicWebActivate.do?session='+ session,
      data: {},
      dataType:'json',
      contentType:'application/json',
      success : function(data) {
        console.log(data);
        if(data.c == 1000){
           if(data.as == 1 || data.as == 2){
            // alert('已激活')
              window.location.href = 'custom.html?session='+session;
          }else if(data.as == 3 || data.as == 4 ){
             // alert('已失效')
            window.location.href = 'actexpired.html?session='+session;
          }else if(data.as == 0){
            getAuthenState();
          }
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
  })
  var getAuthenState = function(){
    $.ajax({
      type : 'post',
      url : Common.globalDistUrl() + 'exp/ExpertInfo.do?session='+ session,
      data: {},
      dataType:'json',
      contentType:'application/json',
      success : function(data) {
        console.log(data);
        if(data.c == 1000){
           if(data.sts == 2){
             // alert('已认证')
            window.location.href = 'active.html?session='+session;
          }else{
             // alert('未认证')
            window.location.href = 'actmode.html?session='+session;
          }
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
  })
  }
  $('#reg_check').prop('checked',true);
  $('#active_btn').click(function() {
    var data = {ad:7};
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
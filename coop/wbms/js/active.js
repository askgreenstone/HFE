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
          // if(data.sts != 2){
          //    // console.log('未认证');
          //   window.location.href = 'actmode.html?session='+session;
          // }
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
  })
  }
  $('#reg_check').prop('checked',true);

  // 无需邀请码，激活30天试用期
  $('#active_btn').click(function() {
    var data = {ad:30};
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
  // 邀请码激活
  $('#code_btn').click(function() {
    var ac = $(".active_code").val();
    if(!ac){
      alert('请输入邀请码');
      return
    }
    var data = {ad:30,ac:ac};
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
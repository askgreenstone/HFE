Zepto(function($){
  var session = Common.getUrlParam('session');
  $('#reg_check').prop('checked',true);
  $('#active_btn').click(function(event) {
  	// var userpwd = $('#index_pwd').val(),
  	// 		userphone = $('#index_phone').val();
  	// if(!userphone){
  	// 	alert('请输入账号！');
  	// 	return;
  	// }else if(!userpwd){
  	// 	alert('请输入密码！');
  	// 	return;
  	// }
  	// api.login(userphone,userpwd,
  	// 	function(data){
  	// 		console.log(data);
  	// 		if(data.c == 1000){
  	// 			window.location.href = 'view/custom.html?session='+data.u.sid;
  	// 		}else if(data.c == 1005){
  	// 			alert('用户名或密码错误！');
  	// 		}
  	// 	},
  	// 	function(err){
  	// 		alert('网络连接错误或服务器异常！');
  	// 	}
    $.ajax({
      type : 'post',
      url : Common.globalDistUrl() + 'exp/ActivateMicWeb.do?session='+ session,
      data : '',
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
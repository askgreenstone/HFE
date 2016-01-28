// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($){
  var api =new Api();
  $('#index_submit').click(function(event) {
  	var userpwd = $('#index_pwd').val(),
  			userphone = $('#index_phone').val();
  	if(!userphone){
  		alert('请输入电话！');
  		return;
  	}else if(!userpwd){
  		alert('请输入密码！');
  		return;
  	}
  	api.login(userphone,userpwd,
  		function(data){
  			console.log(data);
  			if(data.c == 1000){
  				window.location.href = 'view/custom.html?session='+data.u.sid;
  			}else if(data.c == 1005){
  				alert('用户名或密码错误！');
  			}
  		},
  		function(err){
  			alert('网络连接错误或服务器异常！');
  		}
  	)
  });
})
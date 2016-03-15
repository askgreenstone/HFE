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
  		alert('请输入手机号码！');
  		return;
  	}else if(!userphone.match(/^1[358]{1}[0-9]{9}$/)){
      alert('手机号码格式不正确');
      return;
    }else if(!userpwd){
  		alert('请输入密码！');
  		return;
  	}
  	api.login(userphone,userpwd,
  		function(data){
  			console.log(data);
  			if(data.c == 1000){
  				window.location.href = 'view/active.html?session='+data.u.sid;
  			}else if(data.c == 1005){
  				alert('用户名或密码错误！');
  			}else if(data.c == 1002){
          alert('密码输入错误次数过多，账号被锁定，请稍后重试！');
        }
  		},
  		function(err){
  			alert('网络连接错误或服务器异常！');
  		}
  	)
  });
})
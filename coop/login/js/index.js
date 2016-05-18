// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($){
  var api =new Api();
  $('#lawyer').prop('checked',true);
  $('#index_submit').click(function(event) {
  	var userpwd = $('#index_pwd').val(),
  			userphone = $('#index_phone').val(),
        at = 1;
  	if(!userphone){
  		alert('请输入手机号码！');
  		return;
  	}else if(userphone.length != 11){
      alert('电话号码位数不正确');
      return;
    }else if(!userpwd){
  		alert('请输入密码！');
  		return;
  	}
    if($('#lawyer').prop('checked')){
      at = 1
    }else{
      at = 4
    }
    console.log(typeof at);
  	api.login(userphone,userpwd,at,
  		function(data){
  			console.log(data);
  			if(data.c == 1000){
          sessionStorage.setItem('URLOrigin','login');
  				window.location.href = Common.globalDistUrl()+'web/#/active?session='+data.u.sid;
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
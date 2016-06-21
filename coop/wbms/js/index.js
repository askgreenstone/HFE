// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($){
  var userSession = window.sessionStorage.getItem('userSession');
  var openid = Common.getUrlParam('openId');
  if(userSession){
    window.location.href = 'view/active.html?session='+userSession;
  }        
  var api =new Api();

  $('#index_register').click(function(event) {
    if(openid){
      window.location.href = 'view/register.html?openId='+openid;
    }else{
      window.location.href = 'view/register.html';
    }
  });

  $('#index_submit').click(function(event) {
  	var userpwd = $('#index_pwd').val(),
  			userphone = $('#index_phone').val();
        
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
    console.log(openid);
  	api.login(userphone,userpwd,openid,
  		function(data){
  			console.log(data);
  			if(data.c == 1000){
          window.sessionStorage.setItem('userSession',data.u.sid);
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
// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($){
  var api =new Api(),vcode;
  $('#reg_vcode').click(function(event) {
    var userphone = $('#reg_phone').val();
    if(!userphone){
      alert('请输入电话！');
      return;
    };
    api.verify(userphone,
      function(data){
        console.log(data);
        if(data.c == 1000){
          alert('验证码已发送，请注意查收！')
        }else{
          alert('网络错误，请重试！');
          window.location.href = 'register.html';
        }
      }
    )
});
  $('#reg_submit').click(function(event) {
  	var userpwd1 = $('#reg_pwd1').val(),
        userpwd2 = $('#reg_pwd2').val(),
        usrename = $('#reg_name').val(),
  			userphone = $('#reg_phone').val(),
        vcode = $('#reg_code').val();
  	if(!userphone){
  		alert('请输入电话！');
  		return;
  	}else if(!usrename){
      alert('请输入姓名！');
      return;
    }else if(!userpwd1){
  		alert('请输入密码！');
  		return;
  	}else if(!userpwd2){
      alert('请再次输入密码！');
      return;
    }else if (userpwd2 !== userpwd1) {
      alert('两次密码输入不一致！');
      return;
    }else if(!vcode){
      alert('请输入验证码！');
      return;
    }else if(!$("#reg_check").prop("checked")){
      alert('请选择阅读并接受用户协议！');
      return;
    };
  	api.register(userphone,usrename,userpwd1,vcode,
  		function(data){
  			console.log(data);
  			if(data.c == 1000){
          alert('注册成功');
  				window.location.href = 'view/custom.html?session='+data.u.sid;
  			}else if(data.c == 1001){
           alert('验证码错误！'); 
        }else{
  				alert('网络错误，请重试！');
          //window.location.href = 'register.html';
  			}
  		}
  	)
  });
})
// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($){
  var api =new Api(),vcode,timer;
  $("#reg_check").prop("checked",true);
  //获取验证码
  function regVcode(){
    var userphone = $('#reg_phone').val();
    if(!userphone){
      alert('请输入电话！');
      return;
    };
    api.verify(userphone,
      function(data){
        console.log(data);
        if(data.c == 1000){
          var count = 60;
          timer = setInterval(function(){
            count--;
            console.log(count);
            if(count > 0){
              $('#reg_vcode').val('重新获取'+count+'s');
              $('#reg_vcode').unbind('click')
            }else{
              count = 60;
              clearInterval(timer);
              $('#reg_vcode').val('获取验证码');
              $('#reg_vcode').bind('click',function(){regVcode()});
            }
          },1000);
        }else{
          alert('网络错误，请重试！');
          window.location.href = 'register.html';
        }
      }
    )
  }
  $('#reg_vcode').bind('click',function(){regVcode()});
  $('#reset_submit').bind('click',function(event) {
  	var userpwd1 = $('#reg_pwd1').val(),
        userpwd2 = $('#reg_pwd2').val(),
  			userphone = $('#reg_phone').val(),
        vcode = $('#reg_code').val();
  	if(!userphone){
  		alert('请输入电话！');
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
  	api.forgetpassword(userphone,userpwd1,vcode,
  		function(data){
  			console.log(data);
  			if(data.c == 1000){
          alert('重置成功');
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
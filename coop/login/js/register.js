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
    }else if(userphone.length != 11){
      alert('电话号码位数不正确');
      return;
    };
    api.verify(userphone,
      function(data){
        console.log(data);
        if(data.c == 1000){
          var count = 60;
          $('#reg_vcode').val('重新获取'+count+'s');
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
  $('#reg_submit').bind('click',function(event) {
  	var userpwd1 = $('#reg_pwd1').val(),
        userpwd2 = $('#reg_pwd2').val(),
        usrename = $('#reg_name').val(),
  			userphone = $('#reg_phone').val(),
        vcode = $('#reg_code').val();
  	if(!userphone || userphone.length != 11){
  		alert('电话号码格式不正确！');
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
    // 密码加密处理
    var userpwd = CryptoJS.SHA1(userpwd1).toString(CryptoJS.enc.Hex).toUpperCase();
  	api.register(userphone,usrename,userpwd,vcode,
  		function(data){
  			console.log(data);
  			if(data.c == 1000){
          alert('注册成功');
          // 返回数据只有c:1000;d:OK，所以跳转到登录页，需要重新登录
          window.location.href = '../index.html';
  				// window.location.href = 'view/custom.html?session='+data.u.sid;
  			}else if(data.c == 1001){
           alert('验证码错误！'); 
        }else if(data.c == 1004){
           alert('用户已存在，请登录'); 
           window.location.href = '../index.html';
        }else{
  				alert('网络错误，请重试！');
          //window.location.href = 'register.html';
  			}
  		}
  	)
  });
})
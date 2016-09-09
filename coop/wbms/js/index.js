// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($){
  var openid = Common.getUrlParam('openId');     
  var api =new Api();
  var isActive = false,
      isExpired = false;

  $('#index_register').click(function(event) {
    if(openid){
      window.location.href = 'view/register.html?openId='+openid;
    }else{
      window.location.href = 'view/register.html';
    }
  });

  //判断新老用户
  function getMicroState(sess){
    $.ajax({
      type : 'GET',
      url : Common.globalDistUrl() + 'exp/MicWebSetUpStatus.do?session='+ sess,
      success : function(data) {
        console.log(data);
        //判断主题制定状态：0未设置，1已设置，2已完成
        if(data.s == 0){
          if(openid){
            window.location.href = 'view/custom.html?session='+sess+'&openId='+openid;
          }else{
            window.location.href = 'view/custom.html?session='+sess;
          }
        }else{
          getIndexUrl(sess);
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })
  }

  //判断用户激活状态
  function getUserActiveState(sess){
    $.ajax({
        type : 'post',
        url : Common.globalDistUrl() + 'exp/QueryMicWebActivate.do?session='+ sess,
        data: {},
        async: false,
        dataType:'json',
        contentType:'application/json',
        success : function(data) {
          console.log(data);
          if(data.c == 1000){
             if(data.as == 1 || data.as == 2){
              // alert('已激活')
              isActive = true;
                // window.location.href = 'custom.html?session='+session;
            }else if(data.as == 3 || data.as == 4 ){
               // alert('已失效')
               isExpired = true;
              // window.location.href = 'actexpired.html?session='+session;
            }else if(data.as == 0){
              isActive = false;
            }
          }
        },
        error : function(){
          alert('网络连接错误或服务器异常！');
        }
    })
  }

  // 获取微网站地址
  function getIndexUrl(sess){
    $.ajax({
      method: 'GET',
      url: Common.globalDistUrl()+'exp/CreateMicWebQrCode.do?session='+sess,
      data: {},
      success: function(data) {
                console.log(data);
                if(data.c == 1000){
                  if(openid){
                   window.location.href = Common.globalDistUrl()+'mobile/#/'+data.theme+'?ownUri='+data.ownUri+'&sess='+sess+'&openId='+openid;
                  }else{
                   window.location.href = Common.globalDistUrl()+'mobile/#/'+data.theme+'?ownUri='+data.ownUri+'&sess='+sess;
                  }
                }
              },
      error: function(data, status, headers, config) {
          // console.log(data);
          alert('网络连接错误或服务器异常！');
      }
    })
  };


  //提交登陆
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
        var dt = Common.getUrlParam('dt');
  			if(data.c == 1000){
          if(dt == 'weblog'){
            window.location.href = '../../wechat/wxscan.html?session=' + data.u.sid;
          }else{
            // window.sessionStorage.setItem('userSession',data.u.sid);
            // window.location.href = 'view/active.html?session=' + data.u.sid;
            // getUserActiveState(data.u.sid);
            // 激活逻辑暂时关闭（乔凡）
            // if(isActive){//已激活
            //   getMicroState(data.u.sid);
            // }else if(!isActive){//未激活
            //   if(isExpired){//失效
            //     window.location.href = 'view/actexpired.html?session='+data.u.sid;
            //   }else{
            //     window.location.href = 'view/active.html?session='+data.u.sid;
            //   }
            // }
            // mws  主题定制状态  0未设置   1已设置   2已完成
            if(data.u.mws == 0){
              if(openid){
                window.location.href = 'view/custom.html?session='+data.u.sid+'&openId='+openid;
              }else{
                window.location.href = 'view/custom.html?session='+data.u.sid;
              }
            }else{
              if(openid){             
                window.location.href = Common.globalDistUrl()+'usr/ThirdHomePage.do?ownUri='+data.u.ja+'&sess='+data.u.sid+'&openId='+openid+'&ida=0';
              }else{
                window.location.href = Common.globalDistUrl()+'usr/ThirdHomePage.do?ownUri='+data.u.ja+'&sess='+data.u.sid+'&ida=0';
              }
            }
            
          }
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
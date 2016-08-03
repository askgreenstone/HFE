var openId = Common.getUrlParam('openId');
console.log(openId);




jQuery(function($){
  var api =new Api(),vcode,timer,professionArr = [],specialArr = [];
  //获取验证码
  function regVcode(){
    var userphone = $('#tel').val();
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
          timer = setInterval(function(){
            
            // console.log(count);
            if(count > 0){
              $('#regNo').css('background','#999');
              $('#regNo').html(count+' S');
              $('#regNo').unbind('click');
              count--;
            }else{
              count = 60;
              clearInterval(timer);
              $('#regNo').css('background','#5595E3');
              $('#regNo').html('验证码');
              $('#regNo').bind('click',function(){regVcode()});
            }
          },1000);
        }else{
          alert('网络错误，请重试！');
        }
      }
    )
  }
  $('#regNo').bind('click',function(){regVcode()});
    
    
  // 点击上传头像，跳转到裁切页面
  $('#wxRg_file').click(function(event) {
    var mwID = Common.getUrlParam('mwID');
    var on = Common.getUrlParam('on');
    if(on){
      window.location.href = 'ogheadbg.html?mwID='+mwID+'&on='+on+'&openId=' + openId;
    }else{
      window.location.href = 'ogheadbg.html?mwID='+mwID+'&openId=' + openId;
    }
  });



  // 获取头像
  function getHeadImg(){
    var on = Common.getUrlParam('on');
    // 待修改
    var headImg = on?Common.globalTransferUrl()+on:'../image/head.png';
    console.log(headImg);
    $('#wxRg_preview').attr('src',headImg);
  }


  //表单点击掉起键盘
  $('input').bind('click',function(){
    var dom = '<div class="addForKeyboard"></div>';
    $('body').append(dom);
  })
  //表单失去焦点清除多余dom
   $('input').bind('blur',function(){
    $('.addForKeyboard').remove();
  })

  // 表单数据提交
  $('#wxRg_next').bind('click',function(event) {
    var hi = $('#wxRg_preview').attr('src'),
        ogname = $('#ogname').val(),
        ogtel = $('#ogtel').val(),
        city = $('#city').val(),
        address = $('#address').val(),
        name = $('#name').val(),
        tel = $('#tel').val(),
        msgNo = $('#msgNo').val(),
        on = Common.getUrlParam('on'),
        mwID = Common.getUrlParam('mwID'),
        openId = Common.getUrlParam('openId'),
        data = {};
    if(hi == '../image/head.png'){
      alert('请上传头像！');
      return;
    }else if(!ogname){
      alert('请输入机构名称！');
      return;
    }else if(!ogtel){
      alert('请输入机构电话！');
      return;
    }else if(!city){
      alert('请输入机构所在城市！');
      return;
    }else if(!address){
      alert('请输入机构详细地址！');
      return;
    }else if(!name){
      alert('请输入管理员姓名！');
      return;
    }else if(!tel){
      alert('请输入管理员电话！');
      return;
    }else if(!msgNo){
      alert('请输入验证码！');
      return;
    }else{
      // 待修改
      // data = {
      //   p : on,
      //   n : name,
      //   cn : depart,
      //   mn : tel,
      //   vc : msgNo,
      //   sp : specialArr,
      //   rg : region,
      //   add : address,
      //   mwid : mwID,
      //   openId : openId 
      // }
    }
    console.log(data);
    // 1050  微网站已存在  1000生成新的微网站，跳转到个人工作室
    $.ajax({
      type : 'POST',
      url : Common.globalDistUrl() + 'exp/ExpMicroCardForMobile.do',
      data : JSON.stringify(data),
      dataType:'json',
      contentType:'application/json',
      success : function(data) {
        console.log(data);
        // 待修改
        // if(data.c == 1050){
        //   alert('工作室已存在，请登录');
        //   window.close();
        // }else if(data.c == 1051){
        //   alert('注册失败，请重试！')
        // }else if(data.c == 1001){
        //   alert('验证码不合法，请重试！');
        // }else if(data.c == 1045){
        //   alert('此用户已试用过工作室！');
        //   window.close();
        // }else if(data.c == 1000){
        //   window.location.href = Common.globalDistUrl()+'mobile/#/'+data.theme+'?ownUri='+data.ownUri+'&origin=shade';
        // }
        
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })
  })

  //初始化数据
  function initAll() {
    getHeadImg();
  }

  initAll();
})




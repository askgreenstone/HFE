var openId = Common.getUrlParam('openId');
var session = Common.getUrlParam('session');
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
    var on = Common.getUrlParam('on');
    var ida = Common.getUrlParam('ida');
    if(on){
      window.location.href = 'ogheadbg.html?on='+on+'&openId=' + openId+'&ida='+ida+'&session='+session;
    }else{
      window.location.href = 'ogheadbg.html?openId=' + openId+'&ida='+ida+'&session='+session;
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
      data = {
        p : on,
        n : name,
        cn : ogname,
        mn : tel,
        vc : msgNo,
        rg : city,
        add : address,
        ida: 1,
        ct: ogtel,
        openId : openId 
      }
    }
    console.log(data);
    var ida = Common.getUrlParam('ida');
    $.ajax({
      type : 'POST',
      url : Common.globalDistUrl() + 'exp/DeptRegister.do?session='+session,
      data : JSON.stringify(data),
      dataType:'json',
      contentType:'application/json',
      success : function(data) {
        console.log(data);
        if(data.c == 1000){
          window.location.href = 'teammanage.html?session='+session+'&keyWord='+ogname+'&ei='+data.ei+'&ida='+ida;
        }else if(data.c == 1001){
          alert('验证码错误！');
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })
  })


  function getExpInfo(){
    $.ajax({
      type : 'GET',
      url : Common.globalDistUrl() + 'exp/ExpertInfo.do?session=' + session,
      success : function(data) {
        console.log(data);
        if(data.c == 1000){
          if(!$('#name').val()){
            $('#name').val(data.n);
          }
          if(!$('#tel').val()){
            $('#tel').val(data.m);
          }
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })
  }

  //初始化数据
  function initAll() {
    getHeadImg();
    getExpInfo();
  }

  initAll();
})




var openId = Common.getUrlParam('openId');
var session = Common.getUrlParam('session');
var onHeadImg;
console.log(session);
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
    // var imgSrc = $('#wxRg_preview').attr('src');
    // var img = imgSrc == '../image/head.png'?'':imgSrc;
    // var on = Common.getUrlParam('on')?Common.getUrlParam('on'):img;
    console.log(onHeadImg);
    if(onHeadImg !== 'header.jpg'){
      window.location.href = 'wxheadbg.html?mwID='+mwID+'&on='+onHeadImg+'&openId=' + openId+'&session='+session;
    }else{
      window.location.href = 'wxheadbg.html?mwID='+mwID+'&openId=' + openId+'&session='+session;
    }
  });

  // 选中专业领域，选取框出现，遮罩层出现
  $('.wxRegister_select').click(function(){
    $('.wxRg_shadow').show();
    // $('.profession').css({'webkitTransform':'translateY(-18rem)','zIndex':'2'});
  })

  // 点击遮罩层，选取框消失
  $('.wxRg_shadow').click(function(){
    $(this).hide();
    // $('.profession').css({'webkitTransform':'translateY(21rem)','zIndex':'0'});
  })

  // 选中专业领域li，判断是否选中
  $('.profession_list li').click(function(e){
    e.stopPropagation();
    var count = $('.profession_list li.selected').length;
      if($(this).hasClass('selected')){
        $(this).removeClass('selected');
      }else{
        if(count>=3){
          alert('最多选取三个！')
        }else{
          $(this).addClass('selected');
        }
      }
  })

  
  // 点击确定获取选中专业领域
  $('#wxReg_btn').click(function(){
    var list = $('.profession_list li.selected');
    console.log(list.length);
    professionArr =[];
    specialArr = [];
    for(var i = 0; i < list.length; i++){
      professionArr.push($(list[i]).text());
      if($(list[i]).index()+1 == 26){
        specialArr.push(99);
      }else{
        specialArr.push($(list[i]).index()+1);
      }
    }
    $('.wxRg_shadow').hide();
    // $('.profession').css({'webkitTransform':'translateY(21rem)','zIndex':'0'});
    console.log(professionArr);
    console.log(specialArr);
    var text = professionArr.join(',');
    var innerText = text.length>19?text.substring(0,19)+'...':text;
    $('.wxRegister_select').text(innerText);
  })


  // 获取用户信息
  function getUsrInfo(){
    $.ajax({
      type : 'GET',
      url : Common.globalDistUrl() + 'exp/ExpertInfo.do?session='+ session,
      success : function(data) {
        console.log(data);
        if(data.c == 1000){
          $('#name').val(data.n);
          $('#depart').val(data.cn);
          $('#tel').val(data.m);
          $('#address').val(data.ad);
          var on = Common.getUrlParam('on');
          onHeadImg = on?on:(data.p?data.p:'header.jpg');
          console.log(onHeadImg);
          $('#wxRg_preview').attr('src',Common.globalTransferUrl()+onHeadImg);
          var arr = data.eil;
          var list = $('.profession_list li');
          var specialStr = [];
          if(arr){
            for(var k=0;k<3;k++){
              for(var i=0;i<list.length;i++){
                if($(list[i]).attr('data-id') == arr[k]){
                  $(list[i]).addClass('selected');
                }
              }
              var eilArr = ['公司企业','资本市场','证券期货','知识产权','金融保险','合同债务','劳动人事','矿业能源','房地产','贸易','海事海商','涉外','财税','物权','婚姻家庭','侵权','诉讼仲裁','刑事','破产','新三板','反垄断','家族财富','交通事故','医疗','人格权','其他'];
              specialStr.push(eilArr[k]);
            }
            var text = specialStr.join(',');
            var innerText = text.length>19?text.substring(0,19)+'...':text;
            $('.wxRegister_select').text(innerText);
          }
          
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })
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
        name = $('#name').val(),
        depart = $('#depart').val(),
        tel = $('#tel').val(),
        msgNo = $('#msgNo').val(),
        address = $('#address').val(),
        region = $('#region').val(),
        on = Common.getUrlParam('on'),
        mwID = Common.getUrlParam('mwID'),
        openId = Common.getUrlParam('openId'),
        data = {};
    if(hi == '../image/head.png'){
      alert('请上传头像！');
      return;
    }else if(!name){
      alert('请输入姓名！');
      return;
    }else if(!depart){
      alert('请输入单位名称！');
      return;
    }else if(!tel){
      alert('请输入电话！');
      return;
    }else if(!msgNo){
      alert('请输入验证码！');
      return;
    }else if(professionArr.length<1){
      alert('请选择专业领域！');
      return;
    }else if(!region){
      alert('请输入城市！');
      return;
    }else if(!address){
      alert('请输入地址！');
      return;
    }else{
      data = {
        p : on,
        n : name,
        cn : depart,
        mn : tel,
        vc : msgNo,
        sp : specialArr,
        rg : region,
        add : address,
        mwid : mwID,
        openId : openId 
      }
    }
    console.log(data);
    // 1050  微网站已存在  1000生成新的微网站，跳转到个人名片
    $.ajax({
      type : 'POST',
      url : Common.globalDistUrl() + 'exp/ExpMicroCardForMobile.do',
      data : JSON.stringify(data),
      dataType:'json',
      contentType:'application/json',
      success : function(data) {
        console.log(data);
        if(data.c == 1050){
          alert('名片已存在，请登录');
          window.close();
        }else if(data.c == 1051){
          alert('注册失败，请重试！')
        }else if(data.c == 1001){
          alert('验证码不合法，请重试！');
        }else if(data.c == 1045){
          alert('此用户已试用过名片！');
          window.close();
        }else if(data.c == 1000){
          window.location.href = Common.globalDistUrl()+'mobile/#/'+data.theme+'?ownUri='+data.ownUri+'&origin=shade';
        }
        
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })
  })

  //初始化数据
  function initAll() {
    var on = Common.getUrlParam('on');
    onHeadImg = on?on:'header.jpg';
    if(session){getUsrInfo()};
    console.log(onHeadImg);
    $('#wxRg_preview').attr('src',Common.globalTransferUrl()+onHeadImg);
  }

  initAll();
})




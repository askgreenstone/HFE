var session = Common.getUrlParam('session'),
    CardID = '',
    state = false,
    head = '',
    qrcode = '',
    qrindex = '';
console.log(session);


//从后台拿数据，拿到的话就回显，没有数据就为空


//微名片编辑状态：
//0  完全没有编辑过微名片
//1  已经编辑过微名片
//2  未编辑，但已经生成微名片数据（上传过头像）
//其中1和2两个状态需要走更新操作（DataUpdate），状态0走插入操作（DataInsert）




jQuery(function($){
    //初始化获取用户数据
    function getUserData() {
       $.ajax({
         type : 'get',
         url : Common.globalDistUrl() + 'exp/GetMicroCardEditStatus.do?session='+ session,
         success : function(data) {
           console.log(data);
           if(data.s == 1){
             state = true;
             $.ajax({
               type : 'get',
               url : Common.globalDistUrl() + 'exp/QueryMicroCard.do?session='+ session,
               success : function(data) {
                 console.log(data);
                 CardID = data.cId;
                 //头像判断
                 if(data.hI){
                   $('#card_box').hide();
                   $('#card_preview').show();
                   head = data.hI; 
                   $('#card_preview').attr('src',Common.globalTransferUrl() + data.hI);
                 }
                 //二维码
                 if(data.QR){
                   $('#qrcode_box').hide();
                   $('#qrcode_preview').show();
                   $('#qrcode_preview').attr('src',Common.globalTransferUrl() + data.QR);
                   if(data.QR == "onlinelaw20160314185742.jpg" || data.QR.indexOf('MicWebQRCode')>-1){
                    qrcode = qrindex;
                   }else{
                    qrcode = data.QR;
                   }
                 }

                 $('#NAME').val(data.nm);
                 $('#Depart').val(data.dp);
                 $('#Rank').val(data.rk);
                 // QRCodeImg: data.QR;
                 $('#Mobile').val(data.Mob);
                 $('#Email').val(data.eml);
                 $('#TelNo').val(data.tel);
                 $('#WebSite').val(data.web);
                 $('#Address').val(data.adr);
                 $('#Region').val(data.rg);
                 $('#Abstract').val(data.abs);
                 $('#Introduction').val(data.itd)    
               },
               error : function(){
                 alert('网络连接错误或服务器异常！');
               }
             })
           }else if(data.s == 2){
             state = true;
             setUserData();
           }else{
             state = false;
             setUserData();
           }
         },
         error : function(){
           alert('网络连接错误或服务器异常！');
         }
       });
       
    }
    function setUserData(){
      $.ajax({
       type : 'get',
       url : Common.globalDistUrl() + 'exp/QueryMicroCard.do?session='+ session,
       success : function(data) {
         console.log(data);
         CardID = data.cId;
         //头像判断
         if(data.hI){
           $('#card_box').hide();
           $('#card_preview').show();
           head = data.hI; 
           $('#card_preview').attr('src',Common.globalTransferUrl() + data.hI);
         }
         //二维码
         if(data.QR){
           $('#qrcode_box').hide();
           $('#qrcode_preview').show();
           if(data.QR == "onlinelaw20160314185742.jpg" || data.QR.indexOf('MicWebQRCode')>-1){
            qrcode = qrindex;
           }else{
            qrcode = data.QR;
           }
           $('#qrcode_preview').attr('src',Common.globalTransferUrl() + data.QR);
         }
       },
       error : function(){
         alert('网络连接错误或服务器异常！');
       }
     })
    }
    //jartto:try to preview img
    function readURL(input,preview) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            console.log(e);
              $('#'+preview).attr('src', e.target.result);
          }
          reader.readAsDataURL(input.files[0]);
      }
    }

    $('#card_file').click(function(event) {
      window.location.href = 'headbg.html?session='+session;
    });


    // 上传二维码，放掉这一部分
    // $('#qrcode_file').change(function(){
    //     $('#qrcode_box').hide();
    //     readURL(this,'qrcode_preview');
    //     $('#qrcode_preview').show();
    //     uploadQrcode();
    // });
    // function uploadQrcode() {
    //     var f = document.getElementById('qrcode_file').files[0],
    //         r = new FileReader();
    //      Common.getLoading(true);
    //     console.log(f);
    //     console.log(r);
    //     r.onloadend = function(e) {
    //         var data = e.target.result;
    //         var fd = new FormData();
    //         fd.append('ThirdUpload', f);
    //         fd.append('filename', f.name);
    //         // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6 微信分享图标
    //         $.ajax({
    //           type : 'post',
    //           url : Common.globalDistUrl() + 'exp/ThirdUpload.do?session=' + session + '&type=1',
    //           data: fd,
    //           processData: false,
    //           contentType: false,
    //           success : function(data) {
    //             Common.getLoading(false);
    //             console.log(data);
    //             qrcode = data.on;
    //           },
    //           error : function(){
    //             Common.getLoading(false);
    //             alert('网络连接错误或服务器异常！');
    //           }
    //         })
    //     };
    //     if (f) {
    //         r.readAsDataURL(f);
    //     }
    // }

    $('#card_next').click(function(){
      setBasicInfo();
    })




    // 获取首页二维码，链接
    function getQrCode(){
      $.ajax({
        method: 'GET',
        url: Common.globalDistUrl()+'exp/CreateMicWebQrCode.do?session='+session,
        data: {},
        success: function(data) {
                  console.log(data);
                  if(data.c == 1000){
                    qrindex = data.qrn;
                    // vm.qrSrc = vm.transferUrl+data.qrn+'?'+Date.parse(new Date());
                  }
                },
        error: function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            }
      })
    };
    console.log(session);

    //设置微名片信息
    function setBasicInfo (){
      console.log(head);
      console.log(qrcode);
      if(!$('#NAME').val()){
        alert("请填写您的姓名！");
        return false;
      }
      
      var userData = [
          {
            "cn": "HeadImg",
            "cv": head
          },
          {
            "cn": "NAME",
            "cv": $('#NAME').val()
          },
          {
            "cn": "Depart",
            "cv": $('#Depart').val()
          },
          {
            "cn": "Rank",
            "cv": $('#Rank').val()
          },
          {
            "cn": "QRCodeImg",
            "cv": qrcode
          },
          {
            "cn": "Mobile",
            "cv": $('#Mobile').val()
          },
          {
            "cn": "Email",
            "cv": $('#Email').val()
          },
          {
            "cn": "TelNo",
            "cv": $('#TelNo').val()
          },
          {
            "cn": "WebSite",
            "cv": $('#WebSite').val()
          },
          {
            "cn": "Address",
            "cv": $('#Address').val()
          },
          {
            "cn": "Region",
            "cv": $('#Region').val()
          },
          {
            "cn": "Address_srh",
            "cv": $('#Address').val()
          },
          {
            "cn": "Abstract",
            "cv": $('#Abstract').val()
          },
          {
            "cn": "Introduction",
            "cv": $('#Introduction').val()
          }
      ];
      
      console.log(userData);
      if(state){ 
        var fd = {
          "tn": "jlt_expmicrocard",
          "cols": userData,
          "cds":[{
            "cn": "CardID",
            "cv": CardID
          }]
        };
        Common.getLoading(true);
        $.ajax({
          type : 'post',
          url : Common.globalDistUrl() + 'exp/DataUpdate.do?session='+ session,
          data : JSON.stringify(fd),
          dataType:'json',
          contentType:'application/json',
          success : function(data) {
            console.log(data);
            if(data.c == 1000){
               Common.getLoading();
               window.location.href = 'share.html?session='+session;
            }
          },
          error : function(){
            Common.getLoading();
            alert('网络连接错误或服务器异常！');
          }
        })
      }else{
        var fd = {
          "tn": "jlt_expmicrocard",
          "cols": userData
        };
        $.ajax({
          type : 'post',
          url : Common.globalDistUrl() + 'exp/DataInsert.do?session='+ session,
          data : JSON.stringify(fd),
          dataType:'json',
          contentType:'application/json',
          success : function(data) {
            console.log(data);
            if(data.c == 1000){
              Common.getLoading();
              window.location.href = 'share.html?session='+session;
            }
          },
          error : function(){
            Common.getLoading();
            alert('网络连接错误或服务器异常！');
          }
        })
      }
    }
    //初始化数据
    function initAll() {
      getQrCode();
      getUserData();
       
    }

    initAll();
})




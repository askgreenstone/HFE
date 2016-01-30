var session = Common.getUrlParam('session'),
    globalUrl = Common.globalDistUrl(),
    CardID = '',
    state = false;
console.log(session);
console.log(globalUrl);


//从后台拿数据，拿到的话就回显，没有数据就为空
//globalUrl  待处理
//头像二维码 待处理
Zepto(function($){

    //初始化判断状态
    $.ajax({
      type : 'get',
      url : globalUrl + 'exp/GetMicroCardEditStatus.do?session='+ session,
      success : function(data) {
        console.log(data);
        if(data.s == 1){
          state = true;
          $.ajax({
            type : 'get',
            url : globalUrl + '/exp/QueryMicroCard.do?session='+ session,
            success : function(data) {
              console.log(data);
              CardID = data.cId;
              // HeadImg: data.hI;
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
        }else {
          state = false;
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    });
    
    //头像（不需裁切处理）

    function uploadHead() {
        var f = document.getElementById('head').files[0],
            r = new FileReader();
        // Common.getLoading(true);
        console.log(f);
        console.log(r);
        r.onloadend = function(e) {
            var data = e.target.result;
            console.log(data);
            var fd = new FormData();
            fd.append('ThirdUpload', f);
            fd.append('filename', f.name);
            console.log(fd);
            // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6 微信分享图标
            $.ajax({
              type : 'post',
              url : globalUrl + 'exp/ThirdUpload.do?session=' + session + '&type=2',
              data : fd,
              success : function(data) {
                console.log(data);
                // vm.user.QRCodeImg = data.on;
                // vm.isQrcodeUpload = true;
                // setTimeout(function(){
                //   Common.getLoading(false);
                // }, 300);
              },
              error : function(){
                alert('网络连接错误或服务器异常！');
              }
            })
        };
        r.readAsDataURL(f);
    }


    //二维码（不需裁切处理）

    function uploadQrcode() {
        var f = document.getElementById('head').files[0],
            r = new FileReader();
        // Common.getLoading(true);
        console.log(f);
        console.log(r);
        r.onloadend = function(e) {
            var data = e.target.result;
            var fd = new FormData();
            fd.append('ThirdUpload', f);
            fd.append('filename', f.name);
            // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6 微信分享图标
            $.ajax({
              type : 'post',
              url : globalUrl + '/exp/ThirdUpload.do?session=' + session + '&type=1',
              data : fd,
              success : function(data) {
                console.log(data);
                // vm.user.QRCodeImg = data.on;
                // vm.isQrcodeUpload = true;
                // setTimeout(function(){
                //   Common.getLoading(false);
                // }, 300);
              },
              error : function(){
                alert('网络连接错误或服务器异常！');
              }
            })
        };
        r.readAsDataURL(f);
    }


    //设置微名片信息
    function setBasicInfo (){
      // if(!vm.isHeadUpload){
      //   alert("请上传头像！");
      //   return false;
      // }

      // if(!vm.isQrcodeUpload){
      //   alert("请上传二维码！");
      //   return false;
      // }

      if(!$('#NAME').val()){
        alert("请填写您的姓名！");
        return false;
      }


      if(!$('#Depart').val()){
        alert("请填写您的律所！");
        return false;
      }

      if(!$('#Mobile').val()){
        alert("请填写您的电话！");  
        return false;
      }

      if(!$('#Email').val()){
        alert("请填写您的邮箱！");
        return false; 
      }

      if(!$('#TelNo').val()){
        alert("请填写您的座机！");
        return false;
      }

      if(!$('#WebSite').val()){
        alert("请填写您的网址！");
        return false;
      }

      if(!$('#Region').val()){
        alert("请填写您的区域位置！");
        return false;
      }

      if(!$('#Address').val()){
        alert("请填写您的地址！");
        return false;
      }

      if(!$('#Abstract').val()){
        alert("请填写您的简介！");
        return false;
      }

      if(!$('#Introduction').val()){
        alert("请填写您的专业领域！");
        return false;
      }

      var userData = [
          {
            "cn": "HeadImg",
            "cv": "abc.png"
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
            "cv": "abc.png"
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
        $.ajax({
          type : 'post',
          url : globalUrl + '/exp/DataUpdate.do?session='+ session,
          data : fd,
          success : function(data) {
            console.log(data);
            if(data.c == 1000){
              window.location.href = 'share.html?session='+session;
            }
          },
          error : function(){
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
          url : globalUrl + '/exp/DataInsert.do?session='+ session,
          data : fd,
          success : function(data) {
            console.log(data);
            if(data.c == 1000){
              window.location.href = 'share.html?session='+session;
            }
          },
          error : function(){
            alert('网络连接错误或服务器异常！');
          }
        })
      }
    }

    //上传按钮
    $("#head").next().click(function(){
      uploadQrcode();
    })
})




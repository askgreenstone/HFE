
var ownUri = Common.getUrlParam('ownuri'),
    globalUrl = Common.getGlobalUrl();
// console.log(ownUri);
// console.log(globalUrl);
//二维码（不需裁切处理）

function uploadQrcode() {
    var f = document.getElementById('qrcode').files[0],
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
          url : globalUrl + '/exp/ThirdUpload.do?ownuri=' + ownuri + '&type=1',
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
        $.ajax(GlobalUrl + '/exp/ThirdUpload.do?ownuri=' + ownuri + '&type=1', fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })
        .success(function(data) {
            console.log(data);
            // vm.user.QRCodeImg = data.on;
            // vm.isQrcodeUpload = true;
            // setTimeout(function(){
            //   Common.getLoading(false);
            // }, 300);
        })
        .error(function() {
            // console.log('error');
            alert('网络连接错误或服务器异常！');
        });
    };
    // r.readAsDataURL(f);
}
var selectQrcode = function(){
  uploadQrcode();
}


//设置微名片信息
var setBasicInfo = function(){
  //验证电话格式正确//验证邮箱格式正确//验证所有信息必须填写//提交到数据库保存
  var regExpTel = /(0?1[358]\d{9})$/,
      regExpEmail = /^\w+@[\da-z]+\.(com|cn|edu|net|com.cn)$/,
      regExpTelNo = /(\d{3,4}-)?\d{7,8}/;
  vm.user.Address_srh = vm.user.Address;
  if(!vm.isHeadUpload){
    alert("请上传头像！");
    return false;
  }

  if(!vm.isQrcodeUpload){
    alert("请上传二维码！");
    return false;
  }

  if(!$('#NAME').val()){
    alert("请填写您的姓名！");
    return false;
  }else if(vm.user.NAME.length>9){
    alert("姓名长度不能超过九位！"); 
    return false;
  }

  if(!vm.user.Depart){
    alert("请填写您的律所！");
    return false;
  }else if(vm.user.Depart.length>12){
    alert("律所长度不能超过十二位！"); 
    return false;
  }

  if(!vm.user.Rank){
    alert("请填写您的职务！");
    return false;
  }else if(vm.user.Rank.length>12){
    alert("职务长度不能超过十二位！"); 
    return false;
  }

  if(!vm.user.Mobile){
    alert("请填写您的电话！");  
    return false;
  }else if(!vm.user.Mobile.match(regExpTel)){
      alert("电话格式不正确！");
      return false;
  }

  if(!vm.user.Email){
    alert("请填写您的邮箱！");
    return false; 
  }

  if(!vm.user.TelNo){
    alert("请填写您的座机！");
    return false;
  }

  if(!vm.user.WebSite){
    alert("请填写您的网址！");
    return false;
  }else if(!vm.user.WebSite.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g)){
    alert("网址格式不正确！")
    return false;
  }

  if(!vm.user.Address){
    alert("请填写您的地址！");
    return false;
  }else if(vm.user.Address.length>30){
    alert("地址长度不能超过三十位！"); 
    return false;
  }

  if(!vm.user.Abstract){
    alert("请填写您的简介！");
    return false;
  }else if(vm.user.Abstract.length>140){
    alert("简介长度不能超过一百四十位！"); 
    return false;
  }

  if(!vm.user.Introduction){
    alert("请填写您的专业领域！");
    return false;
  }else if(vm.user.Depart.length>100){
    alert("专业领域长度不能超过一百位！"); 
    return false;
  }

  if(vm.state == "do"){
    var fd = {
      "tn": "jlt_expmicrocard",
      "cols": [],
      "cds":[{
        "cn": "CardID",
        "cv": vm.CardID
      }]
    };
    for (var k in vm.user){
      fd.cols.push({"cn":k,"cv":vm.user[k]})
    };
    console.log(fd);
    $http({
        method: 'POST',
        url: GlobalUrl+'/exp/DataUpdate.do?session='+vm.sess,
        params: {
        },
        data: fd
      }).
      success(function(data, status, headers, config) {
          console.log(data);
          if(data.c == 1000){
            $window.location.href = '#/card2?session='+vm.sess;
          }else if(data.c == 1037){
            console.log("该用户微名片信息已存在，走update接口")
          }
      }).
      error(function(data, status, headers, config) {
          // console.log(data);
          alert('网络连接错误或服务器异常！');
      });
  }else{
    var fd = {
      "tn": "jlt_expmicrocard",
      "cols": []
    };
    for (var k in vm.user){
      fd.cols.push({"cn":k,"cv":vm.user[k]})
    };
    console.log(fd);
    $http({
        method: 'POST',
        url: GlobalUrl+'/exp/DataInsert.do?session='+vm.sess,
        params: {
        },
        data: fd
      }).
      success(function(data, status, headers, config) {
          console.log(data);
          if(data.c == 1000){
            $window.location.href = '#/card2?session='+vm.sess;
          }
      }).
      error(function(data, status, headers, config) {
          // console.log(data);
          alert('网络连接错误或服务器异常！');
      });
  }
}
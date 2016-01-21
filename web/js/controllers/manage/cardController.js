'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var CardController = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        var curw = 0;
        var curh = 0;
        vm.userBg = '';
        vm.transferUrl = TransferUrl;
        vm.isServerData = false;//服务器端数据还是本地上传
        vm.hiddenInitImg = false;//裁图初始化之后置为true
        vm.preview = '';
        vm.isHeadUpload = false;
        vm.isQrcodeUpload = false;
        vm.head = '';
        vm.user = {
          HeadImg: '',
          NAME: '',
          Depart: '',
          Rank: '',
          QRCodeImg: '',
          Mobile: '',
          Email: '',
          TelNo: '',
          WebSite: '',
          Region: '',
          Address: '',
          Address_srh: '',
          Abstract: '',
          Introduction: ''
        };
        vm.CardID = '';
        vm.tempImageUrl = '';
        vm.tempImageQr = '';

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.resetCard = function(){
            $window.location.href = '#/card?session='+vm.sess+'&state=do';
        }

        //从后台拿数据，拿到的话就回显，没有数据就为空//
        vm.checkCardState = function(){
          if(vm.state == 'do'){
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryMicroCard.do?session='+vm.sess
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.Mob == ''){
                  vm.CardID = data.cId;
                  // alert(vm.CardID);
                  $window.location.href = '#/card?session='+vm.sess+'&state=undo';
                }else{
                  vm.CardID = data.cId;
                  // alert(vm.CardID);
                  $window.location.href = '#/card?session='+vm.sess+'&state=do';
                  vm.user = {
                    HeadImg: data.hI,
                    NAME: data.nm,
                    Depart: data.dp,
                    Rank: data.rk,
                    QRCodeImg: data.QR,
                    Mobile: data.Mob,
                    Email: data.eml,
                    TelNo: data.tel,
                    WebSite: data.web,
                    Address: data.adr,
                    Region: data.rg,
                    Address_srh: data.adr,
                    Abstract: data.abs,
                    Introduction: data.itd
                  }
                  vm.choosePic = data.hI;
                  vm.isServerData = true;
                  vm.head = vm.transferUrl+vm.HeadImg;
                  setTimeout(function() {
                    vm.initCropper();
                    vm.isHeadUpload = true;
                    vm.isQrcodeUpload = true;
                  }, 300);
                  // console.log(vm.user);
                  // vm.uploadFile();
                  // vm.uploadQrcode();
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            }); 
          } else{
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryMicroCard.do?session='+vm.sess
            }).
            success(function(data, status, headers, config) {
              console.log(data);
              vm.CardID = data.cId; 
              // alert(vm.CardID);
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            }); 
            $http({
                  method: 'GET',
                  url: GlobalUrl+'/exp/GetMicroCardEditStatus.do?session='+vm.sess
              }).
              success(function(data, status, headers, config) {
                  console.log(data);
                  // 状态码  0  未完成  1  已完成
                  if(data.s == 0){
                    $window.location.href = '#/card?session='+vm.sess;
                    vm.head = 'image/placeholder.png';
                    setTimeout(function(){
                      vm.initCropper()
                    },300)
                  }else if(data.s == 1){
                    $window.location.href = '#/card3?session='+vm.sess;
                  }
              }).
              error(function(data, status, headers, config) {
                  // console.log(data);
                  alert('网络连接错误或服务器异常！');
              }); 
          }
        }
       
        // 图片裁切
        vm.initCropper = function() {
          vm.hiddenInitImg = true;
            $('#themeCropper').cropper({
                aspectRatio: 1 / 1,
                preview: '#img_preview',
                crop: function(e) {
                    // Output the result data for cropping image.
                    // console.log(e.x);
                    // console.log(e.y);
                    // console.log(e.width);
                    // console.log(e.height);
                    // console.log(e.rotate);
                    // console.log(e.scaleX);
                    // console.log(e.scaleY);
                    vm.imgx = Math.round(e.x);
                    vm.imgy = Math.round(e.y);
                    vm.imgh = Math.round(e.height);
                    vm.imgw = Math.round(e.width);
                },
                cropend:function(){
                  var cropDatas = $(this).cropper('getData');
                  console.log(cropDatas);
                  curw = Math.round(cropDatas.width);
                  curh = Math.round(cropDatas.height);
                  console.log('width,height:'+curw+curh);
                }
            });
            var $choose_file = $('#choose_file'),
                URL = window.URL || window.webkitURL,
                blobURL;
            if (URL) {
                $choose_file.change(function() {
                    var files = this.files,
                        file;

                    if (files && files.length) {
                        file = files[0];

                        if (/^image\/\w+$/.test(file.type)) {
                            blobURL = URL.createObjectURL(file);
                            $('#themeCropper').one('built.cropper', function() {
                                URL.revokeObjectURL(blobURL); // Revoke when load complete
                            }).cropper('reset').cropper('replace', blobURL);
                        } else {
                            alert('请选择图片文件！');
                        }
                    }
                });
            } else {
                
            }
        }

        vm.uploadFile = function() {
          console.log('w,h,x,y:'+vm.imgw,vm.imgh,vm.imgx,vm.imgy);
            var f = document.getElementById('choose_file').files[0],
                r = new FileReader();
            // console.log('f,r:'+f,r);
            if(!f){
              if(!vm.isServerData){
                alert('请先选择图片！');
                return;
              }
              else{
                vm.clipSourceImg(vm.choosePic);
                $('#themeCropper').cropper('destroy');
                return;
              }
            }
            //gif图片不被裁切
            if(f.type.toString().toLowerCase().indexOf('gif')>-1){
              alert('暂不支持gif！');
              return;
            }
            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('ThirdUpload', f);
                fd.append('filename', f.name);
                fd.append('w', vm.imgw);
                fd.append('h', vm.imgh);
                fd.append('x', vm.imgx);
                fd.append('y', vm.imgy);
                console.log(fd);
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo
                $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=2', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    console.log(data);
                    vm.user.HeadImg = data.on;
                    vm.head = vm.transferUrl+vm.HeadImg;
                    // $('#themeCropper').cropper('destroy');
                })
                .error(function() {
                    // console.log('error');
                    alert('网络连接错误或服务器异常！');
                });
            };
            r.readAsDataURL(f);
        }

        //二维码（不需裁切处理）
        vm.uploadQrcode = function() {
            var f = document.getElementById('step5_upload').files[0],
                r = new FileReader();
            if (!f) return;
            Common.getLoading(true);
            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('ThirdUpload', f);
                fd.append('filename', f.name);
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6 微信分享图标
                $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=1', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    console.log(data);
                    vm.user.QRCodeImg = data.on;
                    vm.isQrcodeUpload = true;
                    setTimeout(function(){
                      Common.getLoading(false);
                    }, 300);
                })
                .error(function() {
                    // console.log('error');
                    alert('网络连接错误或服务器异常！');
                });
            };
            r.readAsDataURL(f);
        }
        //裁切素材
        vm.clipSourceImg = function(name){
          console.log('name:'+name);
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/UpdateMicWebImgs.do',
                params: {
                    session:vm.sess
                },
                data: {
                    in:name,
                    it:3,
                    w:vm.imgw,
                    h:vm.imgh,
                    x:vm.imgx,
                    y:vm.imgy
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  console.log('clipSourceImg success');
                  vm.user.HeadImg = data.in;
                  vm.head = vm.transferUrl+vm.HeadImg;
                  setTimeout(function() {
                    vm.initCropper();
                  }, 300);
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        }



         vm.setBasicInfo = function(){
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

          if(!vm.user.NAME){
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
          }else if(!vm.user.Email.match(regExpEmail)){
            alert("邮箱格式不正确!");
            return false;
          }

          if(!vm.user.TelNo){
            alert("请填写您的座机！");
            return false;
          }else if(!vm.user.TelNo.match(regExpTelNo)){
            alert("座机格式不正确！"); 
            return false;
          }

          if(!vm.user.WebSite){
            alert("请填写您的网址！");
            return false;
          }else if(vm.user.WebSite.length>30){
            alert("网址长度不能超过三十位！"); 
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
       
        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.state = Common.getUrlParam('state');
          vm.checkCardState();
        }
        init();
    };

    CardController.$inject = injectParams;

    app.register.controller('CardController', CardController);

});

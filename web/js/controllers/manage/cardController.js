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
        vm.preview = '',
        vm.isHeadUpload = false,
        vm.isQrcodeUpload = false,
        vm.head = '';

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };
        //检测微名片编辑状态，已完成跳转预览，未完成跳转填写资料页面
        vm.checkCardState = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/GetMicroCardEditStatus.do?session='+vm.sess
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              // 状态码  0  未完成  1  已完成
              if(data.s == 1){
                $window.location.href = '#/card?session='+vm.sess;
              }else if(data.s == 0){
                $window.location.href = '#/card3?session='+vm.sess;
              }
          }).
          error(function(data, status, headers, config) {
              console.log(data);
          }); 
        }
        // 图片裁切
        vm.initCropper = function() {
          vm.hiddenInitImg = true;
            $('#themeCropper').cropper({
                aspectRatio: 1,
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
                  // curw = Math.round(cropDatas.width);
                  // curh = Math.round(cropDatas.height);
                  // $('#test').text('背景预览(宽：'+curw+'，高：'+curh+')');
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
        //上传头像（裁切处理）
        vm.uploadFile = function() {
          //console.log('w,h,x,y:'+vm.imgw,vm.imgh,vm.imgx,vm.imgy);
            var f = document.getElementById('choose_file').files[0],
                r = new FileReader();
            
            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('ThirdUpload', f);
                fd.append('filename', f.name);
                fd.append('w', vm.imgw);
                fd.append('h', vm.imgh);
                fd.append('x', vm.imgx);
                fd.append('y', vm.imgy);
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo
                $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=2', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    console.log(data);
                    vm.head = data.on;
                    vm.isHeadUpload =true;
                })
                .error(function() {
                    console.log('error');
                });
            };
            r.readAsDataURL(f);
        }
        //二维码（不需裁切处理）
        vm.uploadQrcode = function() {
            var f = document.getElementById('step5_upload').files[0],
                r = new FileReader();
            if (!f) return;
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
                    vm.preview = data.on;
                    vm.isQrcodeUpload = true;
                })
                .error(function() {
                    console.log('error');
                });
            };
            r.readAsDataURL(f);
        }

        vm.setBasicInfo = function(){
          var inputs = $("input[type='text']"),
              textarea = $("textarea");
          
          //验证电话格式正确//验证邮箱格式正确//验证所有信息必须填写//提交到数据库保存
          var regExpTel = /(0?1[358]\d{9})$/,
              regExpEmail = /^\w+@[\da-z]+\.(com|cn|edu|net|com.cn)$/;
          if(!vm.isHeadUpload){
            alert("请上传头像！");
          }else if(!vm.isQrcodeUpload){
            alert("请上传二维码！");
          }else if(!$.trim($("#name").val())){
            alert("请填写您的姓名！");
          }else if(!$.trim($("#firm").val())){
            alert("请填写您的律所！");
          }else if(!$.trim($("#post").val())){
            alert("请填写您的职务！");
          }else if(!$.trim($("#tel").val())){
            alert("请填写您的电话！");  
          }else if(!$.trim($("#tel").val()).match(regExpTel)){
              alert("电话格式不正确！");
          }else if(!$.trim($("#email").val())){
            alert("请填写您的邮箱！"); 
          }else if(!$.trim($("#email").val()).match(regExpEmail)){
            alert("邮箱格式不正确!");
          }else if(!$.trim($("#fax").val())){
            alert("请填写您的传真！");
          }else if(!$.trim($("#website").val())){
            alert("请填写您的网址！");
          }else if(!$.trim($("#address").val())){
            alert("请填写您的地址！");
          }else if(!$.trim($("#intro").val())){
            alert("请填写您的简介！");
          }else if(!$.trim($("#profess").val())){
            alert("请填写您的专业领域！");
          }else{
            var fd = {
              "tn": "jlt_expmicrocard",
              "cols": [
                {
                  "cn": "HeadImg",
                  "cv": vm.head
                },
                {
                  "cn": "NAME",
                  "cv": $.trim($("#name").val())
                },
                {
                  "cn": "Depart",
                  "cv": $.trim($("#firm").val())
                },
                {
                  "cn": "Rank",
                  "cv": $.trim($("#post").val())
                },
                {
                  "cn": "QRCodeImg",
                  "cv": vm.preview
                },
                {
                  "cn": "Mobile",
                  "cv": $.trim($("#tel").val())
                },
                {
                  "cn": "Email",
                  "cv": $.trim($("#email").val())
                },
                {
                  "cn": "TelNo",
                  "cv": $.trim($("#fax").val())
                },
                {
                  "cn": "WebSite",
                  "cv": $.trim($("#website").val())
                },
                {
                  "cn": "Address",
                  "cv": $.trim($("#address").val())
                },
                {
                  "cn": "Abstract",
                  "cv": $.trim($("#intro").val())
                },
                {
                  "cn": "Introduction",
                  "cv": $.trim($("#profess").val())
                }
              ]
            };
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
                  console.log(data);
              });
          }
        }
       
        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.checkCardState();
          vm.initCropper();
          vm.preview = '750F02EADCF5428CE9BE09D481E38D8B_W1_H1_S0.png';
        }
        init();
    };

    CardController.$inject = injectParams;

    app.register.controller('CardController', CardController);

});

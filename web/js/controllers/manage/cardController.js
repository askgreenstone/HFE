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
        vm.isInputFill = false,
        vm.isTextFill = false,
        vm.isTelNum = false,
        vm.isEmail = false;

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

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
                    
                })
                .error(function() {
                    console.log('error');
                });
            };
            r.readAsDataURL(f);
        }
        vm.getServerBg = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/GetMicWebImgs.do',
                params: {
                    session:vm.sess
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  //后台数据标示
                  vm.isServerData = true;
                  if(data.bi){
                    vm.userBg = TransferUrl+data.bi;
                    vm.choosePic = data.bi;
                  }else{
                    vm.userBg = 'image/placeholder.png';
                  }

                  //延迟初始化裁图插件
                  setTimeout(function() {
                    vm.initCropper();
                  }, 300);
                  
                  // console.log(vm.userBg);
                }
            }).
            error(function(data, status, headers, config) {
                console.log('error:'+data);
            });
        }
        //二维码
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
              console.log(inputs.length);
              console.log(textarea.length);
          //验证所有input不能为空
          for (var k in inputs){
            if($.trim(inputs[k].val()) != ""){
              vm.isInputFill = true;
            }
          }
          //验证textare不能为空
          for (var m in textarea){
            if($.trim(textarea[m].val()) != ""){
              vm.isTextFill = true;
            }
          }
          //验证电话格式正确//验证邮箱格式正确
          var regExpTel = /(0?1[358]\d{9})$/,
              regExpEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
          
          
          
          if(!vm.isInputFill || !vm.isTextFill){
            alert("请完善您的个人信息")
          }else if(!$.trim($("#tel").val()).match(regExpTel)){
            alert("电话格式不正确");
            console.log($.trim($("#tel").val()));
          }else if(!$.trim($("#tel").val()).match(regExpEmail)){
            alert("邮箱格式不正确")
          }
        }
       
        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.checkCardState();
          vm.initCropper();
          vm.getServerBg();
        }

        init();
    };

    CardController.$inject = injectParams;

    app.register.controller('CardController', CardController);

});

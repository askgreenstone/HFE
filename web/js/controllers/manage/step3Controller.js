'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Step3Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        var curw = 0;
        var curh = 0;
        vm.userLogo = '';
        vm.transferUrl = TransferUrl;
        vm.isServerData = false;//服务器端数据还是本地上传
        vm.hiddenInitImg = false;//裁图初始化之后置为true
        vm.selectChange = '';
        vm.goToNext = true;
        vm.OwnerUri = '';
        vm.logoState = false;   //logo存在为true，不存在为false 

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        //重新订制新加参数from，上一步按钮隐藏标示
        vm.resetStep = function(path,from){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&from='+from;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        // 图片裁切
        vm.initCropper = function() {
          vm.hiddenInitImg = true;
            $('#step3Cropper').cropper({
                aspectRatio: 1 / 1,
                preview: '#img_preview',
                // viewMode:1,
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
                  $('#test').text('logo预览(宽：'+curw+'，高：'+curh+')');
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
                            $('#step3Cropper').one('built.cropper', function() {
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


        vm.gotoUpload = function(){
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
                            console.log(file);
                            vm.uploadLogo();
                            vm.getLocationUrl();
                            // $('#userLogo').attr('src',file);
                        } else {
                            alert('请选择图片文件！');
                        }
                    }
                });
            } else {
                
            }
        }


        vm.uploadLogo = function() {
            var f = document.getElementById('choose_file').files[0],
                r = new FileReader();
            if (!f){
              alert('请先选择文件！');
              return;
            } 

            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('ThirdUpload', f);
                fd.append('filename', f.name);
                console.log(fd);
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6 微信分享图标
                $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=5', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    console.log(data);
                    // vm.user.QRCodeImg = data.on;
                    // vm.isQrcodeUpload = true;
                    vm.userLogo = vm.transferUrl+data.on;
                    vm.logoState = true;
                    vm.selectChange = '更换logo';
                    vm.goToNext = false;
                })
                .error(function() {
                    // console.log('error');
                    alert('网络连接错误或服务器异常！');
                });
            };
            r.readAsDataURL(f);
        }



        // 清除logo
        vm.clearLogo = function(){
          var fd = {
                "tn": "jlt_micwebinfo",
                "cds": [{
                  "cn": "OwnerUri",
                  "cv": vm.OwnerUri
                }],
                "cols": [{
                  "cn": "MicLogo",
                  "cv": ""
                }]
              }
          console.log(fd);
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/DataUpdate.do?session='+vm.sess,
                params: {},
                data: fd
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.getServerLogo();
                  vm.getLocationUrl();
                }
            }).
            error(function(data, status, headers, config) {
                // console.log('error:'+data);
                alert('网络连接错误或服务器异常！');
            });
        }

          

        
        //查询用户上传logo
        vm.getServerLogo = function(){
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
                  if(data.l){
                    vm.userLogo = TransferUrl+data.l;
                    vm.choosePic = data.l;
                    vm.selectChange = '更换logo';
                    vm.goToNext = false;
                    vm.logoState = true;
                  }else{
                    vm.userLogo = 'image/placeholder.png';
                    vm.choosePic = '';
                    vm.selectChange = '选择logo';
                    vm.logoState = false;
                  }

                  //延迟初始化裁图插件
                  // setTimeout(function() {
                  //   vm.initCropper();
                  // }, 300);
                  
                  // console.log(vm.userBg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log('error:'+data);
                alert('网络连接错误或服务器异常！');
            });
        }
        // function readURL(input,preview) {
        //   if (input.files && input.files[0]) {
        //       var reader = new FileReader();
        //       reader.onload = function (e) {
        //         console.log(e);
        //           $('#'+preview).attr('src', e.target.result);
        //       }
        //       reader.readAsDataURL(input.files[0]);
        //   }
        // }



        // $('#choose_file').change(function(){
        //     readURL(this,'card_preview');
        //     $('#card_preview').show();
        //     // uploadHead();
        // });

        //it:1背景图，it:2logo
        // vm.chooseSourceBg = function(name){
        //   vm.choosePic = name;
          
        //   vm.userBg = TransferUrl+name;
        //   $('#step3Cropper').cropper('destroy');
        //   console.log('userBg:'+vm.userBg);
        //   //延迟初始化裁图插件
        //   setTimeout(function() {
        //     vm.initCropper();
        //   }, 300);
        //   vm.isServerData = true;
        // }

        //裁切素材
        vm.clipSourceImg = function(name){
          Common.getLoading(true);
          console.log('name:'+name);
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/UpdateMicWebImgs.do',
                params: {
                    session:vm.sess
                },
                data: {
                    in:name,
                    it:2,
                    w:vm.imgw,
                    h:vm.imgh,
                    x:vm.imgx,
                    y:vm.imgy
                }
            }).
            success(function(data, status, headers, config) {
                Common.getLoading(false);
                console.log(data);
                if(data.c == 1000){
                  console.log('clipSourceImg success');
                }
            }).
            error(function(data, status, headers, config) {
                Common.getLoading(false);
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        }

        vm.getLocationUrl = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/CreateMicWebQrCode.do',
                params: {
                    session:vm.sess
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  // vm.qrSrc = vm.transferUrl+data.qrn+'?'+Date.parse(new Date());
                  // vm.inputUrl = data.url;
                  vm.OwnerUri = data.ownUri;
                  $('#iframe_src').empty();
                  $('#iframe_src').append('<iframe  src="'+data.url+'" width="320" height="545"></iframe>');

                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.getServerLogo();
          vm.getLocationUrl();
          // vm.getSourceImage();
        }

        init();
    };

    Step3Controller.$inject = injectParams;

    app.register.controller('Step3Controller', Step3Controller);

});

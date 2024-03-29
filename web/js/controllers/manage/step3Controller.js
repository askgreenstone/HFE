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
        vm.selectChange = '上传logo';
        vm.goToNext = true;
        vm.OwnerUri = '';
        vm.logoState = false;   //logo存在为true，不存在为false 
        vm.isDeptAdmin = true;
        vm.isHenanAdmin = false;

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        //   跳转到文件列表页  doctype1微课堂：2文件；3通知
        vm.menuLink = function(path,type){
          if(type){
            $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida+'&dt='+type;
          }else{
            $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
          }
        }

        //重新订制新加参数from，上一步按钮隐藏标示
        vm.resetStep = function(path,from){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&from='+from+'&ida='+ida;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.checkUsrOrOrg = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/ExpertInfo.do',
              params: {
                  session:vm.sess
              },
              data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  if(data.ida == 1){
                    vm.isDeptAdmin = true;
                    vm.orgOrPer = 'orgOrPer';
                  }else{
                    vm.isDeptAdmin = false;
                    vm.orgOrPer = 'orgNotExist';
                  }
                  // 河南律协添加上传视频
                  if(data.uri.indexOf('e24931') > -1){
                    vm.isHenanAdmin = true;
                  }
                  vm.headImg = data.p?(vm.transferUrl+ data.p):vm.transferUrl+'header.jpg';;
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

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
                            // vm.getLocationUrl();
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
            Common.getLoading(true);
            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('ThirdUpload', f);
                fd.append('filename', f.name);
                console.log(fd);
                var url;
                // 乔凡  添加status＝complete控制工作室定制状态为完成
                if(vm.origin){
                    url = GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=5'+'&ida='+vm.ida+'&status=complete';
                }else{
                    url = GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=5'+'&ida='+vm.ida;
                }
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6 微信分享图标
                $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    console.log(data);
                    Common.getLoading(false);
                    // vm.user.QRCodeImg = data.on;
                    // vm.isQrcodeUpload = true;
                    vm.userLogo = vm.transferUrl+data.on;
                    vm.logoState = true;
                    vm.selectChange = '更换logo';
                    vm.goToNext = false;
                    vm.getLocationUrl();
                })
                .error(function() {
                    // console.log('error');
                    Common.getLoading(false);
                    alert('系统开了小差，请刷新页面');
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
                url: GlobalUrl+'/exp/DataUpdate.do?session='+vm.sess+'&ida='+vm.ida,
                params: {},
                data: fd
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.getServerLogo();
                  // vm.getLocationUrl();
                }
            }).
            error(function(data, status, headers, config) {
                // console.log('error:'+data);
                alert('系统开了小差，请刷新页面');
            });
        }

          

        
        //查询用户上传logo
        vm.getServerLogo = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/GetMicWebImgs.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
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
                    vm.getLocationUrl();
                  }else{
                    vm.userLogo = 'image/placeholder.png';
                    vm.choosePic = '';
                    vm.selectChange = '上传logo';
                    vm.logoState = false;
                    vm.getLocationUrl();
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
                alert('系统开了小差，请刷新页面');
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
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.getLocationUrl = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/CreateMicWebQrCode.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
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
                alert('系统开了小差，请刷新页面');
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.origin = Common.getUrlParam('from');
          vm.getServerLogo();
          //更换背景跳转后，通过该标识隐藏上一步按钮
          if(vm.origin){
            vm.originFlag = false;
          }
          else{
            vm.originFlag = true;
          }
          vm.checkUsrOrOrg();
        }

        init();
    };

    Step3Controller.$inject = injectParams;

    app.register.controller('Step3Controller', Step3Controller);

});

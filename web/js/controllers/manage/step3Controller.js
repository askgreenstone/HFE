'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Step3Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        var curw = 0;
        var curh = 0;
        vm.userBg = '';
        vm.transferUrl = TransferUrl;
        vm.isServerData = false;//服务器端数据还是本地上传
        vm.hiddenInitImg = false;//裁图初始化之后置为true

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

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
                  $('#test').text('logo预览(宽：'+curw+'，高：'+curh+')');
                  if(vm.choosePic){
                    vm.chooseSourceBg(vm.choosePic);
                  }
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
            if(!f){
              if(!vm.isServerData){
                alert('请先选择图片！');
                return;
              }
              else{
                $window.location.href = '#/step4?session='+vm.sess;
                return;
              }
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
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo
                $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=5', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    console.log(data);
                    $window.location.href = '#/step4?session='+vm.sess;
                })
                .error(function() {
                    console.log('error');
                });
            };
            r.readAsDataURL(f);
        }

        //素材库：1，背景图；2，logo
        vm.getSourceImage = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryImgMaterial.do',
                params: {
                    session:vm.sess,
                    it:2
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.sourceImage = data.il;
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        //查询用户上传背景图片
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
                  if(data.l){
                    vm.userBg = TransferUrl+data.l;
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

        //it:1背景图，it:2logo
        vm.chooseSourceBg = function(name){
          vm.isServerData = true;
          vm.choosePic = name;
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
                console.log(data);
                if(data.c == 1000){
                  // vm.userBg = TransferUrl+name;
                  $window.location.reload();
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
          console.log(vm.userBg);
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.getServerBg();
          vm.getSourceImage();
        }

        init();
    };

    Step3Controller.$inject = injectParams;

    app.register.controller('Step3Controller', Step3Controller);

});

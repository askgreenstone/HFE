'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Step2Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        var curw = 0;
        var curh = 0;
        vm.userBg = '';
        vm.transferUrl = TransferUrl;
        vm.isServerData = false;//服务器端数据还是本地上传
        vm.hiddenInitImg = false;//裁图初始化之后置为true
        vm.indexNo = '';
        vm.ownUri = '';
        vm.isDeptAdmin = true;

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
                  vm.orgOrPer = 'orgNotExist';
                  if(data.ida == 1){
                    vm.isDeptAdmin = true;
                  }else{
                    vm.isDeptAdmin = false;
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
          //格式化图片比例
          // var ar1 = Common.getUrlParam('ar');
          var ar1 = localStorage.getItem('ar');
          if(!ar1){
            alert('请先选择主题！');
            return;
          }
          var ar2 = Common.formatAr(ar1);
          // console.log(ar2);
            $('#themeCropper').cropper({
                aspectRatio: ar2,
                preview: '#img_preview',
                viewMode:1,
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
                  $('#test').text('背景预览(宽：'+curw+'，高：'+curh+')');
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
        vm.uploadFile = function(state) {
          Common.getLoading(true);
          console.log('w,h,x,y:'+vm.imgw,vm.imgh,vm.imgx,vm.imgy);
            var f = document.getElementById('choose_file').files[0],
                r = new FileReader();
                console.log('f:'+f);
            // if (!f) return;
            if(!f){
              if(!vm.isServerData){
                alert('请先选择图片！');
                return;
              }
              else{
                vm.clipSourceImg(vm.choosePic,state);
                return;
              }
            }else if(f.size > 2097152){
              Common.getLoading(false);
              alert('文件大小不能超过2MB！');
              return;
            }
            //gif图片不被裁切
            if(f&&f.type.toString().toLowerCase().indexOf('gif')>-1){
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
                var url;

                // 乔凡  添加status＝complete控制工作室定制状态为完成
                if(state == 'complete'){
                  url = GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=3'+'&ida='+vm.ida+'&status=complete';
                }else{
                  url = GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=3'+'&ida='+vm.ida;
                }
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo
                $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    Common.getLoading(false);
                    // alert('success');
                    console.log(data);
                    vm.getLocationUrl();
                    if(state == 'next'){
                      $window.location.href = '#/step3?session='+vm.sess+'&ida='+vm.ida;
                    }else if(state == 'complete'){
                      $window.location.href = '#/micro1?session='+vm.sess+'&ida='+vm.ida;
                    }
                })
                .error(function() {
                    Common.getLoading(false);
                    // console.log('error');
                    alert('系统开了小差，请刷新页面');
                });
            };
            r.readAsDataURL(f);
        }

        //it:1背景图，it:2logo，it:3头像
        vm.chooseSourceBg = function(name,initCrorpFlag){
          console.log('name:'+name);
          vm.choosePic = name;
          vm.userBg = TransferUrl+name;
          //延迟初始化裁图插件
          if(initCrorpFlag){
            $('#themeCropper').cropper('destroy');
            console.log('userBg:'+vm.userBg);
            setTimeout(function() {
              vm.initCropper();
            }, 300);
          }
          
          vm.isServerData = true;
        }

        //裁切素材
        vm.clipSourceImg = function(name,state){
          console.log('name:'+name);
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/UpdateMicWebImgs.do',
                params: {
                    session: vm.sess
                },
                data: {
                  in:name,
                  it:1,
                  w:vm.imgw,
                  h:vm.imgh,
                  x:vm.imgx,
                  y:vm.imgy,
                  ida: vm.ida
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  Common.getLoading(false);
                  console.log('clipSourceImg success');
                  vm.chooseSourceBg(data.in,false);
                  vm.getLocationUrl();
                  if(state == 'next'){
                    $window.location.href = '#/step3?session='+vm.sess+'&ida='+vm.ida;
                  }else if(state == 'complete'){
                    $window.location.href = '#/micro1?session='+vm.sess+'&ida='+vm.ida;
                  }
                }
            }).
            error(function(data, status, headers, config) {
                
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        //素材库：1，背景图；2，logo
        vm.getSourceImage = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryImgMaterial.do',
                params: {
                    session:vm.sess,
                    it:1,
                    ida: vm.ida
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
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        //查询用户上传背景图片
        vm.getServerBg = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/GetMicWebImgs.do',
                params: {
                    session: vm.sess,
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
                // console.log('error:'+data);
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
                  $('#iframe_src').empty();
                  $('#iframe_src').append('<iframe  src="'+data.url+'" width="320" height="550"></iframe>');

                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        };
        
        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.origin = Common.getUrlParam('from');
          vm.ida = Common.getUrlParam('ida');
          vm.getLocationUrl();
          //更换背景跳转后，通过该标识隐藏上一步按钮
          if(vm.origin){
            vm.originFlag = false;
          }
          else{
            vm.originFlag = true;
          }
          vm.getServerBg();
          vm.getSourceImage();
          vm.checkUsrOrOrg();
        }

        init();
    };

    Step2Controller.$inject = injectParams;

    app.register.controller('Step2Controller', Step2Controller);

});

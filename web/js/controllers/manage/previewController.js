'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$http', '$window', 'GlobalUrl','TransferUrl','Common'];
    var PreviewController = function($location, $http, $window, GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.transferUrl = TransferUrl;
        vm.title = '标题';
        vm.updateFlag = 'false';
        vm.fileName = '';
        vm.fileUrl = '';

        vm.gotoLink = function(path, title) {
            location.href = '#/' + path + '?title=' + encodeURI(title)+'&ida='+vm.ida;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
        }

        vm.goBack = function() {
            $window.history.back();
        };


        // 查询该session是个人还是机构
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
                // ida＝0表示只存在个人工作室；ida＝1表示个人，机构工作室都存在，即管理员身份 
                if(data.c == 1000){
                  vm.orgOrPer = 'orgNotExist';
                  vm.headImg = data.p?(vm.transferUrl + data.p):vm.transferUrl+'header.jpg';
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        //多次点击控制
        vm.doubleClickFlag = true;
        vm.controlTimes = function(){
          if(vm.doubleClickFlag){
              vm.uploadFile();
              vm.doubleClickFlag = false;
          }
          setTimeout(function(){
              vm.doubleClickFlag = true;
          },1000);
        }

        // 图片上传
        vm.uploadFile = function() {
          console.log('w,h,x,y:'+vm.imgw,vm.imgh,vm.imgx,vm.imgy);
            var f = document.getElementById('choose_file').files[0],
                r = new FileReader();
            console.log(f);
            if (!f) {
              return;
            }else if(f.size > 2097152){
              alert('文件大小不能超过2MB！');
              return;
            }
            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('WXPhotoToUpload', f);
                fd.append('filename', f.name);
                fd.append('w', vm.imgw);
                fd.append('h', vm.imgh);
                fd.append('x', vm.imgx);
                fd.append('y', vm.imgy);
                $http.post(GlobalUrl + '/exp/SaveWXPhoto.do?session=' + vm.sess + '&ntId=' + vm.ntid, fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .success(function(data) {
                        console.log(data);
                        $window.history.back();
                    })
                    .error(function() {
                        // console.log('error');
                        alert('系统开了小差，请刷新页面');
                    });
            };
            r.readAsDataURL(f);
        }

        // 图片裁切
        vm.initCropper = function() {
            $('#imageCropper').cropper({
                // aspectRatio: 1 / 1,
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
                            $('#imageCropper').one('built.cropper', function() {
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

        function init() {
          vm.sess = Common.getUrlParam('session');
          vm.ntid = Common.getUrlParam('ntId');
          vm.initCropper();
          vm.ida = Common.getUrlParam('ida');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.isDeptAdmin = vm.ida == 0?false:true;
          vm.checkUsrOrOrg();
        }

        init();
    };

    PreviewController.$inject = injectParams;

    app.register.controller('PreviewController', PreviewController);

});

'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Step5Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.TransferUrl = TransferUrl;
        var curw = 0;
        var curh = 0;
        vm.user = {
          title:'',
          desc:'',
          preview:''
        }

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess+'&ida='+vm.ida;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.calLength = function(cur){
          var count = cur.replace(/[\u4E00-\u9FA5]/g,'aa').length;
          return count;
        }


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
                  vm.headImg = data.p?(vm.TransferUrl+ data.p):vm.TransferUrl+'header.jpg';;
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.getQrCode = function(){
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
                  vm.qrSrc = vm.transferUrl+data.qrn+'?'+Date.parse(new Date());
                  vm.inputUrl = data.url;
                  $('#iframe_src').empty();
                  $('#iframe_src').append('<iframe  src="'+data.url+'" width="320" height="545"></iframe>');

                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        };


        // 图片裁切
        vm.initCropper = function() {
          vm.hiddenInitImg = true;
            $('#themeCropper').cropper({
                aspectRatio: 1 / 1,
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

        vm.gotoUpload = function(){
            var $choose_file = $('#step5_upload'),
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
                            vm.uploadFile();
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
        


        vm.uploadFile = function() {
          console.log('w,h,x,y:'+vm.imgw,vm.imgh,vm.imgx,vm.imgy);
            var f = document.getElementById('choose_file').files[0],
                r = new FileReader();
            // console.log('f,r:'+f,r);
            // console.log(f);
            // return;
            if(!f){
              if(!vm.isServerData){
                alert('请先选择图片！');
                return;
              }
              else{
                vm.clipSourceImg(vm.choosePic);
                // alert('上传成功');
                $('#themeCropper').cropper('destroy');
                return;
              }
            }
            //gif图片不被裁切
            if(f.type.toString().toLowerCase().indexOf('gif')>-1){
              alert('暂不支持gif！');
              return;
            }
            Common.getLoading(true);
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
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6 微信分享图标
                $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=6', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    Common.getLoading(false);
                    console.log(data);
                    vm.user.preview = data.on;
                    // vm.user.HeadImg = data.on;
                    // vm.head = vm.transferUrl+vm.user.HeadImg;
                    // console.log(vm.head);
                    // // vm.isHeadUpload = true;
                    // vm.state = 'do';
                    // alert('上传成功');
                    // console.log(vm.CardID);
                    // document.getElementById("choose_file").innerHTML='<input type="file" id="choose_file" ng-model="vm.fileName"/>';   
                    $('#themeCropper').cropper('destroy');
                    setTimeout(function() {
                      vm.initCropper();
                    }, 300);
                })
                .error(function() {
                    // console.log('error');
                    Common.getLoading(false);
                    alert('系统开了小差，请刷新页面');
                });
            };
            r.readAsDataURL(f);
        }
        // vm.uploadFile = function() {
        //     var f = document.getElementById('choose_file').files[0],
        //         r = new FileReader();
        //     if (!f) {
        //       // console.log(f);
        //       alert('请先选择文件！');
        //       return;
        //     }

        //     //验证上传图片格式
        //     console.log('type:'+f.type);
        //     if(f.type.toLowerCase().indexOf('image')==-1){
        //       alert('请选择正确图片格式文件！');
        //       return;
        //     }
        //     Common.getLoading(true);
        //     r.onloadend = function(e) {
                
        //         var data = e.target.result;
        //         var fd = new FormData();
        //         fd.append('ThirdUpload', f);
        //         fd.append('filename', f.name);
        //         // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6 微信分享图标
        //         $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=6', fd, {
        //             transformRequest: angular.identity,
        //             headers: {
        //                 'Content-Type': undefined
        //             }
        //         })
        //         .success(function(data) {
        //             console.log(data);
        //             vm.user.preview = data.on;
        //             setTimeout(function(){
        //               Common.getLoading(false);
        //             }, 300);
        //         })
        //         .error(function() {
        //             Common.getLoading(false);
        //             // console.log('error');
        //             alert('系统开了小差，请刷新页面');
        //         });
        //     };
        //     r.readAsDataURL(f);
        // }

        //裁切素材
        vm.clipSourceImg = function(name){
          console.log('name:'+name);
          Common.getLoading(true);
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/UpdateMicWebImgs.do',
                params: {
                    session:vm.sess
                },
                data: {
                    in:name,
                    it:5,
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
                  vm.user.preview = data.in;
                  vm.choosePic = data.in;
                  setTimeout(function() {
                    vm.initCropper();
                  }, 100);
                }
            }).
            error(function(data, status, headers, config) {
                Common.getLoading(false);
                console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.validateInput = function(){
          if(!vm.user.title){
            alert('分享标题不能为空！');
            return false;
          }else if(vm.calLength(vm.user.title)>30){
            alert('分享标题不能超过30个字符！');
            return false;
          }

          console.log('vm.user.desc.length:'+vm.user.desc.length);
          if(!vm.user.desc){
            alert('分享摘要不能为空！');
            return false;
          }else if(vm.calLength(vm.user.desc)>80){
            alert('分享摘要不能超过80个字符！');
            return false;
          }else{
            return true;
          }
        }

        //分享首页st：1，微名片st：2
        vm.setWxShare = function(){
          if(!vm.validateInput()) return;
          
          if(vm.shareId){//更新
            vm.tempData = {
                si:vm.shareId,
                st:1,
                sti:vm.user.title,
                sd:vm.user.desc,
                spu:vm.user.preview
            }
          }else{//插入
            vm.tempData = {
                st:1,
                sti:vm.user.title,
                sd:vm.user.desc,
                spu:vm.user.preview
            }
          }
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/ThirdSetShareInfo.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: vm.tempData
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.menuLink('micro');
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.GetWxShare = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/GetMicWebShareInfo.do',
                params: {
                    session:vm.sess,
                    st:1,
                    ida: vm.ida
                },
                data: {
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  if(data.sil.length>0){
                    vm.user = {
                      title:data.sil[0].sti,
                      desc:data.sil[0].sd,
                      preview:data.sil[0].spu
                    }
                    vm.shareId = data.sil[0].si;
                    vm.choosePic = data.sil[0].spu;
                    vm.isServerData = true;
                  }else{
                    vm.user = {
                      title:'我的工作室',
                      desc:'欢迎访问我的工作室，您可以直接在线咨询我',
                      preview:'batchdeptlogo20160811_W108_H108_S15.png'
                    }
                  }
                  setTimeout(function() {
                    vm.initCropper();
                  }, 300);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.checkUsrOrOrg();
          vm.GetWxShare();
          vm.getQrCode();
        }

        init();
    };

    Step5Controller.$inject = injectParams;

    app.register.controller('Step5Controller', Step5Controller);

});

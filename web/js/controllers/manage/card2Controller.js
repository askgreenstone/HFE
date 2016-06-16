'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Card2Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.TransferUrl = TransferUrl;
        vm.user = {
          title:'',
          desc:'',
          preview:''
        }

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

        vm.calLength = function(cur){
          var count = cur.replace(/[\u4E00-\u9FA5]/g,'aa').length;
          return count;
        }

        vm.getCardUri = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/QueryMicroCard.do?session='+vm.sess
          }).
          success(function(data, status, headers, config) {

              console.log(data);
              if(data.c == 1000){
                vm.ownUri = data.uri;
                vm.qrcode = vm.transferurl+data.QR;
                vm.url = data.mwUrl;
                console.log(vm.url);
                var iframe = '<iframe src='+vm.url+' width="320" height="720"></iframe>';
                $("#iframe_src").append(iframe);    
              }
              
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          }); 
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
            
            var f = document.getElementById('step5_upload').files[0],
                r = new FileReader();
            if (!f){
              alert('请先选择文件！');
              return;
            } 
            //验证上传图片格式
            console.log('type:'+f.type);
            if(f.type.toLowerCase().indexOf('image')==-1){
              alert('请选择正确图片格式文件！');
              return;
            }
            Common.getLoading(true);
            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('ThirdUpload', f);
                fd.append('filename', f.name);
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6 微信分享图标
                $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=6', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    console.log(data);
                    vm.user.preview = data.on;
                    setTimeout(function(){
                      Common.getLoading(false);
                    }, 300);
                })
                .error(function() {
                    Common.getLoading(false);
                    // console.log('error');
                    alert('系统开了小差，请刷新页面');
                });
            };
            r.readAsDataURL(f);
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
                st:2,
                sti:vm.user.title,
                sd:vm.user.desc,
                spu:vm.user.preview
            }
          }else{//插入
            vm.tempData = {
                st:2,
                sti:vm.user.title,
                sd:vm.user.desc,
                spu:vm.user.preview
            }
          }
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/ThirdSetShareInfo.do',
                params: {
                    session:vm.sess
                },
                data: vm.tempData
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.menuLink('card3');
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
                    st:2
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
                  }else{
                    vm.user = {
                      title:'XX律师微网站',
                      desc:'XX律师专注于资本市场、基金、投融资、并购、公司法务等等',
                      preview:'greenStoneicon300.png'
                    }
                  }
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.GetWxShare();
          vm.getCardUri();
        }

        init();
    };

    Card2Controller.$inject = injectParams;

    app.register.controller('Card2Controller', Card2Controller);

});

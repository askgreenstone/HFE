'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Step5Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
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

        vm.uploadFile = function() {
            Common.getLoading(true);
            var f = document.getElementById('step5_upload').files[0],
                r = new FileReader();
            if (!f) {
              // console.log(f);
              alert('请先选择文件！');
              Common.getLoading(false);
              return;
            }
            //验证上传图片格式
            console.log('type:'+f.type);
            if(f.type.toLowerCase().indexOf('image')==-1){
              alert('请选择正确图片格式文件！');
              return;
            }
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
                    alert('网络连接错误或服务器异常！');
                });
            };
            r.readAsDataURL(f);
        }

        vm.validateInput = function(){
          if(!vm.user.title){
            alert('分享标题不能为空！');
            return false;
          }else if(vm.user.title.length>15){
            alert('分享标题不能超过15个字！');
            return false;
          }

          console.log('vm.user.desc.length:'+vm.user.desc.length);
          if(!vm.user.desc){
            alert('分享摘要不能为空！');
            return false;
          }else if(vm.user.desc.length>40){
            alert('分享摘要不能超过40个字！');
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
                    session:vm.sess
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
                alert('网络连接错误或服务器异常！');
            });
        }

        vm.GetWxShare = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/GetMicWebShareInfo.do',
                params: {
                    session:vm.sess,
                    st:1
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
                alert('网络连接错误或服务器异常！');
            });
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.GetWxShare();
        }

        init();
    };

    Step5Controller.$inject = injectParams;

    app.register.controller('Step5Controller', Step5Controller);

});

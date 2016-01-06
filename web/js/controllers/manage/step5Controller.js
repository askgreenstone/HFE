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
            var f = document.getElementById('step5_upload').files[0],
                r = new FileReader();
            if (!f) return;
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
                })
                .error(function() {
                    console.log('error');
                });
            };
            r.readAsDataURL(f);
        }

        //分享首页st：1，微名片st：2
        vm.setWxShare = function(){
          if(!vm.user.title){
            alert('分享标题不能为空！');
            return;
          }else if(!vm.user.desc){
            alert('分享摘要不能为空！');
            return;
          }

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
                console.log(data);
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
                console.log(data);
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

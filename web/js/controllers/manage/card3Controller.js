'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Card3Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.ownUri = '';
        vm.url = '';
        vm.qrcode = '';
        vm.transferurl = TransferUrl;

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
        


        // 获取微名片编辑状态：
        // 0  完全没有编辑过微名片
        // 1  已经编辑过微名片
        // 2  未编辑，但已经生成微名片数据（上传过头像）
        vm.checkCardState = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/GetMicroCardEditStatus.do?session='+vm.sess
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              // 微名片编辑状态：
              // 0  完全没有编辑过微名片
              // 1  已经编辑过微名片
              // 2  未编辑，但已经生成微名片数据（上传过头像）
              if(data.s == 1){
                vm.getOwnUri();
              }else{
                $window.location.href = '#/card?session='+vm.sess;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('网络连接错误或服务器异常！');
          });  
        }
        
        // 获取微名片链接以及二维码
        vm.getOwnUri = function(){
            $http({
              method: 'GET',
              url: GlobalUrl+'/exp/GetMicroCardEditStatus.do?session='+vm.sess
            }).
            success(function(data, status, headers, config) {
              console.log(data);
              // 状态码  0  未完成  1  已完成
              if(data.c == 1000){
                if(data.s == 0){
                    $window.location.href = '#/card?session='+vm.sess;
                    vm.head = 'image/placeholder.png';
                    setTimeout(function(){
                        vm.initCropper();
                    },300)
                }else if(data.s == 1){
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
                         var iframe = '<iframe src='+vm.url+' width="320" height="568"></iframe>';
                         $("div.mb_left").append(iframe);    
                       }
                       
                   }).
                   error(function(data, status, headers, config) {
                       // console.log(data);
                       alert('网络连接错误或服务器异常！');
                   }); 
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
          vm.checkCardState();
        }

        init();
    };

    Card3Controller.$inject = injectParams;

    app.register.controller('Card3Controller', Card3Controller);

});

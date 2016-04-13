'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var WxController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.imgTextReply = '';
        vm.imgTextFlag = true;
        vm.enable = '';

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.menuLinkReply = function(){
          console.log(vm.enable);
          $window.location.href = '#/reply2?session='+vm.sess+'&enable='+vm.enable;
        }

        vm.wxAuthor = function(){
          $http({
              method: 'get',
              url: GlobalUrl+'/exp/ThirdAuthRedirect.do',
              params: {
                  session:vm.sess
              },
              data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                // $window.location.href=data.url;
                $window.open(data.url,'_blank');
                vm.authorFlag = false;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('网络连接错误或服务器异常！');
          });
        }

        vm.getWxAuthorResult = function(){
          $http({
              method: 'get',
              url: GlobalUrl+'/exp/ThirdAuthInfoQuery.do',
              params: {
                  session:vm.sess
              },
              data: {},
              headers : {'Content-Type':undefined}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              // 授权状态  authStatus ：0 授权失败1 授权成功
              if(data.c == 1000){
                if(data.authStatus == 0){
                  vm.authorReault = '授权失败';
                  vm.authorFlag = true;
                }else if(data.authStatus == 1){
                  vm.authorReault = '授权成功';
                  vm.authorFlag = false;
                  vm.getImgTextReply();
                }
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('网络连接错误或服务器异常！');
          });
        }


        // 获取用户设置被关注图文消息回复
        vm.getImgTextReply = function(){
          $http({
              method: 'get',
              url: GlobalUrl+'/exp/ThirdGetsubReplay.do',
              params: {
                  session:vm.sess
              },
              data: {},
              headers : {'Content-Type':undefined}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                if(data.enable == 1){
                  vm.imgTextFlag = false;
                  vm.imgTextReply = '关闭欢迎图文';
                }else{
                  vm.imgTextReply = '开启欢迎图文';
                  vm.imgTextFlag = true;
                }
              }
              vm.enable = data.enable;
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('网络连接错误或服务器异常！');
          });
        }

        // 点击判断用户启用/关闭被关注图文消息回复
        vm.changeImgTextReply = function(){
          console.log(vm.imgTextReply);
          if(vm.imgTextFlag){
            vm.enable = 1;
            vm.imgTextFlag = false;
            vm.imgTextReply = '关闭欢迎图文';
          }else{
            vm.enable = 0;
            vm.imgTextFlag = true;
            vm.imgTextReply = '开启欢迎图文';
          }

          // 设置启用/关闭状态
          $http({
              method: 'post',
              url: GlobalUrl+'/exp/ThirdSetSubReplay.do',
              params: {
                  session:vm.sess
              },
              data: {
                enable:vm.enable
              }
          }).
          success(function(data, status, headers, config) {
              console.log(data);
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('网络连接错误或服务器异常！');
          });
        }

        vm.checkAuthorParam = function(){
          vm.wxUrlFlag = Common.getUrlParam('authSucc');
          if(vm.wxUrlFlag&&vm.wxUrlFlag == 1){
            vm.authorFlag = false;
          }else if(vm.wxUrlFlag&&vm.wxUrlFlag == 0){
            vm.authorFlag = true;
          }else{
            vm.authorFlag = true;
            return;
          }
        }
        

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.checkAuthorParam();
          vm.getWxAuthorResult();
        }

        init();

    };

    WxController.$inject = injectParams;

    app.register.controller('WxController', WxController);

});

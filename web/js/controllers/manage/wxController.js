'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var WxController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.authorFlag = false;

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
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
              data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                vm.authorReault = '授权成功！';
              }else if(data.c == 1014){
                vm.authorReault = '授权失败！';
                vm.authorFlag = true;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('网络连接错误或服务器异常！');
          });
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.authorFlag = true;
        }

        init();

    };

    WxController.$inject = injectParams;

    app.register.controller('WxController', WxController);

});

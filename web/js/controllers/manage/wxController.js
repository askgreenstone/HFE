'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var WxController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.wxAuthor = function(){
          $http({
              method: 'get',
              url: GlobalUrl+'/comm/ThirdAuthRedirect.do',
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
              }
          }).
          error(function(data, status, headers, config) {
              console.log(data);
          });
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
        }

        init();

    };

    WxController.$inject = injectParams;

    app.register.controller('WxController', WxController);

});

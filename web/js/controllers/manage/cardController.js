'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','Common'];
    var CardController = function($location,$http,$window,GlobalUrl,Common) {
        var vm = this;

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.checkCardState = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/GetMicroCardEditStatus.do?session='+vm.sess
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              // 状态码  0  未完成  1  已完成
              if(data.s == 1){
                $window.location.href = '#/card?session='+vm.sess;
              }else if(data.s == 0){
                $window.location.href = '#/card3?session='+vm.sess;
              }
          }).
          error(function(data, status, headers, config) {
              console.log(data);
          }); 
        }


        vm.UploadHead = function(){
          
        }
        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.checkCardState();
        }

        init();
    };

    CardController.$inject = injectParams;

    app.register.controller('CardController', CardController);

});

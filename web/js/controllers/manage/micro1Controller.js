'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Micro1Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.transferUrl = TransferUrl;

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.getQrCode = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/CreateMicWebQrCode.do',
                params: {
                    session:vm.sess
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.qrSrc = vm.transferUrl+data.qrn;
                  vm.inputUrl = data.url;
                  $('#iframe_src').empty();
                  $('#iframe_src').append('<iframe  src="'+data.url+'" width="320" height="575"></iframe>');

                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.getQrCode();
        }

        init();
    };

    Micro1Controller.$inject = injectParams;

    app.register.controller('Micro1Controller', Micro1Controller);

});

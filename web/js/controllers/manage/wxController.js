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

        function init(){
          vm.sess = Common.getUrlParam('session');
        }

        init();

    };

    WxController.$inject = injectParams;

    app.register.controller('WxController', WxController);

});

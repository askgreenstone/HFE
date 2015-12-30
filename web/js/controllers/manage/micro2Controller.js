'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','Common'];
    var Micro2Controller = function($location,$http,$window,GlobalUrl,Common) {
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

        function init(){
          vm.sess = Common.getUrlParam('session');
        }

        init();
    };

    Micro2Controller.$inject = injectParams;

    app.register.controller('Micro2Controller', Micro2Controller);

});

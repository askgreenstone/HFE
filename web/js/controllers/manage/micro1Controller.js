'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','Common'];
    var Micro1Controller = function($location,$http,$window,GlobalUrl,Common) {
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

    Micro1Controller.$inject = injectParams;

    app.register.controller('Micro1Controller', Micro1Controller);

});

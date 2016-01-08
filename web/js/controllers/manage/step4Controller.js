'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','Common'];
    var Step4Controller = function($location,$http,$window,GlobalUrl,Common) {
        var vm = this;

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

    Step4Controller.$inject = injectParams;

    app.register.controller('Step4Controller', Step4Controller);

});

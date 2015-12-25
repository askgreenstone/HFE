'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','Common'];
    var TempController = function($location,$http,$window,GlobalUrl,Common) {
        var vm = this;

        vm.test = function(){
            // alert('aaa');
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.test();
        }

        init();
    };

    TempController.$inject = injectParams;

    app.register.controller('TempController', TempController);

});

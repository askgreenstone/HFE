'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','Common'];
    var Card3Controller = function($location,$http,$window,GlobalUrl,Common) {
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


        vm.resetCard = function(){
            $window.location.href = '#/card?session='+vm.sess+'&state=do';
        }
        

        
        function init(){
          vm.sess = Common.getUrlParam('session');
        }

        init();
    };

    Card3Controller.$inject = injectParams;

    app.register.controller('Card3Controller', Card3Controller);

});

'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','Common'];
    var Step5Controller = function($location,$http,$window,GlobalUrl,Common) {
        var vm = this;
        vm.user = {
          title:'王杰律师微网站',
          desc:'王杰律师专注于资本市场、基金、投融资、并购、公司法...',
        }

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

    Step5Controller.$inject = injectParams;

    app.register.controller('Step5Controller', Step5Controller);

});

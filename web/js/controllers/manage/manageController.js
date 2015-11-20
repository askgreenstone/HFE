'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location'];
    var ManageController = function($location) {

        var vm = this;
        vm.str = 'chat!!!';

        vm.showMsg = function() {
            //alert(vm.str);
        };

        function init(){
          vm.showMsg();
        }

        init();
    };

    ManageController.$inject = injectParams;

    app.register.controller('ManageController', ManageController);

});

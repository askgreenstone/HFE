'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location','$window','$http'];
    var ManageController = function($location,$window,$http) {

        var vm = this;
        vm.str = 'manage!!!';

        vm.gotoLink = function(path,title) {
            $window.location.href = '#/'+path+'?title='+encodeURI(title);
        };

    };

    ManageController.$inject = injectParams;

    app.register.controller('ManageController', ManageController);

});

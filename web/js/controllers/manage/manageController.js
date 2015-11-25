'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location'];
    var ManageController = function($location) {

        var vm = this;
        vm.str = 'manage!!!';

        vm.gotoLink = function(path,title) {
            location.href = '#'+path+'?title='+encodeURI(title);
        };

        
    };

    ManageController.$inject = injectParams;

    app.register.controller('ManageController', ManageController);

});

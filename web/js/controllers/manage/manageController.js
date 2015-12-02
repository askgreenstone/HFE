'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl'];
    var ManageController = function($location, $window, $http,GlobalUrl) {

        var vm = this;
        vm.str = 'manage!!!';

        vm.gotoLink = function(path, title,ntid) {
            $window.location.href = '#/' + path + '?title=' + encodeURI(title)+'&ntId='+ntid;
            UE.getEditor('editor').destroy();
        };

        vm.getServerCatalogue = function() {
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsTypes.do',
                params: {
                    debug:1,
                    utype:1
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.introduce = data.ntl[0].td;
                  vm.content = data.ntl[1].td;
                  vm.photos = data.ntl[2].td;
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        function init(){
          vm.getServerCatalogue();
        }

        init();

    };

    ManageController.$inject = injectParams;

    app.register.controller('ManageController', ManageController);

});

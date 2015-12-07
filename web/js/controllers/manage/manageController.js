'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl'];
    var ManageController = function($location, $window, $http,GlobalUrl) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';

        vm.getUrlParam = function(p) {
          var url = location.href; 
          var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
          var paraObj = {} ;
          for (var i=0,j=0; j=paraString[i]; i++){ 
            paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
          } 
          var returnValue = paraObj[p.toLowerCase()]; 
          if(typeof(returnValue)=="undefined"){ 
            return ""; 
          }else{ 
            return  returnValue;
          } 
        };

        vm.gotoLink = function(path, title,ntid) {
            $window.location.href = '#/' + path + '?session='+vm.sess+'&title=' + encodeURI(title)+'&ntId='+ntid;
            UE.getEditor('editor').destroy();
        };

        vm.getServerCatalogue = function() {
            if(!vm.sess) return;
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsTypes.do',
                params: {session:vm.sess},
                data: {}
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

        vm.storeCurrentSession = function(sess){
          var isSession = localStorage.getItem('globalSession');
          if(isSession){
            localStorage.removeItem('globalSession');
          }

          localStorage.setItem('globalSession',sess);
        }

        function init(){
          vm.sess = vm.getUrlParam('session');
          vm.getServerCatalogue();
          vm.storeCurrentSession(vm.sess);
        }

        init();

    };

    ManageController.$inject = injectParams;

    app.register.controller('ManageController', ManageController);

});

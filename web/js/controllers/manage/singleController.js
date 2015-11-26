'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location'];
    var SingleController = function($location) {

        var vm = this;
        vm.title = '标题';

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

        vm.gotoLink = function(path,title){
          location.href = '#/'+path+'?title='+encodeURI(title);
        };

        function init(){
          vm.title = decodeURI(vm.getUrlParam('title'));
        }

        init();
    };

    SingleController.$inject = injectParams;

    app.register.controller('SingleController', SingleController);

});

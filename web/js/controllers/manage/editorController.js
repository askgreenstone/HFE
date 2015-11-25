'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location'];
    var EditorController = function($location) {

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

        function init(){
          vm.title = decodeURI(vm.getUrlParam('title'));
        }

        init();
    };

    EditorController.$inject = injectParams;

    app.register.controller('EditorController', EditorController);

});

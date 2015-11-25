'use strict';

define(['js/app/app','ZeroClipboard'], function(app,ZeroClipboard) {

    var injectParams = ['$location'];
    var AddController = function($location) {

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

        vm.getContent = function(){
          alert(UE.getEditor('editor').getContent());
        }

        vm.gotoLink = function(){
          location.href = '#manage';
        };

        function init(){
          // vm.title = decodeURI(vm.getUrlParam('title'));
          console.log('AddController run');
          var ue = UE.getEditor('editor');
          window['ZeroClipboard']=ZeroClipboard;
          console.log('AddController end');
        }

        init();
    };

    AddController.$inject = injectParams;

    app.register.controller('AddController', AddController);

});

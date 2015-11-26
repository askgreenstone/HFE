'use strict';

define(['js/app/app','ZeroClipboard'], function(app,ZeroClipboard) {

    var injectParams = ['$location','$window'];
    var EditorController = function($location,$window) {

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

        vm.setContent = function(isAppendTo){
          UE.getEditor('editor').setContent('hi～Jartto!', isAppendTo);
        }

        function init(){
          vm.title = decodeURI(vm.getUrlParam('title'));
          var ue = UE.getEditor('editor');
          window['ZeroClipboard']=ZeroClipboard;
        }

        init();
    };

    EditorController.$inject = injectParams;

    app.register.controller('EditorController', EditorController);

});

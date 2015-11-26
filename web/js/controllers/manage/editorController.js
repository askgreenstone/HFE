'use strict';

define(['js/app/app','ZeroClipboard'], function(app,ZeroClipboard) {

    var injectParams = ['$location','$window','$http'];
    var EditorController = function($location,$window,$http) {

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

        vm.queryContent = function(){
          $http({
                method: 'GET',
                url: 'http://t-web.green-stone.cn/exp/QueryNewsContent.do',
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
                  
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        vm.submitContent = function(){
          vm.userIntroduce = UE.getEditor('editor').getContent();
          $http({
                method: 'POST',
                url: 'http://t-web.green-stone.cn/exp/SaveNewsContent.do',
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
                  
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        vm.gotoLink = function(path, title) {
            if(title){
              $window.location.href = '#/' + path + '?title=' + encodeURI(title);
            }else{
              $window.location.href = '#/' + path;
            }
        };

        function init(){
          vm.title = decodeURI(vm.getUrlParam('title'));

          var editor = new UE.ui.Editor();
          editor.render('editor');

          window['ZeroClipboard']=ZeroClipboard;
          // vm.queryContent();
        }

        init();
    };

    EditorController.$inject = injectParams;

    app.register.controller('EditorController', EditorController);

});

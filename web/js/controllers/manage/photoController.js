'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location','$http','GlobalUrl','$window'];
    var PhotoController = function($location,$http,GlobalUrl,$window) {

        var vm = this;
        vm.title = '标题';
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

        vm.gotoLink = function(path,title,pid,pth){
          location.href = '#/'+path+'?session='+vm.sess+'&title='+encodeURI(title)+'&pid='+pid+'&pth='+pth;
        };

        vm.getServerPhotos = function() {
            if(!vm.sess) return;

            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryWXPhotoList.do?ptId=10',
                params: {
                    session:vm.sess
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.photos = data.pl;
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.test = function(){
          alert(vm.uploadPath);
        }

        function init(){
          vm.sess = vm.getUrlParam('session');
          vm.title = decodeURI(vm.getUrlParam('title'));
          vm.getServerPhotos();
        }

        init();
    };

    PhotoController.$inject = injectParams;

    app.register.controller('PhotoController', PhotoController);

});

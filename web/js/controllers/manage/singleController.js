'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location','$http','GlobalUrl'];
    var SingleController = function($location,$http,GlobalUrl) {

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

        vm.getServerPhotos = function() {
            var ownUri = vm.getUrlParam('ownUri');
            ownUri = 'e1107';
            if(!ownUri) return;

            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryWXPhotoList.do?ptId=10&ownUri='+ownUri,
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
                  vm.photos = data.pl;
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        }

        function init(){
          vm.getServerPhotos();
          vm.title = decodeURI(vm.getUrlParam('title'));
          vm.pid = decodeURI(vm.getUrlParam('pid'));
          vm.pth = decodeURI(vm.getUrlParam('pth'));
        }

        init();
    };

    SingleController.$inject = injectParams;

    app.register.controller('SingleController', SingleController);

});

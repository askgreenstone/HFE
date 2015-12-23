'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location','$http','GlobalUrl','$window','TransferUrl'];
    var PhotoController = function($location,$http,GlobalUrl,$window,TransferUrl) {

        var vm = this;
        vm.title = '标题';
        vm.sess = '';
        vm.ntid = 0;
        vm.transferUrl = TransferUrl;

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
          if(!title){
            title = '暂无描述';
          }
          location.href = '#/'+path+'?session='+vm.sess+'&title='+encodeURI(title)+'&pid='+pid+'&pth='+pth+'&ntid='+vm.ntid;
        };
        
        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.gotoUpload = function(path){
          location.href = '#/'+path+'?session='+vm.sess+'&ntId='+vm.ntid;
        };

        vm.getServerPhotos = function() {
            if(!vm.sess) return;

            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryWXPhotoList.do?ntId='+vm.ntid,
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

        function init(){
          vm.sess = vm.getUrlParam('session');
          vm.ntid = vm.getUrlParam('ntId');
          vm.title = decodeURI(vm.getUrlParam('title'));
          vm.getServerPhotos();
        }

        init();
    };

    PhotoController.$inject = injectParams;

    app.register.controller('PhotoController', PhotoController);

});

'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','GlobalUrl','$window','TransferUrl','Common'];
    var PhotoController = function($location,$http,GlobalUrl,$window,TransferUrl,Common) {

        var vm = this;
        vm.title = '标题';
        vm.sess = '';
        vm.ntid = 0;
        vm.transferUrl = TransferUrl;

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
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        }

        vm.goBack = function(){
          $window.history.back();
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ntid = Common.getUrlParam('ntId');
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.getServerPhotos();
        }

        init();
    };

    PhotoController.$inject = injectParams;

    app.register.controller('PhotoController', PhotoController);

});

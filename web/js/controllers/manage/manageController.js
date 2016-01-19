'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var ManageController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }


        vm.gotoLink = function(path, title,ntid) {
            $window.location.href = '#/' + path + '?session='+vm.sess+'&title=' + encodeURI(title)+'&ntId='+ntid;
            UE.getEditor('editor').destroy();
        };

        vm.getServerCatalogue = function() {
            if(!vm.sess) return;
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsTypes.do',
                params: {session:vm.sess,wf:1},
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

        //获取用户网站信息
        vm.getServerMenuList = function(){
          // console.log('vm.microWebId:'+vm.microWebId);
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsTypes.do',
                params: {
                    session:vm.sess,
                    //wf:0不包含父菜单，1包含父菜单
                    wf:0,
                    mwm:vm.microWebId
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.microName = data.mwn;
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        //查询模版信息
        vm.getMicroImg = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/GetMicWebModel.do',
                params: {
                    session:vm.sess
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.microWebId = data.sid;
                  vm.menuCount = data.sbn;
                  vm.getServerMenuList();
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.getServerCatalogue();
          vm.storeCurrentSession(vm.sess);
          vm.getMicroImg();
        }

        init();

    };

    ManageController.$inject = injectParams;

    app.register.controller('ManageController', ManageController);

});

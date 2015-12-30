'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','TransferUrl','GlobalUrl','Common'];
    var MicroController = function($location,$http,$window,TransferUrl,GlobalUrl,Common) {
        var vm = this;
        vm.transferUrl = TransferUrl;

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

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
                  vm.showList = data.ml;
                  setTimeout(function(){
                      $('.mb_left').unslider({
                      speed: 500,               
                      delay: 3000,              
                      complete: function() {},  
                      keys: true,               
                      dots: true,               
                      fluid: false  
                    });
                  }, 300);
                  
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        };

        //判断主题制定状态：0未设置，1已设置，2已完成
        vm.getMicroStatus = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/MicWebSetUpStatus.do',
                params: {
                    session:vm.sess
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  if(data.s == 0){
                    vm.menuLink('micro');
                  }else if(data.s == 1){
                    vm.menuLink('micro2');
                  }else if(data.s == 2){
                    vm.menuLink('micro1');
                  }
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.getMicroStatus();
          vm.getMicroImg();
        }

        init();
    };

    MicroController.$inject = injectParams;

    app.register.controller('MicroController', MicroController);

});

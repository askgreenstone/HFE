'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','TransferUrl','GlobalUrl','Common'];
    var MicroController = function($location,$http,$window,TransferUrl,GlobalUrl,Common) {
        var vm = this;
        vm.transferUrl = TransferUrl;
        vm.editState = '';

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
                    //   $('.mb_left').unslider({
                    //   speed: 500,               
                    //   delay: 3000,              
                    //   complete: function() {},  
                    //   keys: true,               
                    //   dots: true,               
                    //   fluid: false  
                    // });
                    var unslider04 = $('.mb_left').unslider({
                          dots: false
                        }),
                        data04 = unslider04.data('unslider');
                        
                        $('.unslider-arrow04').click(function() {
                              var fn = this.className.split(' ')[1];
                              data04[fn]();
                          });
                  }, 300);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
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
                    vm.editState = '开始定制'
                  }else if(data.s == 1){
                    vm.menuLink('micro');
                    vm.editState = '继续定制'
                  }else if(data.s == 2){
                    vm.menuLink('micro1');
                  }
                  
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
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

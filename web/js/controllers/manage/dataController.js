'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$window','$http','GlobalUrl','Common'];
    var DataController = function($location,$window,$http,GlobalUrl,Common) {

        var vm = this;
        vm.title = '标题';
        vm.webCt = 0;
        vm.phoneCt = 0;
        vm.muCt = 0;
        vm.IDCt = 0;
        vm.usrCt = 0;

        vm.gotoLink = function(path,title){
          location.href = '#/'+path+'?title='+encodeURI(title);
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.getServerStatic = function(index) {
            console.log(index);
            if(!vm.sess) return;
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/ThirdStatistic.do',
                params: {session:vm.sess,qt:index},
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.webCt = data.webCt;
                  vm.phoneCt = data.phoneCt;
                  vm.muCt = data.muCt;
                  vm.IDCt = data.IDCt;
                  vm.usrCt = data.usrCt;
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.initTabState = function(){

        }

        $('.data_tab li').bind('click',function(){
          $(this).siblings().removeClass('active');
          $(this).addClass('active');
          vm.getServerStatic($(this).attr('value'));
        })

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.getServerStatic(1);
        }

        init();
    };

    DataController.$inject = injectParams;

    app.register.controller('DataController', DataController);

});

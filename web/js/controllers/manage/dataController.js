'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location','$window','$http','GlobalUrl'];
    var DataController = function($location,$window,$http,GlobalUrl) {

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
                console.log(data);
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
          vm.sess = vm.getUrlParam('session');
          vm.title = decodeURI(vm.getUrlParam('title'));
          vm.getServerStatic(1);
        }

        init();
    };

    DataController.$inject = injectParams;

    app.register.controller('DataController', DataController);

});

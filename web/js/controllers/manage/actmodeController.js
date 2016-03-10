'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var ActmodeController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.globalUrl = GlobalUrl;
        vm.endTime = '';

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }


        vm.setInputChecked = function(){
          $('#active').prop('checked',true);
        }

        vm.getEndTime = function(){
          var now = localStorage.getItem('activeEndTime');
          vm.endTime = vm.getLocalTime(now)
          localStorage.removeItem('activeEndTime');
        }

        vm.getLocalTime = function(now) {     
             
          return new Date(parseInt(now)).toLocaleString().replace(/\//g, "-");      
        } 
        // vm.setActiveState = function(){
        //   $.ajax({
        //     type : 'post',
        //     url : vm.globalUrl + '/exp/ActivateMicWeb.do?session='+ vm.sess,
        //     data : '',
        //     dataType:'json',
        //     contentType:'application/json',
        //     success : function(data) {
        //       console.log(data);
        //       if(data.c == 1000){
        //          window.location.href = '#/manage?session='+vm.sess;
        //       }
        //     },
        //     error : function(){
        //       alert('网络连接错误或服务器异常！');
        //     }
        //   })
        // }

      

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
                  vm.title1 = data.ntl[0].tn;

                  vm.content = data.ntl[1].td;
                  vm.title2 = data.ntl[1].tn;

                  vm.photos = data.ntl[2].td;
                  vm.title3 = data.ntl[2].tn;
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
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
                // console.log(data);
                alert('网络连接错误或服务器异常！');
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
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.setInputChecked();
          vm.storeCurrentSession(vm.sess);
          vm.getMicroImg();
          vm.getEndTime();
        }

        init();

    };

    ActmodeController.$inject = injectParams;

    app.register.controller('ActmodeController', ActmodeController);

});

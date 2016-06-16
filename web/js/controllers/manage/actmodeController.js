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
        vm.actmode1 = true;
        vm.actmode2 = false;

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
        vm.setActiveState = function(){
          //状态1045，已经激活过，失去激活资格
          $http({
                method: 'post',
                url: GlobalUrl+'/exp/ActivateMicWeb.do',
                params: {session:vm.sess},
                headers : {'Content-Type':undefined},
                data: {ac:vm.expCode,ad:30}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
               
                if(data.c == 1000){
                  window.location.href = '#/micro?session='+vm.sess;
                }else if(data.c == 1046){
                  alert("激活码失效")
                }
               
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

      

        vm.gotoLink = function(path, title,ntid) {
            $window.location.href = '#/' + path + '?session='+vm.sess+'&title=' + encodeURI(title)+'&ntId='+ntid;
            UE.getEditor('editor').destroy();
        };

        
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
                alert('系统开了小差，请刷新页面');
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



        vm.getAuthenState = function(){
          $http({
              method: 'post',
              url: GlobalUrl+'/exp/ExpertInfo.do',
              params: {
                  session:vm.sess
              },
              data: {}
          }).
          success(function(data) {
            console.log(data);
            if(data.c == 1000){
              // if(data.as == 1){
              //   window.location.href = '#/manage?session='+vm.sess;
              // }else if(data.as == 2 ){
              //   localStorage.setItem('activeEndTime',data.at);
              //   window.location.href = '#/actexpired?session='+vm.sess;
              // }
            }
          }).
          error(function(){
            alert('网络连接错误或服务器异常！');
          })
        }


        vm.changeModeState1 = function(){
          vm.actmode1 = true;
          vm.actmode2 = false;
        }
        vm.changeModeState2 = function(){
          vm.actmode1 = false;
          vm.actmode2 = true;
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.setInputChecked();
          vm.storeCurrentSession(vm.sess);
          vm.getMicroImg();
          vm.getEndTime();
          vm.getAuthenState();
          $('.actmode_list li').eq(0).find('input').attr('checked','checked');
        }

        init();

    };

    ActmodeController.$inject = injectParams;

    app.register.controller('ActmodeController', ActmodeController);

});

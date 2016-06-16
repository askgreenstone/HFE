'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var ActiveController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.globalUrl = GlobalUrl;

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }


        vm.setInputChecked = function(){
          $('#active').prop('checked',true);
        }


        //0未激活、1试用、2正常付费、3试用到期、4正常付费到期
        vm.getActiveState = function(){
          $http({
              method: 'get',
              url: GlobalUrl+'/exp/QueryMicWebActivate.do',
              params: {session:vm.sess},
              data: {}
          }).
          success(function(data) {
            console.log(data);
            if(data.c == 1000){
              if(data.as == 1 || data.as == 2){
                 window.location.href = '#/micro?session='+vm.sess;
              }else if(data.as == 3 || data.as == 4 ){
                // localStorage.setItem('activeEndTime',data.at);
                window.location.href = '#/actexpired?session='+vm.sess;
              }else if(data.as == 0){
                vm.getAuthenState();
              }
            }
          }).
          error(function(){
            alert('系统开了小差，请刷新页面');
          })
        }

        //获取用户认证状态
        vm.getAuthenState = function(){
          $http({
              method: 'post',
              url: GlobalUrl+'/exp/ExpertInfo.do',
              params:{session:vm.sess},
              
              data: {}
          }).
          success(function(data) {
            console.log(data);
            if(data.c == 1000){
              window.location.href = '#/active?session='+vm.sess;
              // if(data.sts == 2){
              //   window.location.href = '#/active?session='+vm.sess;
              // }else{
              //   window.location.href = '#/actmode?session='+vm.sess;
              // }
            }
          }).
          error(function(){
            alert('系统开了小差，请刷新页面');
          })
        }

        // 直接激活
        vm.setActiveState = function(){
          $http({
              method: 'post',
              url: GlobalUrl+'/exp/ActivateMicWeb.do',
              params: {session:vm.sess},
              headers : {'Content-Type':undefined},
              data: {ad:30}
          }).
          success(function(data) {
            console.log(data);
            if(data.c == 1000){
               window.location.href = '#/micro?session='+vm.sess;
            }
          }).
          error(function(){
            alert('系统开了小差，请刷新页面');
          })
        }

        // 邀请码激活
        vm.codeSetActive = function(){
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
                alert('系统开了小差，请刷新页面');
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
                alert('系统开了小差，请刷新页面');
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.setInputChecked();
          vm.storeCurrentSession(vm.sess);
          vm.getMicroImg();
          vm.getActiveState();

        }

        init();

    };

    ActiveController.$inject = injectParams;

    app.register.controller('ActiveController', ActiveController);

});

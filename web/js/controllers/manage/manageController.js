'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var ManageController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.changeTheme = false;
        vm.radioFlag = false;
        vm.globalState = '';
        vm.user = {
          checkedFlag:false,
          checked:'',
          password:''
        }

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }


        vm.gotoLink = function(path, title,ntid) {
            $window.location.href = '#/' + path + '?session='+vm.sess+'&title=' + encodeURI(title)+'&ntId='+ntid;
            // UE.getEditor('editor').destroy();
        };

        // vm.getOldIntroduce = function() {
        //     if(!vm.sess) return;
        //     $http({
        //         method: 'GET',
        //         url: GlobalUrl+'/exp/QueryNewsList.do',
        //         params: {session:vm.sess,nc:1},
        //         data: {}
        //     }).
        //     success(function(data, status, headers, config) {
        //         console.log(data);
        //         if(data.c == 1000){
        //             vm.oldIntroduce = data.nl;
        //         }
        //     }).
        //     error(function(data, status, headers, config) {
        //         // console.log(data);
        //         alert('网络连接错误或服务器异常！');
        //     });
        // }

        // vm.getOldContent = function() {
        //     if(!vm.sess) return;
        //     $http({
        //         method: 'GET',
        //         url: GlobalUrl+'/exp/QueryNewsList.do',
        //         params: {session:vm.sess,nc:2},
        //         data: {}
        //     }).
        //     success(function(data, status, headers, config) {
        //         console.log(data);
        //         if(data.c == 1000){
        //             vm.oldContent = data.nl;
        //         }
        //     }).
        //     error(function(data, status, headers, config) {
        //         // console.log(data);
        //         alert('网络连接错误或服务器异常！');
        //     });
        // }
        vm.getAllArticle = function() {
            if(!vm.sess) return;
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsList.do',
                params: {session:vm.sess},
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                    vm.allArticle = data.nl;
                    if(data.nl.length>0){
                      vm.changeTheme = true;
                    }
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        }

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

        // vm.visityAuthority = function(e,type){
        //   e.preventDefault();
        //   $('.mcr_list .authority').find('b').hide();
        //   $(e.target).find('b').show();
        //   if(type == 'public'){
        //     vm.radioFlag = true;
        //   }else{
        //     vm.radioFlag = false;
        //   }
        // }

        // $(document).bind('click',function(e){
        //   var target = $(e.target);
        //   // console.log(target.closest('.authority').length);
        //   if(target.closest('.authority').length == 0){
        //     $('.mcr_list .authority').find('b').hide();
        //   }
        // })

        vm.cleanAuthorBox = function(){
          $('.mcr_list .authority').find('b').hide();
        }

        vm.setAuthorState = function(e,name){
          // e.stopPropagation();
          // console.log($(e.target).parent().siblings('.author_psw').val());
          // console.log($('input[name="'+name+'"]:checked').val());
          
          if($('input[name="'+name+'"]:checked').val() == 'public'){
            vm.radioFlag = true;
            vm.globalState = 'public';
          }else{
            vm.radioFlag = false;
            vm.globalState = 'private';
          }
        }

        vm.getInputValue = function(e){
          console.log($(e.target).val());
          vm.user.checked = $(e.target).val();
        }

        vm.test = function(e){
          e.stopPropagation();
        }

        vm.submitAuthor = function(ntid,vp){
          if(vm.globalState == 'public'){
            vm.user.checked = '';
          }
          console.log('submit:'+vm.user.checked+',vm.globalState:'+vm.globalState);
          var tempObj = {};
          if(!vp){
            tempObj={
              'npwd':vm.user.checked,
              'ntid':ntid
            }
          }else{
            tempObj={
              'npwd':vm.user.checked,
              'ntid':ntid,
              'opwd':vp
            }
          }
          $http({
              method: 'POST',
              url: GlobalUrl+'/exp/SetMicWebNewsPwd.do',
              params: {
                  session:vm.sess
              },
              data: tempObj
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                vm.getServerCatalogue();
                vm.cleanAuthorBox();
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('网络连接错误或服务器异常！');
          });
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.getServerCatalogue();
          vm.storeCurrentSession(vm.sess);
          vm.getMicroImg();
          // vm.getOldIntroduce();
          // vm.getOldContent();
          vm.getAllArticle();
        }

        init();

    };

    ManageController.$inject = injectParams;

    app.register.controller('ManageController', ManageController);

});

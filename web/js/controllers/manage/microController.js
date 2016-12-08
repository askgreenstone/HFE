'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','TransferUrl','GlobalUrl','Common'];
    var MicroController = function($location,$http,$window,TransferUrl,GlobalUrl,Common) {
        var vm = this;
        vm.transferUrl = TransferUrl;
        vm.editState = '';
        vm.isDeptAdmin = true;

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess+'&ida='+vm.ida;
        };

        //   跳转到文件列表页  doctype1微课堂：2文件；3通知
        vm.menuLink = function(path,type){
          if(type){
            $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida+'&dt='+type;
          }else{
            $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
          }
        }

        vm.goBack = function(){
          $window.history.back();
        };

        // 切换个人与机构
        vm.switchPerOrg = function(num){
          if(num === 1){
            window.location.href = '#/micro?session='+vm.sess+'&ida=1';
          }else{
            window.location.href = '#/micro?session='+vm.sess+'&ida=0';
          }
        }

        // 检测该用户是否是机构管理员
        vm.checkUsrOrOrg = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/ExpertInfo.do',
              params: {
                  session:vm.sess
              },
              data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  if(data.ida == 0){
                    vm.orgOrPer = 'orgNotExist';
                    vm.isDeptAdmin = false;
                  }else{
                    vm.orgOrPer = 'orgOrPer';
                    vm.isDeptAdmin = true;
                  }
                  vm.headImg = data.p?(vm.transferUrl+ data.p):vm.transferUrl+'header.jpg';
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }


        vm.getMicroImg = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/GetMicWebModel.do',
                params: {
                    session: vm.sess,
                    ida: vm.ida
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
                alert('系统开了小差，请刷新页面');
            });
        };

        //判断主题制定状态：0未设置，1已设置，2已完成
        // 乔凡：此接口不需要传入ida，data.s表示个人工作室完成状态，data.ds表示机构工作室完成状态
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
                  // 区分个人机构定制状态
                  if(vm.ida == 0){
                    if(data.s == 0){
                      vm.menuLink('micro');
                      vm.editState = '开始定制'
                    }else if(data.s == 1){
                      vm.menuLink('micro');
                      vm.editState = '继续定制'
                    }else if(data.s == 2){
                      vm.menuLink('micro1');
                    }
                  }else{
                    if(data.ds == 0){
                      vm.menuLink('micro');
                      vm.editState = '开始定制'
                    }else if(data.ds == 1){
                      vm.menuLink('micro');
                      vm.editState = '继续定制'
                    }else if(data.ds == 2){
                      vm.menuLink('micro1');
                    }
                  }
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.getMicroStatus();
          vm.getMicroImg();
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = (vm.ida == 0?vm.contentList[0]:vm.contentList[1]);
          
          vm.checkUsrOrOrg();
        }
        init();
    };

    MicroController.$inject = injectParams;

    app.register.controller('MicroController', MicroController);

});

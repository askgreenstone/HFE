'use strict';

define(['App','Sortable'], function(app) {

    var injectParams = ['$location','$http','$window','TransferUrl','GlobalUrl','Common'];
    var Step4Controller = function($location,$http,$window,TransferUrl,GlobalUrl,Common) {
        var vm = this;
        vm.modelId = 0;
        vm.transferUrl = TransferUrl;
        vm.submitCountFlag = false;

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.initSortable = function(){
            $('.step4_list').sortable().bind('sortupdate', function() {
                var newArray=[];
                var temp;
                $('.step4_list li').each(function(i){
                    newArray.push($(this).val());
                });
                
                var message="当前排序："+newArray;
                console.log(message);
                
            });
        }

        vm.hiddenShadow = function(){
          console.log(vm.submitCountFlag);
          vm.submitUserChoose();
          if(vm.submitCountFlag){
            $('.step4_shadow').hide();
          }
        }

        //提交用户选中菜单
        vm.submitUserChoose = function(){
          console.log('选中菜单：'+vm.userMenuNameArrs);
          if(vm.userMenuNameArrs.length > vm.menuCount){
            alert('选择菜单数不得超过'+vm.menuCount+'个！');
            vm.submitCountFlag = false;
          }else{
            //后台存储
            vm.submitCountFlag = true;
            // $http({
            //     method: 'POST',
            //     url: GlobalUrl+'/exp/ThirdSetNewsType.do',
            //     params: {
            //         session:vm.sess,
            //         mId:vm.modelId
            //     },
            //     data: {
                    
            //     }
            // }).
            // success(function(data, status, headers, config) {
            //     console.log(data);
            //     if(data.c == 1000){
            //       vm.filterArr(data.il);
            //       //点击聚焦
            //       setTimeout(function(){
            //         vm.initMenuActive();
            //       }, 300);
            //     }
            // }).
            // error(function(data, status, headers, config) {
            //     console.log(data);
            // });
          }
        }

        vm.showShadow = function(){
          $('.step4_shadow').show();
          vm.getMenuList();
        }

        vm.setMicroName = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/ThirdSetNewsType.do',
                params: {
                    session:vm.sess
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        vm.filterArr = function(arr){
          vm.menu1List = [];//特定菜单功能
          vm.menu2List = [];//介绍页或内容列表
          for(var i=0;i<arr.length;i++){
            if(arr[i].mt>6){
              vm.menu2List.push(arr[i]);
            }else{
              vm.menu1List.push(arr[i]);
            }
          }
        }

        //统计用户选中菜单数
        vm.countActive = function(){
          vm.userMenuNameArrs = [];
          var tempCount = $('.step4_box li').find('.active').length;
          $('#userChooseCount').text(tempCount);
          for(var i=0;i<tempCount;i++){
            vm.userMenuNameArrs.push($('.step4_box li').find('.active').parent().eq(i).attr('name'));
          }
        }

        vm.initMenuActive = function(){
          $('.step4_box ul>li').bind('click',function(){
              if($(this).find('span').hasClass('active')){
                $(this).find('span').removeClass('active');
              }else{
                $(this).find('span').addClass('active');
              }
            vm.countActive();
          })
        }

        vm.getMenuList = function(){
          var that = this;
          vm.countActive();
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryTheModelIcon.do',
                params: {
                    session:vm.sess,
                    mId:vm.modelId
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.filterArr(data.il);
                  //点击聚焦
                  setTimeout(function(){
                    vm.initMenuActive();
                  }, 300);
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
                  vm.modelId = data.sid;
                  vm.menuCount = data.sbn;
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.initSortable();
          vm.getMicroImg();
        }

        init();
    };

    Step4Controller.$inject = injectParams;

    app.register.controller('Step4Controller', Step4Controller);

});

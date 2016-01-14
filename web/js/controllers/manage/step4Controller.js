'use strict';

define(['App','Sortable'], function(app) {

    var injectParams = ['$location','$http','$window','TransferUrl','GlobalUrl','Common'];
    var Step4Controller = function($location,$http,$window,TransferUrl,GlobalUrl,Common) {
        var vm = this;
        vm.modelId = 0;
        vm.transferUrl = TransferUrl;

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

        vm.showShadow = function(){
          $('body').css('overflow','hidden');
          $('.step4_shadow').show();
          vm.getMenuList();
        }

        vm.hiddenShadow = function(){
          $('.step4_shadow').hide();
          $('body').css('overflow','auto');
        }

        vm.cancleChoose = function(){
          vm.getMenuList();
        }

        //提交用户选中菜单
        vm.submitUserChoose = function(){
          // console.log(vm.userMenuNameArrs);
          if(vm.userMenuNameArrs.length > vm.menuCount){
            alert('选择菜单数不得超过'+vm.menuCount+'个！');
            return;
          }else{
            //后台存储
            var newType = [];
            for(var i=0;i<vm.userMenuNameArrs.length;i++){
              newType.push({
                miid:vm.userMenuNameArrs[i].miid,
                tn:vm.userMenuNameArrs[i].mn,
                etn:vm.userMenuNameArrs[i].men,
                ac:'',
                //特定菜单0,介绍页为1,内容列表2
                nc:vm.userMenuNameArrs[i].mt>6?1:0
              });
            }
            console.log(newType);
            $http({
                method: 'POST',
                url: GlobalUrl+'/exp/ThirdSetNewsType.do',
                params: {
                    session:vm.sess
                },
                data: {newType:newType}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.hiddenShadow();
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
          }
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
          //刷新统计数据
          $('#userChooseCount').text(tempCount);
          $('#userTotalCount').text((vm.menuCount-tempCount)<0?('需要删除 '+Math.abs(vm.menuCount-tempCount)):('还可添加 '+(vm.menuCount-tempCount)));
          for(var i=0;i<tempCount;i++){
            var tempValue = $('.step4_box li').find('.active').parent().eq(i).attr('name');
            vm.userMenuNameArrs.push(JSON.parse(tempValue));
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

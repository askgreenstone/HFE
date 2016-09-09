'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Card3Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.ownUri = '';
        vm.url = '';
        vm.qrcode = '';
        vm.transferurl = TransferUrl;

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess+'&ida='+vm.ida;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
        }

        vm.goBack = function(){
          $window.history.back();
        };


        vm.resetCard = function(){
            $window.location.href = '#/card?session='+vm.sess+'&state=do'+'&ida='+vm.ida;
        }


        // 切换个人与机构
        vm.switchPerOrg = function(num){
          console.log(num);
          if(num === 1){
            window.location.href = '#/card3?session='+vm.sess+'&ida=1';
          }else{
            window.location.href = '#/card3?session='+vm.sess+'&ida=0';
          }
        }

        // 查询该session是个人还是机构
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
                // ida＝0表示只存在个人工作室；ida＝1表示个人，机构工作室都存在，即管理员身份 
                if(data.c == 1000){
                  if(data.ida == 0){
                    vm.orgOrPer = 'orgNotExist';
                  }else{
                    vm.orgOrPer = 'orgOrPer';
                  }
                  vm.headImg = vm.transferurl + data.p;
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }
        


        // 获取微名片编辑状态：
        // 0  完全没有编辑过微名片
        // 1  已经编辑过微名片
        // 2  未编辑，但已经生成微名片数据（上传过头像）
        vm.checkCardState = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/GetMicroCardEditStatus.do?session='+vm.sess+'&ida='+vm.ida
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              // 微名片编辑状态：
              // 0  完全没有编辑过微名片
              // 1  已经编辑过微名片
              // 2  未编辑，但已经生成微名片数据（上传过头像）
              if(data.s == 1){
                vm.getOwnUri();
              }else{
                $window.location.href = '#/card?session='+vm.sess+'&ida='+vm.ida;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });  
        }
        
        // 获取微名片链接以及二维码
        vm.getOwnUri = function(){
          $http({
               method: 'GET',
               url: GlobalUrl+'/exp/CreateMicCardQrCode.do?session='+vm.sess+'&ida='+vm.ida
           }).
           success(function(data, status, headers, config) {
               console.log(data);
               if(data.c == 1000){
                 vm.ownUri = data.ownUri;
                 vm.qrcode = vm.transferurl+data.qrn;
                 vm.url = data.url;
                 console.log(vm.url);
                 var iframe = '<iframe src='+vm.url+' width="320" height="568"></iframe>';
                 $("div.mb_left").append(iframe);    
               }
               
           }).
           error(function(data, status, headers, config) {
               // console.log(data);
               alert('系统开了小差，请刷新页面');
           }); 
        }

        
        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkCardState();
          vm.checkUsrOrOrg();
        }

        init();
    };

    Card3Controller.$inject = injectParams;

    app.register.controller('Card3Controller', Card3Controller);

});

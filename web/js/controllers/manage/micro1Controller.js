'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Micro1Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.transferUrl = TransferUrl;
        vm.selectedState = '';
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

        //重新订制新加参数from，上一步按钮隐藏标示
        vm.resetStep = function(path,from){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&from='+from+'&ida='+vm.ida;
        }

        // 切换个人与机构
        vm.switchPerOrg = function(num){
          console.log(num);
          if(num === 1){
            window.location.href = '#/micro1?session='+vm.sess+'&ida=1';
          }else{
            window.location.href = '#/micro1?session='+vm.sess+'&ida=0';
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
                  if(data.ida == 1){
                    vm.isDeptAdmin = true;
                    vm.orgOrPer = 'orgOrPer';
                  }else{
                    vm.isDeptAdmin = false;
                    vm.orgOrPer = 'orgNotExist';
                  }
                  // 河南律协添加上传视频
                  if(data.uri.indexOf('e24931') > -1){
                    vm.isHenanAdmin = true;
                  }
                  vm.headImg = data.p?(vm.transferUrl+ data.p):vm.transferUrl+'header.jpg';;
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.getQrCode = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/CreateMicWebQrCode.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.qrSrc = vm.transferUrl+data.qrn+'?'+Date.parse(new Date());
                  vm.inputUrl = data.url;
                  console.log(data.theme);
                  vm.getBgar(data.theme);
                  $('#iframe_src').empty();
                  $('#iframe_src').append('<iframe  src="'+data.url+'" width="320" height="545"></iframe>');
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        };


        vm.getBgar = function(ownUri){

          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/GetMicWebModel.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida,
                    toUrl: ownUri
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  localStorage.setItem('ar',data.ml[0].ar);
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
          console.log(vm.ida);
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          
          console.log(vm.abc);
          vm.getQrCode();
          vm.checkUsrOrOrg();
        }

        init();
    };

    Micro1Controller.$inject = injectParams;

    app.register.controller('Micro1Controller', Micro1Controller);

});

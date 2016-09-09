'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$window','$http','GlobalUrl','TransferUrl','Common'];
    var DataController = function($location,$window,$http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.title = '标题';
        vm.webCt = 0;
        vm.phoneCt = 0;
        vm.muCt = 0;
        vm.IDCt = 0;
        vm.usrCt = 0;
        vm.transferUrl = TransferUrl;

        vm.gotoLink = function(path,title){
          location.href = '#/'+path+'?title='+encodeURI(title)+'&ida='+vm.ida;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
        }

        // 切换个人与机构
        vm.switchPerOrg = function(num){
          console.log(num);
          if(num === 1){
            window.location.href = '#/data?session='+vm.sess+'&ida=1';
          }else{
            window.location.href = '#/data?session='+vm.sess+'&ida=0';
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
                  vm.headImg = vm.transferUrl + data.p;
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.getServerStatic = function(index) {
            console.log(index);
            if(!vm.sess) return;
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/ThirdStatistic.do',
                params: {
                  session:vm.sess,
                  qt:index,
                  ida: vm.ida
                },
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
                // console.log(data);
                alert('系统开了小差，请刷新页面');
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
          vm.sess = Common.getUrlParam('session');
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.ida = Common.getUrlParam('ida');
          vm.getServerStatic(1);
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkUsrOrOrg();
        }

        init();
    };

    DataController.$inject = injectParams;

    app.register.controller('DataController', DataController);

});

'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var Reply1Controller = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.startHour = '19';
        vm.startMinute = '00';
        vm.endHour = '09';
        vm.endMinute = '00';
        vm.autoReplyContent = '';

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }
        // 切换模板一，模板二
        vm.switchContent = function(tem){
          console.log(vm.autoReplyContent);
          if(tem == 'tem1'){
            vm.autoReplyContent = '感谢您对我公众号的关注，现在暂时不是我的工作时间，暂时不能及时回复您，如有紧急事宜，请致电13800000000'
          }else if(tem == 'tem2'){
            vm.autoReplyContent = '您好，我现在暂时不方便回复您 ，如果您比较着急，请您直接致电13900000000，您也可以访问我的微网站，点此进入'
          }else{
            vm.autoReplyContent = '';
          }
          // console.log(vm.autoReplyContent);
        }

        // 点击确认按钮提交
        vm.autoReplyConfirm = function(){
          console.log(vm.autoReplyContent);
        }
        // vm.wxAuthor = function(){
        //   $http({
        //       method: 'get',
        //       url: GlobalUrl+'/exp/ThirdAuthRedirect.do',
        //       params: {
        //           session:vm.sess
        //       },
        //       data: {}
        //   }).
        //   success(function(data, status, headers, config) {
        //       console.log(data);
        //       if(data.c == 1000){
        //         // $window.location.href=data.url;
        //         $window.open(data.url,'_blank');
        //         vm.authorFlag = false;
        //       }
        //   }).
        //   error(function(data, status, headers, config) {
        //       // console.log(data);
        //       alert('系统开了小差，请刷新页面');
        //   });
        // }

        // vm.getWxAuthorResult = function(){
        //   $http({
        //       method: 'get',
        //       url: GlobalUrl+'/exp/ThirdAuthInfoQuery.do',
        //       params: {
        //           session:vm.sess
        //       },
        //       data: {}
        //   }).
        //   success(function(data, status, headers, config) {
        //       console.log(data);
        //       if(data.c == 1000){
        //         vm.authorReault = '授权成功！';
        //         vm.authorFlag = false;
        //       }else if(data.c == 1014){
        //         vm.authorReault = '授权失败！';
        //         vm.authorFlag = true;
        //       }
        //   }).
        //   error(function(data, status, headers, config) {
        //       // console.log(data);
        //       alert('系统开了小差，请刷新页面');
        //   });
        // }

        // vm.checkAuthorParam = function(){
        //   vm.wxUrlFlag = Common.getUrlParam('authSucc');
        //   if(vm.wxUrlFlag&&vm.wxUrlFlag == 1){
        //     vm.authorFlag = false;
        //   }else if(vm.wxUrlFlag&&vm.wxUrlFlag == 0){
        //     vm.authorFlag = true;
        //   }else{
        //     vm.authorFlag = true;
        //     return;
        //   }
        // }
        // 输入9，失去焦点变成09
        vm.wxInputBoxChange = function(){
          console.log(vm.startHour);
          console.log(vm.startHour.toString().length);
          vm.startHour = vm.startHour.toString().length > 1 ? vm.startHour : '0' + vm.startHour;
          vm.startMinute = vm.startMinute.toString().length > 1 ? vm.startMinute : '0' + vm.startMinute;
          vm.endHour = vm.endHour.toString().length > 1 ? vm.endHour : '0' + vm.endHour;
          vm.endMinute = vm.endMinute.toString().length > 1 ? vm.endMinute : '0' + vm.endMinute;
          console.log(vm.startMinute);
        }

        // 禁止输入非数字
        vm.replaceNomber = function(){
          vm.startHour = vm.startHour.toString().replace(/[^\d]/g,'');
          vm.startMinute = vm.startMinute.toString().replace(/[^\d]/g,'');
          vm.endHour = vm.endHour.toString().replace(/[^\d]/g,'');
          vm.endMinute = vm.endMinute.toString().replace(/[^\d]/g,'');
          // this.value=this.value.replace(/[^\d]/g,'')
        }
        

        function init(){
          vm.sess = Common.getUrlParam('session');
          console.log(vm.autoReplyContent);
          // vm.switchContent();
        }

        init();

    };

    Reply1Controller.$inject = injectParams;

    app.register.controller('Reply1Controller', Reply1Controller);

});

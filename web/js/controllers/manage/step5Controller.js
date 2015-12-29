'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','Common'];
    var Step5Controller = function($location,$http,$window,GlobalUrl,Common) {
        var vm = this;

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        // vm.submitArticleInfo = function(state){
        //   // 文章摘要长度控制
        //   if(vm.createInfo.describe.length>100){
        //     alert('文章摘要过长，请控制在100字以内！');
        //     return;
        //   }

        //   //引用链接检测
        //   if(vm.createInfo.url&&!vm.isURL(vm.createInfo.url)){
        //     alert('引用链接格式不正确，请输入超链接！');
        //     return;
        //   }

        //   vm.getContent();
        //   if(!vm.nid) {
        //     var datas = {
        //           ntit:vm.createInfo.title,
        //           na:vm.createInfo.describe,
        //           ntId:vm.ntid,
        //           nc:vm.createInfo.content,
        //           ns:state,
        //           nl:vm.createInfo.url,
        //           ntype:2
        //       }
        //   }
        //   else{
        //     var datas = {
        //           ntit:vm.createInfo.title,
        //           na:vm.createInfo.describe,
        //           ntId:vm.ntid,
        //           nId:vm.nid,
        //           nc:vm.createInfo.content,
        //           ns:state,
        //           nl:vm.createInfo.url,
        //           ntype:2
        //       }
        //   }
          
        //   console.dir(datas);
        //   $http({
        //       method: 'POST',
        //       url: GlobalUrl+'/exp/SaveNewsContent.do',
        //       params: {
        //           session:vm.sess
        //       },
        //       data: datas
        //   }).
        //   success(function(data, status, headers, config) {
        //       console.log(data);
        //       if(data.c == 1000){
        //         $window.history.back();
        //       }
        //   }).
        //   error(function(data, status, headers, config) {
        //       console.log(data);
        //   });
        // };

        // vm.queryContentState = function(nid){
        //   // alert(nid);
        //   $http({
        //         method: 'GET',
        //         url: GlobalUrl+'/exp/QueryNewsContent.do',
        //         params: {
        //             nId:nid,
        //             session:vm.sess
        //         },
        //         data: {
                    
        //         }
        //     }).
        //     success(function(data, status, headers, config) {
        //         console.log(data);
        //         if(data.c == 1000){
        //           vm.createInfo.title = data.ntit;
        //           vm.createInfo.describe = data.na;
        //           vm.ntid = data.ntId;
        //           vm.createInfo.content = data.nc;
        //           vm.createInfo.url = data.nl;
        //           setContent();
        //           if(vm.createInfo.url){
        //             // alert(vm.createInfo.url);
        //             $('.ai_checkbox i').addClass('active');
        //             vm.showUeditorFlag = false;
        //           }
        //         }
        //     }).
        //     error(function(data, status, headers, config) {
        //         console.log(data);
        //     });
        // }

        function init(){
          vm.sess = Common.getUrlParam('session');
        }

        init();
    };

    Step5Controller.$inject = injectParams;

    app.register.controller('Step5Controller', Step5Controller);

});

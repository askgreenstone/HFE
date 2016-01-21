'use strict';

define(['App','ZeroClipboard'], function(app,ZeroClipboard) {

    var injectParams = ['$location','$http','$window','GlobalUrl','Common'];
    var AddController = function($location,$http,$window,GlobalUrl,Common) {
        var vm = this;
        vm.title = '标题';
        vm.sess = '';
        vm.titleFlag = '添加文章';
        vm.createInfo = {
          title:'',
          describe:'',
          url:'',
          content:''
        }
        vm.showUeditorFlag = true;

        vm.getContent = function(){
          vm.createInfo.content = UE.getEditor('editor').getContent();
          // console.log('nc:'+vm.createInfo.content);
        }

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.replaceHtmlTag = function(str){
          var newStr = str.replace(/<[^>].*?>/g,'');
          console.log(newStr);
          return newStr;
        }

        vm.submitArticleInfo = function(state){
          // 文章摘要长度控制
          if(vm.createInfo.describe.length>100){
            alert('文章摘要过长，请控制在100字以内！');
            return;
          }

          //引用链接检测
          if(vm.createInfo.url&&!vm.isURL(vm.createInfo.url)){
            alert('引用链接格式不正确，请输入超链接！');
            return;
          }

          vm.getContent();
          if(!vm.nid) {
            var datas = {
                  ntit:vm.createInfo.title,
                  na:vm.createInfo.describe,
                  ntId:vm.ntid,
                  nc:vm.createInfo.content,
                  ns:state,
                  nl:vm.createInfo.url,
                  ntype:2
              }
          }
          else{
            var datas = {
                  ntit:vm.createInfo.title,
                  na:vm.createInfo.describe,
                  ntId:vm.ntid,
                  nId:vm.nid,
                  nc:vm.createInfo.content,
                  ns:state,
                  nl:vm.createInfo.url,
                  ntype:2
              }
          }
          
          console.dir(datas);
          $http({
              method: 'POST',
              url: GlobalUrl+'/exp/SaveNewsContent.do',
              params: {
                  session:vm.sess
              },
              data: datas
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                $window.history.back();
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('网络连接错误或服务器异常！');
          });
        };

        vm.queryContentState = function(nid){
          // alert(nid);
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsContent.do',
                params: {
                    nId:nid,
                    session:vm.sess
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.createInfo.title = data.ntit;
                  vm.createInfo.describe = data.na;
                  vm.ntid = data.ntId;
                  vm.createInfo.content = data.nc;
                  vm.createInfo.url = data.nl;
                  setContent();
                  if(vm.createInfo.url){
                    // alert(vm.createInfo.url);
                    $('.ai_checkbox i').addClass('active');
                    vm.showUeditorFlag = false;
                  }
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        }

        //判断是否为超链接
        vm.isURL = function(str){
            return!!str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
        }

        vm.checkUserChoose = function(){
          var $chooseEle = $('.ai_checkbox i');
          if($chooseEle.hasClass('active')){
            $chooseEle.removeClass('active');
            vm.showUeditorFlag = true;
          }else{
            $chooseEle.addClass('active');
            vm.showUeditorFlag = false;
          }
        }

        function setContent(isAppendTo) {
            var editor = UE.getEditor('editor');
            if(editor)
            {
              try{
                editor.setContent(vm.createInfo.content, isAppendTo);
              }
              catch(error){
                setTimeout(function(){
                  setContent(isAppendTo)
                },500);
              }
            }
            else{
              setTimeout(function(){
                setContent(isAppendTo)
              },500);
            }
        }


        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.ntid = decodeURI(Common.getUrlParam('ntId'));
          vm.nid = Common.getUrlParam('nid');

          var editor = new UE.ui.Editor();
          editor.render('editor');

          window['ZeroClipboard']=ZeroClipboard;

          if(vm.nid){
            vm.titleFlag = '修改文章';
            vm.queryContentState(Common.getUrlParam('nid'));
          }
        }

        init();
    };

    AddController.$inject = injectParams;

    app.register.controller('AddController', AddController);

});

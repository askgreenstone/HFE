'use strict';

define(['js/app/app','ZeroClipboard'], function(app,ZeroClipboard) {

    var injectParams = ['$location','$http','$window','GlobalUrl'];
    var AddController = function($location,$http,$window,GlobalUrl) {
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

        vm.getUrlParam = function(p) {
          var url = location.href; 
          var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
          var paraObj = {} ;
          for (var i=0,j=0; j=paraString[i]; i++){ 
            paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
          } 
          var returnValue = paraObj[p.toLowerCase()]; 
          if(typeof(returnValue)=="undefined"){ 
            return ""; 
          }else{ 
            return  returnValue;
          } 
        };

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

        vm.submitArticleInfo = function(state){
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
              console.log(data);
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
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        function setContent(isAppendTo) {
            UE.getEditor('editor').setContent(vm.createInfo.content, isAppendTo);
        }

        function init(){
          vm.sess = vm.getUrlParam('session');
          vm.title = decodeURI(vm.getUrlParam('title'));
          vm.ntid = decodeURI(vm.getUrlParam('ntId'));
          vm.nid = vm.getUrlParam('nid');
          var editor = new UE.ui.Editor();
          editor.render('editor');
          window['ZeroClipboard']=ZeroClipboard;

          if(vm.nid){
            vm.titleFlag = '修改文章';
            vm.queryContentState(vm.getUrlParam('nid'));
          }
        }

        init();
    };

    AddController.$inject = injectParams;

    app.register.controller('AddController', AddController);

});

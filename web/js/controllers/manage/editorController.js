'use strict';

define(['js/app/app','ZeroClipboard'], function(app,ZeroClipboard) {

    var injectParams = ['$location','$window','$http','GlobalUrl'];
    var EditorController = function($location,$window,$http,GlobalUrl) {

        var vm = this;
        vm.title = '标题';
        vm.isEdit = false;
        vm.nId = '';
        

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

        vm.queryContentState = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsContent.do',
                params: {
                    ntId:vm.ntid,
                    session:vm.sess
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.getServerEdit = data.nc;
                  vm.nId = data.nId;
                  setContent();
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        vm.submitContent = function(){
          vm.userIntroduce = UE.getEditor('editor').getContent();
          if(!vm.userIntroduce){
            alert('请输入内容！');
            return;
          }
          // 判断新增还是修改
          if(!vm.nId){
            console.log('new');
            var datas = {
              ntId:vm.ntid,
              nc:vm.userIntroduce,
              ns:1
            }
          }else{
            console.log('update');
            var datas = {
              ntId:vm.ntid,
              nc:vm.userIntroduce,
              nId:vm.nId,
              ns:1
            }
          }
          
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/SaveNewsContent.do',
                params: {
                    session:vm.sess
                },
                data: datas
            }).
            success(function(data, status, headers, config) {
                // console.log(data);
                if(data.c == 1000){
                  $window.history.back();
                }
            }).
            error(function(data, status, headers, config) {
                alert('发布失败！');
                console.log(data);
            });
        }

        vm.gotoLink = function(path, title) {
            if(title){
              $window.location.href = '#/' + path + '?session='+vm.sess+'&title=' + encodeURI(title);
            }else{
              $window.location.href = '#/' + path+'?session='+vm.sess;
            }
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        function setContent(isAppendTo) {
            UE.getEditor('editor').setContent(vm.getServerEdit, isAppendTo);
        }

        function init(){
          vm.title = decodeURI(vm.getUrlParam('title'));
          vm.ntid = decodeURI(vm.getUrlParam('ntid'));
          vm.sess = vm.getUrlParam('session');

          var editor = new UE.ui.Editor();
          editor.render('editor');

          window['ZeroClipboard']=ZeroClipboard;

          vm.queryContentState();
        }

        init();
    };

    EditorController.$inject = injectParams;

    app.register.controller('EditorController', EditorController);

});

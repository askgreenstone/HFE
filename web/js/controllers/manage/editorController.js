'use strict';

define(['App','ZeroClipboard'], function(app,ZeroClipboard) {

    var injectParams = ['$location','$window','$http','GlobalUrl','Common'];
    var EditorController = function($location,$window,$http,GlobalUrl,Common) {

        var vm = this;
        vm.title = '标题';
        vm.isEdit = false;
        vm.nId = '';

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
              ns:1,
              ntype:1
            }
          }else{
            console.log('update');
            var datas = {
              ntId:vm.ntid,
              nc:vm.userIntroduce,
              nId:vm.nId,
              ns:1,
              ntype:1
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
          var editor = UE.getEditor('editor');
          //ueditor内部bug处理
          if(editor)
          {
            try{
              editor.setContent(vm.getServerEdit, isAppendTo);
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
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.ntid = decodeURI(Common.getUrlParam('ntid'));
          vm.sess = Common.getUrlParam('session');

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

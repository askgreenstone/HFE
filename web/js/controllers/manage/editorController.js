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
                  setContent(true,'');
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        }

        vm.submitContent = function(){
          vm.userIntroduce = UM.getEditor('editor').getContent();
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
          Common.getLoading(true);
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/SaveNewsContent.do',
                params: {
                    session:vm.sess
                },
                data: datas
            }).
            success(function(data, status, headers, config) {
                Common.getLoading(false);
                // console.log(data);
                if(data.c == 1000){
                  $window.history.back();
                }
            }).
            error(function(data, status, headers, config) {
                Common.getLoading(false);
                // alert('发布失败！');
                // console.log(data);
                alert('网络连接错误或服务器异常！');
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

        vm.getUMThemeJson = function(){
          $http({
                method: 'GET',
                url:'/web/js/umTheme.json',
                params: {},
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                var comments = '';
                for(var i=0;i<data.length;i++){
                  var temp = "<div class='box' value='"+data[i].id+"'>" + data[i].code +"</div>";
                  comments += temp;
                }
                $('#um_editor_box').append(comments);

                $('#um_editor_box .box').bind('click',function(event) {
                  vm.queryThemeCode($(this).attr('value'));
                  setTimeout(function(){
                    setContent(false,'');
                  },300)
                  
                });
            }).
            error(function(data, status, headers, config) {
                alert('网络连接错误或服务器异常！');
            });
        }

        //通过id查询code
        vm.queryThemeCode = function(id){
          // vm.getServerEdit = '';
          $http({
                method: 'GET',
                url:'/web/js/umTheme.json',
                params: {},
                data: {}
            }).
            success(function(data, status, headers, config) {
                for(var i=0;i<data.length;i++){
                  if(data[i].id == id){
                    // console.log(data[i].code);
                    vm.getServerEdit = data[i].code;
                  }
                }
            }).
            error(function(data, status, headers, config) {
                alert('网络连接错误或服务器异常！');
            });
        }

        window.onscroll = function(){ 
          $('.edui-toolbar').css('top','60px');
        }

        function setContent(flag,isAppendTo) {
          // var editor = UM.getEditor('editor');
          //选择模版时不需要摧毁实例，标记为false
          if(flag){
            //摧毁um实例
            if(um) um.destroy();
          }
          
          var editor = UM.getEditor('editor');
          //ueditor内部bug处理
          if(editor)
          {
            try{
              editor.setContent(vm.getServerEdit, true);
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
        
        var um = null;
        function init(){
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.ntid = decodeURI(Common.getUrlParam('ntid'));
          vm.sess = Common.getUrlParam('session');

          um = UM.getEditor('editor');

          window['ZeroClipboard']=ZeroClipboard;

          vm.queryContentState();

          vm.getUMThemeJson();
        }

        init();
    };

    EditorController.$inject = injectParams;

    app.register.controller('EditorController', EditorController);

});

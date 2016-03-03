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
          // alert('aaaa');
          // setContent(false,'');
          vm.createInfo.content = UE.getEditor('editor').getContent();
          console.log('nc:'+vm.createInfo.content);
        }

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          // if(um) um.destroy();
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
          // if(vm.createInfo.url&&!vm.isURL(vm.createInfo.url)){
          //   alert('引用链接格式不正确，请输入超链接！');
          //   return;
          // }
          if($('.ai_checkbox i').hasClass('active')&&!vm.createInfo.url){
            alert('请输入超链接！');
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
          Common.getLoading(true);
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
              Common.getLoading(false);
              console.log(data);
              if(data.c == 1000){
                $window.history.back();
              }
          }).
          error(function(data, status, headers, config) {
              Common.getLoading(false);
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
                  setContent(true);
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
            vm.createInfo.url = '';
          }else{
            $chooseEle.addClass('active');
            vm.showUeditorFlag = false;
          }
        }

        //富文本赋值调用方法
        function setContent(isAppendTo) {
          // 解决UE多一行的bug
          UE.getEditor('editor').addOutputRule(function(root){
            // 这里是在解决一个ueditor的bug(对我来说是个bug), 每次编辑框获取焦点的时候都会自动插入<p><br/></p>
            var firstPNode = root.getNodesByTagName("p")[0];
            firstPNode && /^\s*(<br\/>\s*)?$/.test(firstPNode.innerHTML()) && firstPNode.parentNode.removeChild(firstPNode);
          });
          
          var editor = UE.getEditor('editor');
          //ueditor内部bug处理

          if(editor)
          {
            // editor.focus();
            // editor.setContent(vm.getServerEdit, isAppendTo);
            try{
                editor.setContent(vm.createInfo.content, isAppendTo);
                // editor.execCommand('inserthtml',vm.createInfo.content);
                editor.focus();
              }
              catch(error){
                console.log('errtor');
                setTimeout(function(){
                  setContent(isAppendTo);
                },500);
              }
          }
          else{
            setTimeout(function(){
              setContent(true);
            },500);
          }
        }
        // 富文本插入调用方法
        function insertContent(isAppendTo) {
            //解决UE多一行的bug
            UE.getEditor('editor').addOutputRule(function(root){
              // 这里是在解决一个ueditor的bug(对我来说是个bug), 每次编辑框获取焦点的时候都会自动插入<p><br/></p>
              var firstPNode = root.getNodesByTagName("p")[0];
              firstPNode && /^\s*(<br\/>\s*)?$/.test(firstPNode.innerHTML()) && firstPNode.parentNode.removeChild(firstPNode);
            });
            
            var editor = UE.getEditor('editor');
            if(editor)
            { 
              try{
                // editor.setContent(vm.createInfo.content, isAppendTo);
                editor.execCommand('inserthtml',vm.createInfo.content);
                editor.focus();
              }
              catch(error){
                console.log('errtor');
                setTimeout(function(){
                  insertContent(isAppendTo);
                },500);
              }
            }
            else{
              alert('hh');
              setTimeout(function(){
                insertContent(isAppendTo);
              },500);
            }
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
                    insertContent(true);
                  },300)
                });
            }).
            error(function(data, status, headers, config) {
                alert('网络连接错误或服务器异常！');
            });
        }

        //通过id查询code
        vm.queryThemeCode = function(id){
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
                    vm.createInfo.content = data[i].code;
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

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.ntid = decodeURI(Common.getUrlParam('ntId'));
          vm.nid = Common.getUrlParam('nid');

          // var editor = new UE.ui.Editor();
          // editor.render('editor');
          var editor = new UE.ui.Editor({initialFrameHeight:350,scaleEnabled:true});
          editor.render('editor');

          window['ZeroClipboard']=ZeroClipboard;

          if(vm.nid){
            vm.titleFlag = '修改文章';
            vm.queryContentState(Common.getUrlParam('nid'));
          }

          vm.getUMThemeJson();
        }

        init();
    };

    AddController.$inject = injectParams;

    app.register.controller('AddController', AddController);

});

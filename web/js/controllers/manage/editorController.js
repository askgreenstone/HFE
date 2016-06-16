'use strict';

define(['App','ZeroClipboard'], function(app,ZeroClipboard) {

    var injectParams = ['$location','$window','$http','GlobalUrl','Common'];
    var EditorController = function($location,$window,$http,GlobalUrl,Common) {

        var vm = this;
        vm.title = '标题';
        vm.isEdit = false;
        vm.nId = '';
        vm.showUeditorFlag = true;
        vm.createInfo = {
          url:''
        }

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
                  vm.createInfo.url = data.nl;
                  if(vm.createInfo.url){
                    // alert(vm.createInfo.url);
                    $('.ai_checkbox i').addClass('active');
                    vm.showUeditorFlag = false;
                  }
                  setContent(true);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
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

        //判断是否为超链接
        vm.isURL = function(str){
            return!!str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
        }

        vm.submitContent = function(){
          vm.userIntroduce = UE.getEditor('editor').getContent();
          if(!vm.userIntroduce){
            alert('请输入内容！');
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
          // 判断新增还是修改
          if(!vm.nId){
            console.log('new');
            var datas = {
              ntId:vm.ntid,
              nc:vm.userIntroduce,
              ns:1,
              nl:vm.createInfo.url,
              ntype:1
            }
          }else{
            console.log('update');
            var datas = {
              ntId:vm.ntid,
              nc:vm.userIntroduce,
              nId:vm.nId,
              ns:1,
              nl:vm.createInfo.url,
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
                alert('系统开了小差，请刷新页面');
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
                url:GlobalUrl+'/web/js/umTheme.json',
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
                alert('系统开了小差，请刷新页面');
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
                alert('系统开了小差，请刷新页面');
            });
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
                editor.setContent(vm.getServerEdit, isAppendTo);
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
              editor.setContent(vm.getServerEdit, true);
            },500);
          }
        }
        // 富文本插入调用方法
        function insertContent(isAppendTo) {
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
            editor.focus();
            // editor.setContent(vm.getServerEdit, isAppendTo);
            editor.execCommand('inserthtml',vm.getServerEdit);
          }
          else{
            setTimeout(function(){
              editor.setContent(vm.getServerEdit, true);
            },500);
          }
        }
        
        // var um = null;
        function init(){
          // $('#edui1_iframeholder').css({height:'300px'});
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.ntid = decodeURI(Common.getUrlParam('ntid'));
          vm.sess = Common.getUrlParam('session');

          // um = UM.getEditor('editor');
          // ue = UE.getEditor('editor');
          var editor = new UE.ui.Editor({initialFrameHeight:554,scaleEnabled:true});
          editor.render('editor');
          window['ZeroClipboard']=ZeroClipboard;

          vm.queryContentState();

          vm.getUMThemeJson();
        }

        init();
    };

    EditorController.$inject = injectParams;

    app.register.controller('EditorController', EditorController);

});

'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var ManageController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.changeTheme = false;
        vm.radioFlag = false;
        vm.globalState = '';
        vm.user = {
          checkedFlag:false,
          checked:'',
          password:''
        }
        vm.isDeptAdmin = true;
        vm.isHenanAdmin = false;

        //   跳转到文件列表页  doctype1微课堂：2文件；3通知
        vm.menuLink = function(path,type){
          if(type){
            $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida+'&dt='+type;
          }else{
            $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
          }
        }


        vm.gotoLink = function(path, title,ntid) {
            $window.location.href = '#/' + path + '?session='+vm.sess+'&title=' + encodeURI(title)+'&ntId='+ntid+'&ida='+vm.ida;
            // UE.getEditor('editor').destroy();
        };

        // 切换个人与机构
        vm.switchPerOrg = function(num){
          console.log(num);
          if(num === 1){
            window.location.href = '#/manage?session='+vm.sess+'&ida=1';
          }else{
            window.location.href = '#/manage?session='+vm.sess+'&ida=0';
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
                  if(data.ida == 1){
                    vm.isDeptAdmin = true;
                    vm.orgOrPer = 'orgOrPer';
                  }else{
                    vm.isDeptAdmin = false;
                    vm.orgOrPer = 'orgNotExist';
                  }
                  // 河南律协添加上传视频
                  if(data.uri.indexOf('e24931') > -1){
                    vm.isHenanAdmin = true;
                  }
                  vm.headImg = data.p?(vm.transferUrl + data.p):vm.transferUrl+'header.jpg';
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.getAllArticle = function() {
            if(!vm.sess) return;
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsList.do',
                params: {
                  session:vm.sess,
                  ida: vm.ida
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                    vm.allArticle = data.nl;
                    if(data.nl.length>0){
                      vm.changeTheme = true;
                    }
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.getServerCatalogue = function() {
            if(!vm.sess) return;
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsTypes.do',
                params: {
                  session:vm.sess,
                  wf:1,
                  ida: vm.ida
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.introduce = data.ntl[0].td;
                  vm.title1 = data.ntl[0].tn;

                  vm.content = data.ntl[1].td;
                  vm.title2 = data.ntl[1].tn;

                  vm.photos = data.ntl[2].td;
                  vm.title3 = data.ntl[2].tn;
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.storeCurrentSession = function(sess){
          var isSession = localStorage.getItem('globalSession');
          if(isSession){
            localStorage.removeItem('globalSession');
          }

          localStorage.setItem('globalSession',sess);
        }

        //获取用户网站信息
        vm.getServerMenuList = function(){
          // console.log('vm.microWebId:'+vm.microWebId);
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsTypes.do',
                params: {
                    session:vm.sess,
                    //wf:0不包含父菜单，1包含父菜单
                    wf:0,
                    mwm:vm.microWebId,
                    ida: vm.ida
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.microName = data.mwn?data.mwn:'我的工作室';
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        //查询模版信息
        vm.getMicroImg = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/GetMicWebModel.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.microWebId = data.sid;
                  vm.menuCount = data.sbn;
                  vm.getServerMenuList();
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        };

        vm.visityAuthority = function(e,type){
          e.preventDefault();
          $('.mcr_list .authority').find('b').hide();
          $(e.target).find('b').show();
          if(type == 'public'){
            vm.radioFlag = true;
          }else{
            vm.radioFlag = false;
          }
        }

        $(document).bind('click',function(e){
          var target = $(e.target);
          // console.log(target.closest('.authority').length);
          if(target.closest('.authority').length == 0){
            $('.mcr_list .authority').find('b').hide();
          }
        })

        vm.cleanAuthorBox = function(){
          $('.mcr_list .authority').find('b').hide();
        }

        vm.setAuthorState = function(e,name){
          // e.stopPropagation();
          // console.log($(e.target).parent().siblings('.author_psw').val());
          // console.log($('input[name="'+name+'"]:checked').val());
          
          if($('input[name="'+name+'"]:checked').val() == 'public'){
            vm.radioFlag = true;
            vm.globalState = 'public';
          }else{
            vm.radioFlag = false;
            vm.globalState = 'private';
          }
        }

        vm.getInputValue = function(e){
          console.log($(e.target).val());
          vm.user.checked = $(e.target).val();
        }

        vm.test = function(e){
          e.stopPropagation();
        }

        vm.submitAuthor = function(ntid,vp){
          // 密码格式校验
          var reg = /^[0-9a-zA-Z]*$/g;
          if(vm.user.checked.length>5 || vm.user.checked.length>0 && vm.user.checked.length < 5){
            alert('请设置5位密码！');
            return;
          }else if(!reg.test(vm.user.checked)){
            alert('密码格式不正确！');
            return;
          }

          if(vm.globalState == 'public'){
            vm.user.checked = '';
          }
          console.log('submit:'+vm.user.checked+',vm.globalState:'+vm.globalState);
          var tempObj = {};
          if(!vp){
            tempObj={
              'npwd':vm.user.checked,
              'ntid':ntid
            }
          }else{
            tempObj={
              'npwd':vm.user.checked,
              'ntid':ntid,
              'opwd':vp
            }
          }
          $http({
              method: 'POST',
              url: GlobalUrl+'/exp/SetMicWebNewsPwd.do',
              params: {
                  session:vm.sess,
                  ida: vm.ida
              },
              data: tempObj
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                vm.getServerCatalogue();
                vm.cleanAuthorBox();
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.getServerCatalogue();
          vm.storeCurrentSession(vm.sess);
          vm.getMicroImg();
          // vm.getOldIntroduce();
          // vm.getOldContent();
          vm.getAllArticle();
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          
          vm.checkUsrOrOrg();
        }

        init();

    };

    ManageController.$inject = injectParams;

    app.register.controller('ManageController', ManageController);

});

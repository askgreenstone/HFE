'use strict';

define(['App','Sortable'], function(app) {

    var injectParams = ['$location','$http','$window','TransferUrl','GlobalUrl','Common'];
    var Step4Controller = function($location,$http,$window,TransferUrl,GlobalUrl,Common) {
        var vm = this;
        vm.transferUrl = TransferUrl;
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

        vm.goBack = function(){
          $window.history.back();
        };

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
                  vm.headImg = data.p?(vm.transferUrl+ data.p):vm.transferUrl+'header.jpg';;
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.showShadow = function(){
          $('body').css('overflow','hidden');
          console.log($('body').scrollTop());
          $('.step4_shadow').css('marginTop',$('body').scrollTop()).show();
          
          vm.getServerMenuList();
          
          if(vm.serverChooseList&&vm.serverChooseList.length>0){
            vm.getMenuList(vm.serverChooseList.length);
          }else{
            vm.getMenuList(0);
          }

          vm.submitAllInfo(false);
          
          $('#userTotalCount').text();
        }

        vm.hiddenShadow = function(){
          $('.step4_shadow').hide();
          $('body').css('overflow','auto');

          vm.getServerMenuList();

          if(vm.serverChooseList&&vm.serverChooseList.length>0){
            vm.getMenuList(vm.serverChooseList.length);
          }
        }

        vm.cancleChoose = function(){
          vm.hiddenShadow();
        }

        //提交用户选中菜单
        vm.submitUserChoose = function(){
          // console.log(vm.userMenuNameArrs);
          var temp = vm.menuCount-vm.serverChooseList.length;
          if(vm.userMenuNameArrs.length > temp){
            alert('选择菜单数不得超过'+vm.menuCount+'个！');
            return;
          }else{
            //后台存储
            var newType = [];
            for(var i=0;i<vm.userMenuNameArrs.length;i++){
              newType.push({
                miid:vm.userMenuNameArrs[i].miid,
                tn:vm.userMenuNameArrs[i].mn,
                etn:vm.userMenuNameArrs[i].men,
                ac:'',
                mt:vm.userMenuNameArrs[i].mt,
                //特定菜单0,介绍页为1,内容列表2(微相册菜单需要置为3)
                nc:vm.userMenuNameArrs[i].mt>6?1:(vm.userMenuNameArrs[i].mt==5?3:0)
              });
            }
            console.log(newType);
            // 乔凡  添加status＝complete控制工作室定制状态为完成
            var submitData;
            if(vm.origin){
              submitData = {
                session:vm.sess,
                ida: vm.ida,
                status: 'complete'
              }
            }else{
              submitData = {
                session:vm.sess,
                ida: vm.ida
              }
            }
            $http({
                method: 'POST',
                url: GlobalUrl+'/exp/ThirdSetNewsType.do',
                params: submitData,
                data: {newType:newType}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.hiddenShadow();
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
          }
        }

        //统计用户选中菜单数
        vm.countActive = function(){
          // console.log('aaa');
          vm.userMenuNameArrs = [];
          var tempCount = $('.step4_box li').find('.active').length;
          //刷新统计数据
          // $('#userChooseCount').text(vm.menuCount);
          $('#userTotalCount').text((vm.menuCount-vm.serverChooseList.length-tempCount)<0?('需要删除 '+Math.abs(vm.menuCount-vm.serverChooseList.length-tempCount)):('还可添加 '+(vm.menuCount-vm.serverChooseList.length-tempCount)));
          for(var i=0;i<tempCount;i++){
            var tempValue = $('.step4_box li').find('.active').parent().eq(i).attr('name');
            vm.userMenuNameArrs.push(JSON.parse(tempValue));
          }
        }

        //初始化弹窗菜单选中效果
        vm.initMenuActive = function(){
          $('.step4_box ul>li').bind('click',function(){
              if($(this).find('span').hasClass('active')){
                $(this).find('span').removeClass('active');
              }else{
                $(this).find('span').addClass('active');
              }
            vm.countActive();
          })
        }

        //初始化内容页和介绍页
        // vm.initContentAndIndroActive = function(){
        //   $('.step4_list .right>b>span').bind('click',function(){
        //       $('.step4_list .right>b>span').each(function(i){
        //          $(this).removeClass('active');
        //       });
        //       $(this).addClass('active');
        //   })
        // }

        //选中菜单
        vm.checkThis = function(e){
         // console.log(e.currentTarget);
         $(e.currentTarget).siblings('span').removeClass('active');
         $(e.currentTarget).addClass('active');
        }

        //提交菜单更新数据
        vm.submitAllInfo = function(flag){
          Common.getLoading(true);
          if(vm.serverMenuCount > vm.menuCount){
            alert('菜单数目过多，请重新选择！');
            Common.getLoading(false);
            return;
          }

          //列表重新排序
          vm.createSortable();
          //优先提交排序信息
          vm.saveSortable();

          console.log(vm.currentSortArray);
          //组织提交数据
          var submitInfo = [];
          $('.step4_list li').each(function(i){
            // console.log('english:'+$('.step4_list .right>.step4_english').eq(i).val());
             var tempInfo = $('.step4_list li>[type=hidden]').eq(i).val();
             var tempNc = $('.step4_list .right>b').eq(i).find('span').filter('.active').attr('value');
             submitInfo.push({
              nt:parseInt($('.step4_list li').eq(i).attr('id')),
              miid:JSON.parse(tempInfo).miid,
              tn:$('.step4_list .left input').eq(i).val(),
              etn:$('.step4_list .right>.step4_english').eq(i).val(),
              ac:$('.step4_list .right>.step4_ac').eq(i).val(),
              mt:JSON.parse(tempInfo).mt,
              //特定菜单0,介绍页为1,内容列表2(微相册菜单需要置为3)
              nc:tempNc?parseInt(tempNc):(JSON.parse(tempInfo).mt==5?3:-1),
              // mo:parseInt($('.step4_list li').eq(i).attr('value'))
              mo:vm.currentSortArray[i].mo
            });
          });
          console.log(submitInfo);
          var submitData;
          // 乔凡  添加status＝complete控制工作室定制状态为完成
          if(vm.origin){
            submitData = {
              session:vm.sess,
              ida: vm.ida,
              status: 'complete'
            }
          }else{
            submitData = {
              session:vm.sess,
              ida: vm.ida
            }
          }
          //提交后台数据
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/ThirdSetNewsType.do',
                params: submitData,
                data: {newType:submitInfo}
            }).
            success(function(data, status, headers, config) {
                Common.getLoading(false);
                console.log(data);
                if(data.c == 1000){
                  // vm.getServerMenuList();
                  if(flag){
                    if(vm.originFlag){
                      vm.menuLink('step5');
                    }else{
                      vm.menuLink('micro1');
                    }
                  }
                }
            }).
            error(function(data, status, headers, config) {
                Common.getLoading(false);
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        } 

        vm.filterArr = function(arr){
          vm.menu1List = [];//特定菜单功能
          vm.menu2List = [];//介绍页或内容列表
          for(var i=0;i<arr.length;i++){
            if(arr[i].mt>6){
              vm.menu2List.push(arr[i]);
            }else{
              vm.menu1List.push(arr[i]);
            }
          }
        }

        //数组对象中过滤相同数组对象
        vm.splitArrs = function(a,b){
          // console.log(a);
          // console.log(b);
          for(var i = 0;i < a.length;i ++){
            for(var j = 0;j < b.length;j ++){
                 if(a[i].miid == b[j].miid){
                    a.splice(i,1);
                    --i;
                    break;
                 }
            }
          }
          // console.log(a);
          return a;
        }

        //获取服务器菜单集合
        vm.getMenuList = function(){
          vm.countActive();
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryTheModelIcon.do',
                params: {
                    session:vm.sess,
                    mId:vm.microWebId,
                    ida: vm.ida
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  //过滤掉用户已选菜单
                  var resultMenu = vm.splitArrs(data.il,vm.serverChooseList);
                  vm.filterArr(resultMenu);
                  //点击聚焦
                  setTimeout(function(){
                    vm.initMenuActive();
                  }, 300);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        //获取用户选择菜单列表
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
                  vm.microName = data.mwn;
                  vm.serverChooseList = data.ntl;
                  vm.serverMenuCount = data.ntl.length;
                  //菜单渲染完之后初始化拖拽
                  setTimeout(function(){
                    vm.initSortable();
                    // vm.initContentAndIndroActive();
                  }, 300);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        //删除菜单
        vm.deleteMenu = function(id,mt){
          // vm.submitAllInfo(false);
          //微名片和线上咨询菜单不允许删除
          if(mt==2 || mt==4){
            alert('主题默认菜单，不可删除！');
            return;
          }
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/DeleteUriMenu.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {
                    ntId:id
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.getServerMenuList(true);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.initSortable = function(){
            $('.step4_list').sortable().bind('sortupdate', function() {
                vm.currentSortArray=[];
                $('.step4_list li').each(function(i){
                    // newArray.push($(this).val());
                    vm.currentSortArray.push({ntId:$(this).attr('id'),mo:i});
                });
                // console.log(vm.currentSortArray);
                vm.saveSortable(); 
            });
        }

        vm.createSortable = function(){
           vm.currentSortArray=[];
           $('.step4_list li').each(function(i){
              // newArray.push($(this).val());
              vm.currentSortArray.push({ntId:$(this).attr('id'),mo:i});
           });
           return vm.currentSortArray;
        }

        //存储网站名称和拖拽排序
        vm.saveSortable = function(){
          // vm.submitAllInfo(false);
          // 未拖动直接提交
          if(!vm.currentSortArray){
            vm.createSortable(); 
          }
          // vm.createSortable();
          console.log(vm.currentSortArray);
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/ThirdUpdateOrderAndTitle.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {
                    mwn:vm.microName?vm.microName:'我的工作室',
                    mol: vm.currentSortArray,
                    mwm:vm.microWebId
                }
            }).
            success(function(data, status, headers, config) {
                if(data.c == 1000){
                  // vm.getServerMenuList();
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
                  //smt=1,中文加logo组合；smt=2，中英文组合
                  vm.languageType= data.smt;
                  vm.getServerMenuList();
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.origin = Common.getUrlParam('from');
          vm.ida = Common.getUrlParam('ida');
          vm.getMicroImg();
          //更换背景跳转后，通过该标识隐藏上一步按钮
          if(vm.origin){
            vm.originFlag = false;
          }else{
            vm.originFlag = true;
          }
          console.log(vm.originFlag);
          vm.checkUsrOrOrg();
        }

        init();
    };

    Step4Controller.$inject = injectParams;

    app.register.controller('Step4Controller', Step4Controller);

});

'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','GlobalUrl','$window','TransferUrl','Common'];
    var SingleController = function($location,$http,GlobalUrl,$window,TransferUrl,Common) {

        var vm = this;
        vm.title = '';
        vm.updateFlag = false;
        vm.transferUrl = TransferUrl;
        vm.isDeptAdmin = true;
        vm.isHenanAdmin = false;

        vm.gotoLink = function(path,title){
          location.href = '#/'+path+'?title='+encodeURI(title)+'&ida='+vm.ida;
        };
        
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

        vm.deleteOne = function(){
          console.log(vm.pid);
          if(confirm('确认删除该图片吗？')){
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/DeleteWXPhoto.do',
                params: {
                    pId:vm.pid,
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {
                }
            }).
            success(function(data, status, headers, config) {
                console.log('success:'+data);
                if(data.c == 1000){
                  vm.getServerPhotos('delete');
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
          }
        }

        vm.submitDesc = function(){
          console.log('vm.pohtoDesc:'+vm.pohtoDesc);
          console.log('vm.des1:'+vm.des);
          vm.des = vm.pohtoDesc;
          console.log('vm.des2:'+vm.des);
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/SaveWXPhoto.do',
                params: {
                  pId:vm.pid,
                  session:vm.sess,
                  ntId:vm.ntid,
                  ida: vm.ida 
                },
                data: {
                  pd:vm.pohtoDesc
                }
            }).
            success(function(data, status, headers, config) {
                console.log('success:'+JSON.stringify(data));
                if(data.c == 1000){
                  vm.getServerPhotos();
                  vm.updateFlag = false;
                  console.log(vm.updateFlag);
                  vm.pohtoDesc = '';
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.updateDescribe = function(){
          vm.updateFlag = true;
        }

        vm.cancleDescribe = function(){
          vm.updateFlag = false;
        }

        vm.getServerPhotos = function(flag) {
            if(!vm.sess) return;

            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryWXPhotoList.do',
                params: {
                    ntId:vm.ntid,
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.photos = data.pl;
                  vm.initUl(vm.photos.length);
                  if(flag == 'delete'){
                    if(data.pl.length>0){
                      vm.pid = data.pl[0].pId;
                      vm.pth = data.pl[0].pn;
                    }else{
                      $window.history.back();
                    }
                    console.log('删除成功！');
                  }
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        //图片切换效果
        vm.switchImg = function(id,path,title){
          console.log('switchImg des:'+title);
          vm.getServerPhotos();
          vm.pid = id;
          vm.pth = path;
          vm.des = title;
        }

        vm.initUl = function(len){
          var mUl = $('.sbl_list'),
              mBox = $('.ul_box');
          // console.log(len);
          $(mUl).css({
              'width':len*130+2+'px'
          })
          console.log('mUl:'+$(mUl).width());
          console.log('mBox:'+$(mBox).width());
          vm.countClickTime();
        }

        vm.singleLeft = function(){
          var mli = $('.sbl_list');
          $(mli).css({
              'left':0+'px'
          })
          vm.countClickTime();
        }

        vm.countClickTime = function(){
          vm.totleWidth = $('.sbl_list').width();
          vm.viewWidth = $('.ul_box').width();

          vm.times = Math.floor(vm.totleWidth / vm.viewWidth);
          console.log('global times:'+vm.times);
          vm.flag = 0;
        }

        
        vm.singleRight = function(){
          console.log(vm.times);
          vm.flag++;
          if(vm.times == 0){
            return;
          }else{
            $('.sbl_list').css({
              'left':-vm.viewWidth*vm.flag+'px'
            })
            vm.times--;
          }
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ntid = Common.getUrlParam('ntid');
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.pid = decodeURI(Common.getUrlParam('pid'));
          vm.pth = decodeURI(Common.getUrlParam('pth'));
          //当前图片描述
          vm.des = vm.title;
          vm.getServerPhotos();
          vm.ida = Common.getUrlParam('ida');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkUsrOrOrg();
        }

        init();
    };

    SingleController.$inject = injectParams;

    app.register.controller('SingleController', SingleController);

});

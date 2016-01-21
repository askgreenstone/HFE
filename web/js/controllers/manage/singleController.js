'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','GlobalUrl','$window','TransferUrl','Common'];
    var SingleController = function($location,$http,GlobalUrl,$window,TransferUrl,Common) {

        var vm = this;
        vm.title = '';
        vm.updateFlag = false;
        vm.transferUrl = TransferUrl;

        vm.gotoLink = function(path,title){
          location.href = '#/'+path+'?title='+encodeURI(title);
        };
        
        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.deleteOne = function(){
          console.log(vm.pid);
          if(confirm('确认删除该图片吗？')){
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/DeleteWXPhoto.do',
                params: {
                    pId:vm.pid,
                    session:vm.sess
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
                alert('网络连接错误或服务器异常！');
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
                  ntId:vm.ntid 
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
                alert('网络连接错误或服务器异常！');
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
                    session:vm.sess
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
                alert('网络连接错误或服务器异常！');
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
        }

        init();
    };

    SingleController.$inject = injectParams;

    app.register.controller('SingleController', SingleController);

});

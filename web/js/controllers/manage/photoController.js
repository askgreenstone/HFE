'use strict';

define(['App','Sortable'], function(app) {

    var injectParams = ['$location','$http','GlobalUrl','$window','TransferUrl','Common'];
    var PhotoController = function($location,$http,GlobalUrl,$window,TransferUrl,Common) {

        var vm = this;
        vm.title = '标题';
        vm.sess = '';
        vm.ntid = 0;
        vm.transferUrl = TransferUrl;

        vm.gotoLink = function(path,title,pid,pth){
          if(!title){
            title = '暂无描述';
          }
          location.href = '#/'+path+'?session='+vm.sess+'&title='+encodeURI(title)+'&pid='+pid+'&pth='+pth+'&ntid='+vm.ntid+'&ida='+vm.ida;
        };
        
        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
        }

        vm.gotoUpload = function(path){
          location.href = '#/'+path+'?session='+vm.sess+'&ntId='+vm.ntid+'&ida='+vm.ida;
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
                  vm.orgOrPer = 'orgNotExist';
                  vm.headImg = vm.transferUrl + data.p;
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }


        vm.getServerPhotos = function() {
            if(!vm.sess) return;

            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryWXPhotoList.do?ntId='+vm.ntid,
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.photos = data.pl;
                  setTimeout(function(){
                    vm.initSortable();
                  }, 300);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.initSortable = function(){
            $('.photo_list').sortable().bind('sortupdate', function() {
                vm.currentSortArray=[];
                $('.photo_list li').each(function(i){
                    // newArray.push($(this).val());
                    vm.currentSortArray.push({pi:parseInt($(this).attr('id')),sk:i});
                });
                console.log(vm.currentSortArray);
                vm.saveSortable();
            });
        }

        vm.saveSortable = function(){
          // var pl = vm.currentSortArray;
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/SortWXPhotoList.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {pl:vm.currentSortArray}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ntid = Common.getUrlParam('ntId');
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.getServerPhotos();
          vm.ida = Common.getUrlParam('ida');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkUsrOrOrg();
        }

        init();
    };

    PhotoController.$inject = injectParams;

    app.register.controller('PhotoController', PhotoController);

});

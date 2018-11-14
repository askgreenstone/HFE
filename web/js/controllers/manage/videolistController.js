'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var VideolistController = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.transferurl = TransferUrl;
        vm.typeId = '';
        vm.typeNm = '';
        vm.isDeptAdmin = true;
        vm.isHenanAdmin = false;
        vm.docTypeName = '微课堂';
        vm.uploadVideo = false;
        vm.pageNum = 0;
        vm.ownUri = '';
        vm.artitleList = [];
        vm.getMoreFlag = true;

        vm.gotoLink = function(){
          location.href = '#/manage?session='+vm.sess+'&ida='+vm.ida;
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



        Date.prototype.Format = function(fmt){ //author: meizz   
          var o = {   
            "M+" : this.getMonth()+1,                 //月份   
            "d+" : this.getDate(),                    //日   
            "h+" : this.getHours(),                   //小时   
            "m+" : this.getMinutes(),                 //分   
            "s+" : this.getSeconds(),                 //秒   
            "q+" : Math.floor((this.getMonth()+3)/3), //季度   
            "S"  : this.getMilliseconds()             //毫秒   
          };   
          if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
          for(var k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
          return fmt;   
        } 

        vm.getLocalTime = function(now) {  
          // console.log(now);
          if(!now)  return;
          var time1 = new Date(now).Format("yyyy-MM-dd hh:mm:ss");  
          return time1;      
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
                  vm.ownUri = data.uri;
                  // 河南律协添加上传视频
                  // if(data.uri.indexOf('e24931') > -1){
                  //   vm.isHenanAdmin = true;
                  //   vm.GetLiveDetailNoList(data.uri)
                  // }
                  vm.isHenanAdmin = true;
                  vm.GetLiveDetailNoList()


                  vm.headImg = data.p?(vm.transferurl + data.p):vm.transferurl+'header.jpg';
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        // 查询直播分类
        vm.GetLiveDetailNoList = function(){
          console.log(vm.pageNum);
          $http({
            method: 'GET',
            url: GlobalUrl+'/exp/GetLiveDetailNoList.do',
            params: {
              dou: vm.ownUri,
              lid: 0,
              ip: 1,
              c: 10,
              p: vm.pageNum
            },
            data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                console.log(data.ll.length);
                console.log(vm.getMoreFlag);
                if(data.ll.length < 10){
                  console.log(data.ll.length);
                  vm.getMoreFlag = false;
                }
                vm.artitleList = vm.artitleList.concat(data.ll);
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }


        // 加载更多
        vm.getMore = function(){
          vm.pageNum += 1;
          vm.GetLiveDetailNoList();
        }


        // 点击分类跳转uploadfile
        vm.gotoUpload = function(ldid){
          window.location.href = '#/uploadvideo?session='+vm.sess+'&ida='+vm.ida+'&ldid='+ldid;
        }




        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.dt = Common.getUrlParam('dt');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          if(vm.dt == 1){
            vm.docTypeName = '微课堂';
            vm.uploadVideo = true;
          }else if(vm.dt == 2){
            vm.docTypeName = '文件';
            vm.uploadVideo = true;
          }else if(vm.dt == 3){
            vm.docTypeName = '通知';
            vm.uploadVideo = true;
          }else{
            vm.docTypeName = '上传视频'
          }
          vm.checkUsrOrOrg();
          
        }

        init();
    };

    VideolistController.$inject = injectParams;

    app.register.controller('VideolistController', VideolistController);

});

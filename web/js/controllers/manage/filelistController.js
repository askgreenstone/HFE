'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var FilelistController = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.transferurl = TransferUrl;
        vm.typeId = '';
        vm.typeNm = '';
        vm.isDeptAdmin = true;

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
                  vm.orgOrPer = 'orgNotExist';
                  if(data.ida == 1){
                    vm.isDeptAdmin = true;
                  }else{
                    vm.isDeptAdmin = false;
                  }
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


        
        // 查询文件分类
        vm.queryDeptDocs = function(){
          $http({
            method: 'GET',
            url: GlobalUrl+'/exp/QueryDeptDocTypes.do',
            params: {
              session:vm.sess,
              dt: vm.dt
            },
            data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                vm.artitleList = data.li;
                vm.order = data.li?(data.li.length+1):1;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }


        
        // 删除文件分类
        vm.deleteFileClass = function(typeId){
          var data = {
            li: [typeId]
          }
          var flag = window.confirm('确定要删除么？');
          if(flag){
            $http({
              method: 'POST',
              url: GlobalUrl+'/exp/DeleteDeptDocTypes.do',
              params: {
                  session:vm.sess
              },
              data: JSON.stringify(data)
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.queryDeptDocs()
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
          }
        }




        // 点击分类跳转uploadfile
        vm.gotoUpload = function(tid,order){
          console.log(order);
          console.log(vm.dt);
          window.location.href = '#/uploadfile?session='+vm.sess+'&ida='+vm.ida+'&order='+order+'&tid='+tid+'&dt='+vm.dt;
        }



        // 点击加号跳转uploadfile
        vm.gotoAddFile = function(){
          console.log(vm.typeId);
          console.log(vm.typeNm);
          console.log(vm.order);
          console.log(vm.dt);
          window.location.href = '#/uploadfile?session='+vm.sess+'&ida='+vm.ida+'&order='+vm.order+'&dt='+vm.dt;
        }


        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.dt = Common.getUrlParam('dt');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkUsrOrOrg();
          vm.queryDeptDocs();
        }

        init();
    };

    FilelistController.$inject = injectParams;

    app.register.controller('FilelistController', FilelistController);

});

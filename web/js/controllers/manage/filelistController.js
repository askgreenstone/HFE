'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var FilelistController = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.transferurl = TransferUrl;

        vm.gotoLink = function(){
          location.href = '#/manage?session='+vm.sess+'&ida='+vm.ida;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
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
                  if(data.ida == 0){
                    vm.orgOrPer = 'orgNotExist';
                  }else{
                    vm.orgOrPer = 'orgOrPer';
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

        vm.queryDocType = function(){
          $http({
            method: 'GET',
            url: GlobalUrl+'/exp/QueryDeptDocTypes.do',
            params: {
                session:vm.sess,
                tl: 1
            },
            data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                vm.titleList = data.li;
                var typeId = data.li[0].tid;
                var typeNm = data.li[0].tn;
                console.log(typeId);
                vm.queryDeptDocs(typeId,typeNm);
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }


        $('.contentClass').on('click','li',function(){
          $(this).addClass('active').siblings('li').removeClass('active');
        })       
        

        // 查询文件分类下具体文章
        vm.queryDeptDocs = function(typeId,typeNm){
          $http({
            method: 'GET',
            url: GlobalUrl+'/exp/QueryDeptDocTypes.do',
            params: {
              session:vm.sess,
              tl: 2
            },
            data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                vm.artitleList = data.li;
                vm.ftid = typeId;
                vm.ftnm = typeNm;
                console.log(vm.ftid);
                console.log(typeNm);
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }

        // 删除某篇文章
        vm.deleteArticle = function(typeId){
          var data = {
            dl: [
              {
                did: typeId
              }
            ]
          }
          var flag = window.confirm('确定要删除么？');
          if(flag){
            $http({
              method: 'POST',
              url: GlobalUrl+'/exp/DeleteDeptDocs.do',
              params: {
                  session:vm.sess
              },
              data: JSON.stringify(data)
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  // vm.artitleList = data.li;
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
          }
        }

        vm.gotoAddFile = function(){
          console.log(vm.ftid);
          window.location.href = '#/uploadfile?session='+vm.sess+'&ida='+vm.ida+'&ftid='+vm.ftid+'&ftnm='+vm.ftnm;
        }


        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkUsrOrOrg();
          vm.queryDocType();
        }

        init();
    };

    FilelistController.$inject = injectParams;

    app.register.controller('FilelistController', FilelistController);

});

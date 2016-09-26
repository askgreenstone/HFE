'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var FilelistController = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.transferurl = TransferUrl;
        vm.typeId = '';
        vm.typeNm = '';

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
                  vm.orgOrPer = 'orgNotExist';
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


        // 查询文件分类(1级分类)  tl:1

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
        

        // 查询文件分类下(2级分类)   tl:2
        vm.queryDeptDocs = function(typeId,typeNm){
          $http({
            method: 'GET',
            url: GlobalUrl+'/exp/QueryDeptDocTypes.do',
            params: {
              session:vm.sess,
              tl: 2,
              ftid: typeId
            },
            data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                vm.artitleList = data.li;
                vm.typeId = typeId;
                vm.typeNm = typeNm;
                vm.order = data.li?(data.li.length+1):1;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }


        // 添加新的一级分类
        vm.addNewTitle = function(){
          $('body').css('overflow','hidden');
          $('.filelist_addNewTitle').css('marginTop',$('body').scrollTop()).show();

        }

        // 点击关闭按钮/取消/操作
        vm.hiddenShadow = function(){
          $('body').css('overflow','auto');
          $('.filelist_addNewTitle').hide();
        }

        // 点击确定添加一级分类
        vm.addNewTitleClass = function(){
          var text = $('.filelist_shadow input').val();
          var order = $('.contentClass li').length+1;
          console.log(order);
          if(!text){
            alert('请输入新的分类名称！');
            return;
          }else{
            var data = {
              tn: text,
              tl: 1,
              o: order
            }
            $http({
              method: 'POST',
              url: GlobalUrl+'/exp/AddDeptDocTypes.do',
              params: {
                session:vm.sess
              },
              data: JSON.stringify(data)
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.hiddenShadow();
                  vm.queryDocType();
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
            
          }
        }

        // 删除二级分类
        vm.deleteArticle = function(typeId){
          var data = {
            li: [typeId]
          }
          console.log(vm.typeId);
          console.log(vm.typeNm);
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
                  console.log(vm.typeId,vm.typeNm);
                  vm.queryDeptDocs(vm.typeId,vm.typeNm)
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
          }
        }




        // 点击二级分类跳转uploadfile
        vm.gotoUpload = function(tid,order){
          console.log(order);
          window.location.href = '#/uploadfile?session='+vm.sess+'&ida='+vm.ida+'&ftid='+vm.typeId+'&ftnm='+vm.typeNm+'&order='+order+'&tid='+tid;
        }



        // 点击加号跳转uploadfile
        vm.gotoAddFile = function(){
          console.log(vm.typeId);
          console.log(vm.typeNm);
          console.log(vm.order);
          window.location.href = '#/uploadfile?session='+vm.sess+'&ida='+vm.ida+'&ftid='+vm.typeId+'&ftnm='+vm.typeNm+'&order='+vm.order;
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

'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location','$http','GlobalUrl','$window'];
    var ListController = function($location,$http,GlobalUrl,$window) {

        var vm = this;
        vm.title = '标题';
        vm.sess = '';

        vm.getUrlParam = function(p) {
          var url = location.href; 
          var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
          var paraObj = {} ;
          for (var i=0,j=0; j=paraString[i]; i++){ 
            paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
          } 
          var returnValue = paraObj[p.toLowerCase()]; 
          if(typeof(returnValue)=="undefined"){ 
            return ""; 
          }else{ 
            return  returnValue;
          } 
        };

        vm.gotoLink = function(path) {
          var title = vm.getUrlParam('title'),
              ntid = vm.getUrlParam('ntId');
          location.href = '#/' + path + '?session='+vm.sess+'&title=' + title +'&ntId='+ntid;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.getArticleList = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsList.do',
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
                  vm.articleList = data.nl;
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        };

        vm.deleteArticle = function(nid){
          if(confirm('确定要删除吗？')){
            $http({
                method: 'POST',
                url: GlobalUrl+'/exp/DeleteNews.do',
                params: {
                    session:vm.sess
                },
                data: {
                    nId:nid
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.getArticleList();
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
          }
        }

        vm.updateArticle = function(nid){
          location.href = '#/add?session='+vm.sess+'&title='+vm.getUrlParam('title')+'&nid='+nid;
        }

        vm.publishArticle = function(nid){
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/UpdateNewsStatus.do',
                params: {
                    session:vm.sess
                },
                data: {
                    nId:nid
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.getArticleList();
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        function init(){
          vm.title = decodeURI(vm.getUrlParam('title'));
          vm.ntid = vm.getUrlParam('ntId');
          vm.sess = vm.getUrlParam('session');
          vm.getArticleList();
        }

        init();
    };

    ListController.$inject = injectParams;

    app.register.controller('ListController', ListController);

});

'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','GlobalUrl','$window','Common'];
    var ListController = function($location,$http,GlobalUrl,$window,Common) {

        var vm = this;
        vm.title = '标题';
        vm.sess = '';

        vm.gotoLink = function(path) {
          var title = Common.getUrlParam('title'),
              ntid = Common.getUrlParam('ntId');
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
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.ntid = Common.getUrlParam('ntId');
          vm.sess = Common.getUrlParam('session');
          vm.getArticleList();
        }

        init();
    };

    ListController.$inject = injectParams;

    app.register.controller('ListController', ListController);

});

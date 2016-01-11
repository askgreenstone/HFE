'use strict';

define(['App','Sortable'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','Common'];
    var Step4Controller = function($location,$http,$window,GlobalUrl,Common) {
        var vm = this;

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.initSortable = function(){
            $('.step4_list').sortable().bind('sortupdate', function() {
                var newArray=[];
                var temp;
                $('.step4_list li').each(function(i){
                    newArray.push($(this).val());
                });
                
                var message="当前排序："+newArray;
                console.log(message);
                
            });
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.initSortable();
        }

        init();
    };

    Step4Controller.$inject = injectParams;

    app.register.controller('Step4Controller', Step4Controller);

});

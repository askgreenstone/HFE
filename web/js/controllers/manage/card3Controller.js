'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Card3Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.ownUri = '';
        vm.url = '';
        vm.qrcode = '';
        vm.transferurl = TransferUrl;

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };


        vm.resetCard = function(){
            $window.location.href = '#/card?session='+vm.sess+'&state=do';
        }
        
        vm.getOwnUri = function(){
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryMicroCard.do?session='+vm.sess
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.Mob){
                    vm.ownUri = data.uri;
                    vm.qrcode = vm.transferurl+data.QR;
                    vm.url = GlobalUrl+'/mobile/#/card?ownUri='+vm.ownUri;
                    console.log(vm.url);
                    var iframe = '<iframe src='+vm.url+' width="320" height="720"></iframe>';
                    $("div.mb_left").append(iframe);
                }else{
                    alert("您还没有制定您的微名片，点击确定跳转到资料填写页面");
                    $window.location.href = '#/card?session='+vm.sess;
                }
                
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            }); 
        }

        
        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.getOwnUri();
        }

        init();
    };

    Card3Controller.$inject = injectParams;

    app.register.controller('Card3Controller', Card3Controller);

});

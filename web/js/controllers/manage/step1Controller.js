'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var Step1Controller = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.transferUrl = TransferUrl;
        vm.id = '';
        vm.url = '';
        vm.ar = '';
        vm.oid = '';

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }

        vm.goBack = function(){
          $window.history.back();
        };

        vm.getMicroImg = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/GetMicWebModel.do',
                params: {
                    session:vm.sess
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.showList = data.ml;
                  
                  //回显处理
                  if(data.sid){
                    vm.CurrentTheme = data.sid;
                    console.log(vm.CurrentTheme);
                    vm.setPageInfo(data.sid,data.stu,data.sar);
                    vm.oid = data.sid;
                  }
                  
                  setTimeout(function(){
                    // $('.step1_theme li').eq(0).addClass('active');
                    $('.step1_theme li').bind('click',function(){
                      $(this).siblings().removeClass('active');
                      $(this).addClass('active');
                    })
                  }, 300);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        };

        vm.setPageInfo = function(id,url,ar){
          vm.id = id;
          vm.url = url;
          vm.ar = ar;
        }

        vm.saveMicroImg = function(){
          if(!vm.id||!vm.url){
            alert('请选择模版！');
            return false;
          }
          if(vm.oid && vm.oid != vm.id){
            var bool = confirm('请注意！切换主题模板后，您原先设定的背景图、logo以及菜单项都会被清空，您发布的文章、上传的相册会保留在素材库可选择新目录进行重新发布。');
            if(bool){
              vm.saveMicroBg();
            }
          }else{
            vm.saveMicroBg();
          }
          // vm.saveMicroBg();
        } 

        vm.saveMicroBg = function(){
          var tempObj = {'wmi':vm.id,'wmu':vm.url};
          console.log(tempObj);
          $http({
              method: 'POST',
              url: GlobalUrl+'/exp/ChooseMicWebModel.do',
              params: {
                  session:vm.sess
              },
              data: JSON.stringify(tempObj)
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                localStorage.ar = vm.ar;
                $window.location.href = '#/step2?session='+vm.sess+'&ar='+vm.ar;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('网络连接错误或服务器异常！');
          });
        }

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.getMicroImg();
        }

        init();
    };

    Step1Controller.$inject = injectParams;

    app.register.controller('Step1Controller', Step1Controller);

});

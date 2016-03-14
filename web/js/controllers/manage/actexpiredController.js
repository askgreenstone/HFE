'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var ActexpiredController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.globalUrl = GlobalUrl;
        vm.endTime = '';

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }


        vm.setInputChecked = function(){
          $('#active').prop('checked',true);
        }

        vm.getEndTime = function(){

          $http({
              method: 'get',
              url: GlobalUrl+'/exp/QueryMicWebActivate.do',
              params: {session:vm.sess},
              data: {}
          }).
          success(function(data) {
            console.log(data);
            if(data.c == 1000){
              if(data.as == 1 || data.as == 2){
                 window.location.href = '#/step1?session='+vm.sess;
              }else if(data.as == 3 || data.as == 4 ){
                // localStorage.setItem('activeEndTime',data.at);
                vm.endTime = vm.getLocalTime(data.at);
                window.location.href = '#/actexpired?session='+vm.sess;
              }else if(data.as == 0){
                vm.getAuthenState();
              }
            }
          }).
          error(function(){
            alert('网络连接错误或服务器异常！');
          })
        }

        Date.prototype.Format = function(fmt)   
          { //author: meizz   
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
          console.log(now);
          if(!now)  return;
          var time1 = new Date(now).Format("yyyy-MM-dd hh:mm:ss");  
          return time1;      
        } 
        vm.setActiveState = function(){
          $.ajax({
            type : 'post',
            url : vm.globalUrl + '/exp/ActivateMicWeb.do?session='+ vm.sess,
            data : '',
            dataType:'json',
            contentType:'application/json',
            success : function(data) {
              console.log(data);
              if(data.c == 1000){
                 window.location.href = '#/manage?session='+vm.sess;
              }
            },
            error : function(){
              alert('网络连接错误或服务器异常！');
            }
          })
        }

      

        vm.gotoLink = function(path, title,ntid) {
            $window.location.href = '#/' + path + '?session='+vm.sess+'&title=' + encodeURI(title)+'&ntId='+ntid;
            UE.getEditor('editor').destroy();
        };

        vm.getServerCatalogue = function() {
            if(!vm.sess) return;
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsTypes.do',
                params: {session:vm.sess,wf:1},
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.introduce = data.ntl[0].td;
                  vm.title1 = data.ntl[0].tn;

                  vm.content = data.ntl[1].td;
                  vm.title2 = data.ntl[1].tn;

                  vm.photos = data.ntl[2].td;
                  vm.title3 = data.ntl[2].tn;
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        }

        vm.storeCurrentSession = function(sess){
          var isSession = localStorage.getItem('globalSession');
          if(isSession){
            localStorage.removeItem('globalSession');
          }

          localStorage.setItem('globalSession',sess);
        }

        //获取用户网站信息
        vm.getServerMenuList = function(){
          // console.log('vm.microWebId:'+vm.microWebId);
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsTypes.do',
                params: {
                    session:vm.sess,
                    //wf:0不包含父菜单，1包含父菜单
                    wf:0,
                    mwm:vm.microWebId
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.microName = data.mwn;
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        }

        //查询模版信息
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
                  vm.microWebId = data.sid;
                  vm.menuCount = data.sbn;
                  vm.getServerMenuList();
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        };

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.setInputChecked();
          vm.storeCurrentSession(vm.sess);
          vm.getMicroImg();
          vm.getEndTime();
        }

        init();

    };

    ActexpiredController.$inject = injectParams;

    app.register.controller('ActexpiredController', ActexpiredController);

});

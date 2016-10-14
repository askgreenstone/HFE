'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var ToolsController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.globalUrl = GlobalUrl;

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
        }



        // 切换个人与机构
        vm.switchPerOrg = function(num){
          console.log(num);
          if(num === 1){
            window.location.href = '#/tools?session='+vm.sess+'&ida=1';
          }else{
            window.location.href = '#/tools?session='+vm.sess+'&ida=0';
          }
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
                  // 不区分个人与机构 
                  vm.orgOrPer = 'orgNotExist';
                  vm.headImg = data.p?(vm.transferUrl + data.p):vm.transferUrl+'header.jpg';
                  vm.lawyerName = data.n;
                  console.log(vm.headImg);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }



        //工具分类预处理，返回处理后数组
        vm.checkToolsType = function(jsons,num){
          var tempType = [];
          console.log(jsons);
          for(var i=0;i<jsons.length;i++){
            //特定菜单tbt:2-特色工具，3-查询工具，4-计算工具
            if(jsons[i].tbt==num){
              tempType.push({
                id:jsons[i].id,     
                idt:jsons[i].idt,
                tbn:jsons[i].tbn,     //工具分类
                ti:jsons[i].ti,       //工具图片
                tn:jsons[i].tn,       //工具名称
                tt:jsons[i].tt
              });
            }
          }
          console.log(tempType);
          return tempType;
        }


        // 查询专家工具 
        vm.getExpTools = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/GetExpTools.do',
              params: {
                  session:vm.sess,
                  ia: 2
              },
              data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                // ida＝0表示只存在个人工作室；ida＝1表示个人，机构工作室都存在，即管理员身份 
                if(data.c == 1000){
                  vm.specialTools = vm.checkToolsType(data.tl,2);
                  vm.searchTools = vm.checkToolsType(data.tl,3);
                  vm.calculate = vm.checkToolsType(data.tl,4);
                  console.log(vm.toolsone);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        // 点击不同工具跳转
        vm.gotoIframe = function(typeNum){
          // 1管理 2企查查 3法律法规 4裁判文书 5司法案例 6天数计算器
          console.log(typeNum);
          if(typeNum == 2){
            alert('请到app端体验此功能');
            return;
          }else{
            window.location.href = '#/tooliframe?session='+vm.sess+'&ida='+vm.ida+'&typeNum='+typeNum;
          }
        }

        
        

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.isDeptAdmin = vm.ida == 0?false:true;
          vm.checkUsrOrOrg();
          vm.getExpTools();
        }

        init();

    };

    ToolsController.$inject = injectParams;

    app.register.controller('ToolsController', ToolsController);

});

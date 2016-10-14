'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var TooliframeController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.globalUrl = GlobalUrl;

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
        }


        vm.goBack = function(){
          $window.history.back();
        };



        

        // 获取typeNum参数，判断iframe链接
        // 1管理 2企查查 3法律法规 4裁判文书 5司法案例 6天数计算器
        vm.getToolsIframe = function(){
          if(vm.typeNum == 3){
            vm.iframeSrc = 'http://www.pkulaw.cn/cluster_call_form.aspx?menu_item=law';
            console.log(vm.iframeSrc);
            vm.dateBox = false;
          }else if(vm.typeNum == 4){
            vm.iframeSrc = 'http://wenshu.court.gov.cn/';
            console.log(vm.iframeSrc);
            vm.dateBox = false;
          }else if(vm.typeNum == 5){
            vm.iframeSrc = 'http://www.pkulaw.cn/Case/';
            console.log(vm.iframeSrc);
            vm.dateBox = false;            
          }else if(vm.typeNum == 6){
            vm.iframeSrc = false;
            vm.dateBox = true;
          }
          var iframe = '<iframe src='+vm.iframeSrc+' class="toolIframe"></iframe>';
          $("div.manage_content").append(iframe);
          
        }


        // 计算日期时间差
        vm.calculateDate = function(){
          var dateStart = $('#dateStart').val();
          var dateEnd = $('#dateEnd').val();
          var startTime = new Date(dateStart.replace(/-/g,'-'));
          var endTime = new Date(dateEnd.replace(/-/g,'-'));
          vm.time = (endTime - startTime)*1/1000/24/3600;
          if(!dateStart){
            alert('请输入开始时间！');
            return;
          }else if(!dateEnd){
            alert('请输入结束时间！');
            return;
          }else if(vm.time<0){
            alert('请保证结束时间大于开始时间！');
            return;
          }
          console.log(vm.time);

        }
        // 重置日期
        vm.resetDate = function(){
          console.log($('#dateStart').val());
          $('#dateStart').val('');
          $('#dateEnd').val('');
          vm.time = '';
        }

        //  日期推算
        vm.dateCalculate = function(){
          console.log(vm.dateSelect);
          console.log(vm.dateNumber);
          var dateStart = new Date(vm.dateSelect).getTime();
          var dateEnd = dateStart + vm.dateNumber*24*3600*1000;
          console.log(dateStart);
          vm.dateCalcul = new Date(dateEnd).getFullYear()+'年'+(new Date(dateEnd).getMonth()+1)+'月'+new Date(dateEnd).getDate()+'日'
        }

        // 企查查接口返回加密在线地址
        // 暂时不做web端
        // vm.getMd5Url = function(){
        //   $http({
        //       method: 'GET',
        //       url: GlobalUrl+'/exp/GetQiChaChaAuthUrl.do',
        //       params: {
        //           session:vm.sess
        //       },
        //       data: {}
        //     }).
        //     success(function(data, status, headers, config) {
        //         console.log(data);
        //         // ida＝0表示只存在个人工作室；ida＝1表示个人，机构工作室都存在，即管理员身份 
        //         if(data.c == 1000){
        //           vm.iframeSrc = data.aUrl;
        //           var iframe = '<iframe src='+vm.iframeSrc+' width="375" height="667" style="border:none;margin-left:375px;"></iframe>';
        //           $("div.manage_content").append(iframe);
        //         }
        //     }).
        //     error(function(data, status, headers, config) {
        //         // console.log(data);
        //         alert('系统开了小差，请刷新页面');
        //     });
        // }



        

        
        

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.typeNum = Common.getUrlParam('typeNum');
          vm.getToolsIframe();
        }

        init();

    };

    TooliframeController.$inject = injectParams;

    app.register.controller('TooliframeController', TooliframeController);

});

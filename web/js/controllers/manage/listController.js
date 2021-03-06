'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','GlobalUrl','$window','TransferUrl','Common'];
    var ListController = function($location,$http,GlobalUrl,$window,TransferUrl,Common) {

        var vm = this;
        vm.title = '标题';
        vm.sess = '';
        vm.selectedState = false;
        vm.addArticle = true;
        vm.transferUrl = TransferUrl;
        vm.isDeptAdmin = true;
        vm.isHenanAdmin = false;

        vm.gotoLink = function(path) {
          var title = Common.getUrlParam('title'),
              ntid = Common.getUrlParam('ntId');
          $window.location.href = '#/' + path + '?session='+vm.sess+'&title=' + title +'&ntId='+ntid+'&ts='+new Date().getTime()+'&ida='+vm.ida;
        };

        //   跳转到文件列表页  doctype1微课堂：2文件；3通知
        vm.menuLink = function(path,type){
          if(type){
            $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida+'&dt='+type;
          }else{
            $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
          }
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
                  if(data.ida == 1){
                    vm.isDeptAdmin = true;
                    vm.orgOrPer = 'orgOrPer';
                  }else{
                    vm.isDeptAdmin = false;
                    vm.orgOrPer = 'orgNotExist';
                  }
                  // 河南律协添加上传视频
                  if(data.uri.indexOf('e24931') > -1){
                    vm.isHenanAdmin = true;
                  }
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



        vm.getArticleList = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsList.do',
                params: {
                    ntId:vm.ntid,
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {
                    
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.articleList = data.nl;
                  setTimeout(function(){
                    vm.initSortable();
                  }, 300);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        };

        vm.initSortable = function(){
            // $('#list_title').sortable('disable');
            $('.list_ul').sortable().bind('sortupdate', function() {
                vm.currentSortArray=[];
                $('.list_ul li').each(function(i){
                    // newArray.push($(this).val());
                    vm.currentSortArray.push({ni:parseInt($(this).attr('id')),sk:i});
                });
                console.log(vm.currentSortArray);
                vm.saveSortable();
            });
        }

        vm.saveSortable = function(){
          // var pl = vm.currentSortArray;
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/SortWXNewsList.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {nl:vm.currentSortArray}
            }).
            success(function(data, status, headers, config) {
                // console.log(data);
                if(data.c == 1000){
                  console.log('in order!');
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.getContentList = function(){
            if(!vm.sess) return;
            $http({
                method: 'GET',
                url: GlobalUrl+'/exp/QueryNewsTypes.do',
                params: {
                  session:vm.sess,
                  wf:1,
                  ida: vm.ida
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                    vm.contentList = data.ntl[1].td;
                    console.log(vm.contentList);
                  // vm.introduce = data.ntl[0].td;
                  // vm.title1 = data.ntl[0].tn;

                  // vm.content = data.ntl[1].td;
                  // vm.title2 = data.ntl[1].tn;

                  // vm.photos = data.ntl[2].td;
                  // vm.title3 = data.ntl[2].tn;
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        vm.deleteArticle = function(nid){
          if(confirm('确定要删除吗？')){
            $http({
                method: 'POST',
                url: GlobalUrl+'/exp/DeleteNews.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {
                    nId:nid
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.getArticleList();
                  $('input[type=checkbox]').prop('checked',false);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
          }
        }

        vm.updateArticle = function(nid){
          location.href = '#/add?session='+vm.sess+'&title='+Common.getUrlParam('title')+'&nid='+nid+'&ida='+vm.ida;
        }

        vm.publishArticle = function(nid){
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/UpdateNewsStatus.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
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
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        //全选按钮的点击与取消
        vm.selectAll = function(){
            var inputs = $('#all_check');
            var state = $('input[name=all_check]').prop('checked')  
            if(state){
                $('input[type=checkbox]').prop('checked',true)
            }else{
                $('input[type=checkbox]').prop('checked',false);
            }
        }


        //监听select下拉菜单选项发生改变时调起事件
        vm.change = function(contentId){
            console.log(contentId)
            var inputs = $('input[name="list_check"]');
            var contentId = contentId;
            var articleArray = [];
            // console.log(inputs);
            $.each(inputs,function(){   
                if($(this).is(":checked")){
                    articleArray.push($(this).attr("id"));
                }  
                return articleArray;
            })
            var data = {
                ntId:contentId,
                nidl:articleArray
            }
            console.log(data);
            console.log(articleArray);
            if(articleArray.length>0 && contentId){
               if(confirm('确定要进行移动吗？')){
                $http({
                    method: 'POST',
                    url: GlobalUrl+'/exp/ResetNewTypeOfNews.do',
                    params: {
                        session: vm.sess,
                        ida: vm.ida
                    },
                    headers : {'Content-Type':undefined},
                    data: data
                }).
                success(function(data, status, headers, config) {
                    console.log(data);
                    if(data.c == 1000){
                        vm.getArticleList();
                        vm.selectedState = true;
                        $('input[type=checkbox]').prop('checked',false);
                        // $("#list_moveTo select").children().eq(0).attr('selected',true);
                    }
                }).
                error(function(data, status, headers, config) {
                    // console.log(data);
                    alert('系统开了小差，请刷新页面');
                });
                } else{
                    vm.selectedState = true;
                }
            }
            
        }

        function init(){
          vm.title = decodeURI(Common.getUrlParam('title'));
          vm.ntid = Common.getUrlParam('ntId');
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.addArticle = vm.ntid!=0?true:false;
          vm.getArticleList();
          vm.getContentList();
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkUsrOrOrg();
        }

        init();
    };

    ListController.$inject = injectParams;

    app.register.controller('ListController', ListController);

});

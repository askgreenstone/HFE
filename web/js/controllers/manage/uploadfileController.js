'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var UploadfileController = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.transferurl = TransferUrl;
        vm.titleList;
        vm.newFileTitle = '';
        vm.newFileContent = '';

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess+'&ida='+vm.ida;
        };

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
        }

        vm.goBack = function(){
          $window.history.back();
        };




        // 切换个人与机构
        vm.switchPerOrg = function(num){
          console.log(num);
          if(num === 1){
            window.location.href = '#/card3?session='+vm.sess+'&ida=1';
          }else{
            window.location.href = '#/card3?session='+vm.sess+'&ida=0';
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


        // 查询文件分类

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
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }

        // 查询文件分类下具体文章
        vm.queryDeptDocs = function(typeId){
          $http({
            method: 'GET',
            url: GlobalUrl+'/exp/QueryDeptDocTypes.do',
            params: {
                session:vm.sess,
                tl: 2
            },
            data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                vm.artitleList = data.li;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }

        // 删除某篇文章
        vm.deleteArticle = function(typeId){
          var data = {
            dl: [
              {
                did: typeId
              }
            ]
          }
          var flag = window.confirm('确定要删除么？');
          if(flag){
            $http({
              method: 'POST',
              url: GlobalUrl+'/exp/DeleteDeptDocs.do',
              params: {
                  session:vm.sess
              },
              data: JSON.stringify(data)
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  // vm.artitleList = data.li;
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
          }
          
          
        }


        vm.gotoUpload = function(){
          var $choose_file = $('#newFileUpload'),
              URL = window.URL || window.webkitURL,
              blobURL;
          console.log(URL);
          if (URL) {
            $choose_file.change(function() {
              var files = this.files,
                  file;
              if (files && files.length) {
                  file = files[0];
                  // 支持mp3,mp4以及文件格式如下
                  console.log(file.name);
                  var ossname = file.name
                  if(ossname.indexOf('.doc')>-1||ossname.indexOf('.docx')>-1||ossname.indexOf('.xls')>-1||ossname.indexOf('.xlsx')>-1||ossname.indexOf('.ppt')>-1||ossname.indexOf('.pptx')>-1||ossname.indexOf('.pdf')>-1||ossname.indexOf('mp3')>-1||ossname.indexOf('mp4')>-1){
                    vm.uploadFile();
                  }else{
                    alert('暂不支持该类型文件！')
                  }
              }
            });
          } else {
              
          }
        }
        //上传文件获取oss文件名
        vm.uploadFile = function() {
            var f = document.getElementById('newFileUpload').files[0],
                r = new FileReader();
            if (!f){
              alert('请先选择文件！');
              return;
            } 
            Common.getLoading(true);
            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('fileToUpload', f);
                fd.append('filename', f.name);
                console.log(fd);
                $http.post(GlobalUrl + '/data/upload?session=' + vm.sess, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    console.log(data);
                    if(data.c == 1000){
                      vm.uploadFileName = data.on;
                    }
                    Common.getLoading(false);
                })
                .error(function() {
                    // console.log('error');
                    Common.getLoading(false); 
                    alert('系统开了小差，请刷新页面');
                });
            };
            r.readAsDataURL(f);
        }

        // 上传文件，标题，说明
        vm.setFileUpload = function(){
          if(!vm.newFileTitle){
            alert('请输入文件标题！');
            return;
          }else if(!vm.uploadFileName){
            alert('请传入文件');
            return;
          }else{
            $http({
              method: 'POST',
              url: GlobalUrl+'/exp/AddDeptDocs.do',
              params: {
                  session:vm.sess
              },
              data: JSON.stringify(data)
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  // vm.artitleList = data.li;
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
          }
        }


        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkUsrOrOrg();
          vm.queryDocType();
          vm.ftid = Common.getUrlParam('ftid');
          vm.ftnm = decodeURI(Common.getUrlParam('ftnm'));
          console.log(vm.ftnm);
          console.log(vm.ftid);
        }

        init();
    };

    UploadfileController.$inject = injectParams;

    app.register.controller('UploadfileController', UploadfileController);

});

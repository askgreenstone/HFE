'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var UploadvideoController = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.transferurl = TransferUrl;
        vm.typeId = '';
        vm.typeNm = '';
        vm.docType = 2;
        vm.isDeptAdmin = true;
        vm.isHenanAdmin = false;
        vm.docTypeName = '微课堂';
        vm.uploadVideo = false;
        var uploader = new VODUpload({
          // 文件上传失败
          'onUploadFailed': function (fileName, code, message) {
              console.log("onUploadFailed: " + fileName + code + "," + message);
              alert('文件上传失败，请重试!');
              return;
          },
          // 文件上传完成
          'onUploadSucceed': function (fileName) {
              console.log("onUploadSucceed: " + fileName);
              var uploadShortName = fileName.length>20?fileName.substring(0,20)+'...':fileName; 
              $('.uploadFileName').text(uploadShortName);
              $('.uploadFilePercent').hide();
              $('.uploadProgress').hide();
              vm.uploadSucced();
          },
          // 文件上传进度
          'onUploadProgress': function (fileName, totalSize, uploadedSize) {
              // console.log("file:" + fileName + ", " + totalSize, uploadedSize, "percent:", Math.ceil(uploadedSize * 100 / totalSize));
              var uploadShortName = fileName.length>20?fileName.substring(0,20)+'...':fileName;                 
              $('.uploadFileName').text(uploadShortName);
              $('.uploadFileBox').show();
              $('.uploadFilePercent').text(Math.ceil(uploadedSize * 100 / totalSize)+'%')
              $('.uploadProgress span').animate({width: Math.ceil(uploadedSize * 100 / totalSize)+'px'},100);
          },
          // token超时
          'onUploadTokenExpired': function (callback) {
              console.log("onUploadTokenExpired");
          }
        });


        vm.uploadSucced = function(){
          vm.docName = $('.uploadFileName').text();
          console.log(vm.uploadFileName);
        };

        // 文件上传到阿里云
        vm.uploadToAliyun = function(){
          var $choose_file = $('#step5_upload')[0].files;
          var str = window.location.href,
              web = '';
          if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
            web = 't-gstonevedio';
          }else{
            web = 'gstonevedio'
          }
          console.log($choose_file);
          var newDate = new Date().getTime();
          var fileName = '';
          console.log(newDate+'_'+vm.ownUri+$choose_file[0].name);
          vm.uploadFileName = newDate+'_'+vm.ownUri+'_'+'video.m3u8';
          fileName = newDate+'_'+vm.ownUri+'_'+'video.mp4'

          uploader.addFile(
            $choose_file[0],
            'http://oss-cn-beijing.aliyuncs.com',
            web,
            'wkt/'+fileName
          );
          uploader.startUpload();
        }



        vm.gotoLink = function(){
          location.href = '#/manage?session='+vm.sess+'&ida='+vm.ida;
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



        Date.prototype.Format = function(fmt){ //author: meizz   
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
          // console.log(now);
          if(!now)  return;
          var time1 = new Date(now).Format("yyyy-MM-dd hh:mm:ss");  
          return time1;      
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
                  if(data.ida == 1){
                    vm.isDeptAdmin = true;
                    vm.orgOrPer = 'orgOrPer';
                  }else{
                    vm.isDeptAdmin = false;
                    vm.orgOrPer = 'orgNotExist';
                  }
                  vm.ownUri = data.uri;
                  
                  // 河南律协添加上传视频
                  if(data.uri.indexOf('e24931') > -1){
                    vm.isHenanAdmin = true;
                    vm.GetLiveDetailNoList(data.uri)
                  }
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

        // 检测上传文件格式
        vm.getUploadFileType = function(){
          var $choose_file = $('#step5_upload'),
              URL = window.URL || window.webkitURL,
              blobURL;
          console.log(URL);
          if (URL) {
            $choose_file.change(function() {
              var files = this.files,
                  file;
              if (files && files.length) {
                  file = files[0];
                  // 支持.vob .ifo.(DVD格式).mpg .mpeg .dat .mp4 .3gp .mov .rm .ram .rmvb .wmv .asf.avi.asx文件格式
                  // 视频音频文件上传阿里云流媒体
                  console.log(file.name);
                  var ossname = file.name
                  if(ossname.indexOf('.vob')>-1||ossname.indexOf('.ifo')>-1||ossname.indexOf('.mpg')>-1||ossname.indexOf('.mpeg')>-1||ossname.indexOf('.dat')>-1||ossname.indexOf('.mp4')>-1||ossname.indexOf('.3gp')>-1||ossname.indexOf('.mov')>-1||ossname.indexOf('.rm')>-1||ossname.indexOf('.ram')>-1||ossname.indexOf('.rmvb')>-1||ossname.indexOf('.wmv')>-1||ossname.indexOf('.asf')>-1||ossname.indexOf('.avi')>-1||ossname.indexOf('.asx')>-1){
                    vm.getAliyunData();
                    vm.docType = 2;
                    $('.uploadTextBox').hide();
                  }else{
                    alert('暂不支持该类型文件！')
                  }
              }
            });
          } else {
              
          }
        }

        // 上传阿里云流媒体文件
        // 获取ID，secret，token，token过期时间
        vm.getAliyunData = function(){
          $http({
            method: 'GET',
            url: GlobalUrl+'/exp/GetAliVodToken.do',
            params: {
                session:vm.sess
             }
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                uploader.init(data.id,data.secret,data.token,data.tp);
                vm.uploadToAliyun();
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }


        // 上传文件，标题，说明
        vm.setFileUpload = function(){
            console.log(vm.uploadFileName);
            if (!vm.uploadFileName) {
              alert('请先上传视频文件！')
              return;
            }
            var data = {
              ldid: vm.ldid,
              va : vm.uploadFileName
            }
            $http({
              method: 'POST',
              url: GlobalUrl+'/exp/UpdateLiveDetailByVideo.do',
              params: {
                  session:vm.sess
              },
              data: JSON.stringify(data)
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  alert('上传视频成功！')
                  window.location.href = '#/videolist?session='+vm.sess+'&ida='+vm.ida;
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        


        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ldid = Common.getUrlParam('ldid');
          vm.ida = Common.getUrlParam('ida');
          vm.dt = Common.getUrlParam('dt');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          if(vm.dt == 1){
            vm.docTypeName = '微课堂';
            vm.uploadVideo = true;
          }else if(vm.dt == 2){
            vm.docTypeName = '文件';
            vm.uploadVideo = true;
          }else if(vm.dt == 3){
            vm.docTypeName = '通知';
            vm.uploadVideo = true;
          }else{
            vm.docTypeName = '上传视频'
          }
          vm.checkUsrOrOrg();
          
        }

        init();
    };

    UploadvideoController.$inject = injectParams;

    app.register.controller('UploadvideoController', UploadvideoController);

});

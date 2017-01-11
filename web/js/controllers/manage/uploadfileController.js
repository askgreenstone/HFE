'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var UploadfileController = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        vm.transferurl = TransferUrl;
        vm.newFileTitle = '';
        vm.newFileContent = '';
        vm.isServerData = false;//服务器端数据还是本地上传
        vm.uploadProgress = false;//开始上传出现进度条
        vm.isDeptAdmin = true;
        vm.docTypeName = '微课堂课程列表';
        var uploader = new VODUpload({
          // 文件上传失败
          'onUploadFailed': function (fileName, code, message) {
              console.log("onUploadFailed: " + fileName + code + "," + message);
              alert('文件上传失败，请重试!');
          },
          // 文件上传完成
          'onUploadSucceed': function (fileName) {
              console.log("onUploadSucceed: " + fileName);
              $('.uploadFileName').text(fileName);
              $('.uploadFilePercent').hide();
              $('.uploadProgress').hide();
              vm.uploadSucced();
          },
          // 文件上传进度
          'onUploadProgress': function (fileName, totalSize, uploadedSize) {
              // console.log("file:" + fileName + ", " + totalSize, uploadedSize, "percent:", Math.ceil(uploadedSize * 100 / totalSize));
              $('.uploadFileName').text(fileName);
              $('.uploadFileBox').show();
              $('.uploadFilePercent').text(Math.ceil(uploadedSize * 100 / totalSize)+'%')
              $('.uploadProgress span').animate({width: Math.ceil(uploadedSize * 100 / totalSize)+'px'},100);
          },
          // token超时
          'onUploadTokenExpired': function (callback) {
              console.log("onUploadTokenExpired");
          }
        });

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
          if(vm.docType == 2){
            vm.uploadFileName = newDate+'_'+vm.ownUri+'_'+'video.m3u8';
            fileName = newDate+'_'+vm.ownUri+'_'+'video.mp4'
          }else{
            vm.uploadFileName = newDate+'_'+vm.ownUri+'_'+'audio.m3u8';
            fileName = newDate+'_'+vm.ownUri+'_'+'audio.mp3'
          }

          uploader.addFile(
            $choose_file[0],
            'http://oss-cn-beijing.aliyuncs.com',
            web,
            'wkt/'+fileName
          );
          uploader.startUpload();
        }

        vm.uploadSucced = function(){
          vm.docName = $('.uploadFileName').text();
          console.log(vm.uploadFileName);
        };
        

        vm.gotoLink = function(){
          location.href = '#/manage?session'+vm.sess+'&ida='+vm.ida;
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
          // $window.history.back();
          $window.location.href = '#/filelist?session='+vm.sess+'&ida='+vm.ida+'&dt='+vm.dt;
        };

        vm.calLength = function(cur){
          if(cur){
            var count = cur.replace(/[\u4E00-\u9FA5]/g,'aa').length;
          }else{
            var count = 0;
          }
          return count;
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
                  if(data.ida == 1){
                    vm.isDeptAdmin = true;
                  }else{
                    vm.isDeptAdmin = false;
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


        // 查询分类下具体文件
        vm.queryDeptDocs = function(tid){
          $http({
            method: 'GET',
            url: GlobalUrl+'/exp/QueryDeptDocs.do',
            params: {
                session:vm.sess,
                ti: tid
            },
            data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                vm.artitleList = data.dl;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }



        // 查询分类标题及描述
        vm.queryDeptDocTypes = function(){
          $http({
            method: 'GET',
            url: GlobalUrl+'/exp/QueryDeptDocTypes.do',
            params: {
                session:vm.sess,
                dt: vm.dt
            },
            data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                for(var i=0;i<data.li.length;i++){
                  if(vm.tid == data.li[i].tid){
                    vm.newFileImg = data.li[i].p;
                    vm.newFileExpNm = data.li[i].s;
                    vm.newFileTitle = data.li[i].tn;
                    vm.newFileContent = data.li[i].dd;
                    vm.choosePic = data.li[i].p;
                    vm.fileImg = vm.transferurl + data.li[i].p;
                    vm.isServerData = true;
                  }
                }
                setTimeout(function() {
                  vm.initCropper();
                }, 300);
              }
              console.log(vm.transferurl+vm.newFileImg);
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }


        // 图片裁切
        vm.initCropper = function() {
          vm.hiddenInitImg = true;
            $('#themeCropper').cropper({
                aspectRatio: 1 / 1,
                preview: '#img_preview',
                viewMode:1,
                crop: function(e) {
                    // Output the result data for cropping image.
                    // console.log(e.x);
                    // console.log(e.y);
                    // console.log(e.width);
                    // console.log(e.height);
                    // console.log(e.rotate);
                    // console.log(e.scaleX);
                    // console.log(e.scaleY);
                    vm.imgx = Math.round(e.x);
                    vm.imgy = Math.round(e.y);
                    vm.imgh = Math.round(e.height);
                    vm.imgw = Math.round(e.width);
                },
                cropend:function(){
                  var cropDatas = $(this).cropper('getData');
                  console.log(cropDatas);
                  curw = Math.round(cropDatas.width);
                  curh = Math.round(cropDatas.height);
                  console.log('width,height:'+curw+curh);
                }
            });
            var $choose_file = $('#choose_file'),
                URL = window.URL || window.webkitURL,
                blobURL;
            if (URL) {
                $choose_file.change(function() {
                    var files = this.files,
                        file;

                    if (files && files.length) {
                        file = files[0];

                        if (/^image\/\w+$/.test(file.type)) {
                            blobURL = URL.createObjectURL(file);
                            $('#themeCropper').one('built.cropper', function() {
                                URL.revokeObjectURL(blobURL); // Revoke when load complete
                            }).cropper('reset').cropper('replace', blobURL);
                        } else {
                            alert('请选择图片文件！');
                        }
                    }
                });
            } else {
                
            }
        }

        vm.uploadImg = function() {
          console.log('w,h,x,y:'+vm.imgw,vm.imgh,vm.imgx,vm.imgy);
            var f = document.getElementById('choose_file').files[0],
                r = new FileReader();
            // console.log('f,r:'+f,r);
            // console.log(f);
            // return;
            if(!f){
              if(!vm.isServerData){
                alert('请先选择图片！');
                return;
              }
              else{
                vm.clipSourceImg(vm.choosePic);
                return;
              }
            }
            //gif图片不被裁切
            if(f.type.toString().toLowerCase().indexOf('gif')>-1){
              alert('暂不支持gif！');
              return;
            }
            Common.getLoading(true);
            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('fileToUpload', f);
                fd.append('filename', f.name);
                fd.append('w', vm.imgw);
                fd.append('h', vm.imgh);
                fd.append('x', vm.imgx);
                fd.append('y', vm.imgy);
                console.log(fd);
                $http.post(GlobalUrl + '/data/upload?session=' + vm.sess, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    Common.getLoading(false);
                    console.log(data);
                    vm.newFileImg = data.on;
                    vm.fileImg = vm.transferurl+data.on;
                    vm.isServerData = true;
                    alert('上传成功');
                    $('#themeCropper').cropper('destroy');
                    setTimeout(function() {
                      vm.initCropper();
                    }, 300);
                })
                .error(function() {
                    // console.log('error');
                    Common.getLoading(false);
                    alert('系统开了小差，请刷新页面');
                });
            };
            r.readAsDataURL(f);
        }


        //二次裁切素材
        vm.clipSourceImg = function(name){
          console.log('name:'+name);
          Common.getLoading(true);
          //1-背景图片;2-logo;3-headImg;4-自动回复图文消息横版图片;5-更新分享信息图片;6-只裁图不更新数据库
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/UpdateMicWebImgs.do',
                headers: {
                    'Content-Type': undefined
                },
                params: {
                    session:vm.sess
                },
                data: JSON.stringify({
                    in:name,
                    it:6,
                    w:vm.imgw,
                    h:vm.imgh,
                    x:vm.imgx,
                    y:vm.imgy,
                    ida: vm.ida
                })
            }).
            success(function(data, status, headers, config) {
                Common.getLoading(false);
                console.log(data);
                if(data.c == 1000){
                  console.log('clipSourceImg success');
                  vm.newFileImg = data.in;
                  vm.fileImg = vm.transferurl+data.in;
                  vm.choosePic = data.in;
                  alert('上传成功');
                  $('#themeCropper').cropper('destroy');
                  setTimeout(function() {
                    vm.initCropper();
                  }, 100);
                }
            }).
            error(function(data, status, headers, config) {
                Common.getLoading(false);
                console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }

        
        
        // 删除某个文件   
        vm.deleteArticle = function(typeId){
          console.log(typeId);
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
                  vm.queryDeptDocs(vm.tid);
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
          }
          
          
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
                  // 支持mp3,mp4以及文件格式如下
                  // 视频音频文件上传阿里云流媒体文档文件正常上传
                  // 1文档2视频3音频
                  console.log(file.name);
                  var ossname = file.name
                  if(ossname.indexOf('.doc')>-1||ossname.indexOf('.docx')>-1||ossname.indexOf('.xls')>-1||ossname.indexOf('.xlsx')>-1||ossname.indexOf('.ppt')>-1||ossname.indexOf('.pptx')>-1||ossname.indexOf('.pdf')>-1){
                    vm.getUploadFileNm();
                    vm.docType = 1;
                    $('.uploadTextBox').show();
                  }else if(ossname.indexOf('.mp3')>-1){
                    vm.getAliyunData();
                    vm.docType = 3;
                    $('.uploadTextBox').hide();
                  }else if(ossname.indexOf('.mp4')>-1){
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
        // 上传文件成功后调convert接口
        vm.gotoConvert = function(ossname) {
          console.log(ossname);
          var data = {
            'on' : ossname
          }
          $http({
              method: 'POST',
              url: GlobalUrl+'/data/Convert.do',
              params: {
                  session:vm.sess
              },
              data: JSON.stringify(data)
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  console.log('调取convert接口成功！')
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }



        //上传文件获取oss文件名
        vm.getUploadFileNm = function() {
            var f = document.getElementById('step5_upload').files[0],
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
                      vm.gotoConvert(data.on);
                      vm.docName = f.name;
                      vm.uploadFileName = data.on;
                      $('.uploadTextBox').text(f.name);
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
          console.log(vm.newFileTitle);
          console.log(vm.uploadFileName);
          if(!vm.isServerData){
            alert('请先上传课程图片！');
            return;
          }
          if(!vm.newFileExpNm){
            alert('请填写讲师姓名！');
            return;
          }else if(vm.calLength(vm.newFileExpNm)>18){
            alert('课程名称不能超过18个字符！');
            return;
          }

          if(!vm.newFileTitle){
            alert('请填写课程名称！');
            return;
          }else if(vm.calLength(vm.newFileTitle)>72){
            alert('课程名称不能超过72个字符！');
            return;
          }

          if(!vm.newFileContent){
            alert('请填写课程简介！');
            return;
          }else if(vm.calLength(vm.newFileContent)>512){
            alert('课程名称不能超过512个字符！');
            return;
          }

          if(vm.tid){
            var data = {
              li: [{
                tn: vm.newFileTitle,
                o: vm.order,
                dd: vm.newFileContent,
                p: vm.newFileImg,
                s: vm.newFileExpNm,
                tid: vm.tid
              }]
            }
            $http({
              method: 'POST',
              url: GlobalUrl+'/exp/ModifyDeptDocTypes.do',
              params: {
                  session:vm.sess
              },
              data: JSON.stringify(data)
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  if(vm.uploadFileName){
                    vm.addUploadFile(vm.tid);
                  }else{
                    window.location.href = '#/filelist?session='+vm.sess+'&ida='+vm.ida+'&dt='+vm.dt;
                  }
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
            
          }else{
            // 先创建二级分类，然后上传文件
            var data = {
              tn: vm.newFileTitle,
              o: vm.order,
              dd: vm.newFileContent,
              p: vm.newFileImg,
              s: vm.newFileExpNm,
              dt: vm.dt
            }
            $http({
              method: 'POST',
              url: GlobalUrl+'/exp/AddDeptDocTypes.do',
              params: {
                  session:vm.sess
              },
              data: JSON.stringify(data)
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  if(vm.uploadFileName){
                    vm.addUploadFile(data.tid);
                  }else{
                    alert('创建成功！')
                    window.location.href = '#/filelist?session='+vm.sess+'&ida='+vm.ida+'&dt='+vm.dt;
                  }
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
            
          }
        }



        // 上传文件方法
        vm.addUploadFile = function(tid){
          var data = {
            dn: vm.docName,
            odn: vm.uploadFileName,
            dt: vm.docType,
            dti: tid,
            o: vm.order
          }
          console.log(data);
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
                alert('上传成功！')
                window.location.href = '#/filelist?session='+vm.sess+'&ida='+vm.ida+'&dt='+vm.dt;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
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



        vm.getExpOwnuri = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/QueryMicroCard.do?session='+vm.sess
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                vm.ownUri = data.uri;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          }); 
        }



        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkUsrOrOrg();
          vm.tid = Common.getUrlParam('tid');
          vm.order = Common.getUrlParam('order');
          vm.dt = Common.getUrlParam('dt');
          vm.getExpOwnuri();
          if(vm.dt == 1){
            vm.docTypeName = '微课堂课程列表';
          }else if(vm.dt == 2){
            vm.docTypeName = '文件列表';
          }else{
            vm.docTypeName = '通知列表';
          }
          if(vm.tid){
            vm.queryDeptDocs(vm.tid);
            vm.queryDeptDocTypes();
          }else{
            vm.fileImg = 'image/placeholder.png';
            vm.isServerData = false;
            setTimeout(function() {
              vm.initCropper();
            }, 300);
          }
          
        }

        init();
    };

    UploadfileController.$inject = injectParams;

    app.register.controller('UploadfileController', UploadfileController);

});

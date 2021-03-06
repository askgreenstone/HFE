'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var WxController = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        var curw = 0;
        var curh = 0;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.transferUrl = TransferUrl;
        vm.globalUrl = GlobalUrl;
        vm.imgTextReply = '';
        vm.enable = '';
        vm.hiddenInitImg = false;//裁图初始化之后置为true
        vm.isServerData = false;//服务器端数据还是本地上传
        vm.imgUrl = '';
        vm.isImgUpload = false;// 初始化为false，上传图片后为true
        vm.authenState = 22;// 获取用户是否为认证状态  21为已认证 22未认证
        vm.ownUri = ''; //获取用户ownUri 
        vm.isDeptAdmin = true;
        vm.isHenanAdmin = false;

        //   跳转到文件列表页  doctype1微课堂：2文件；3通知
        vm.menuLink = function(path,type){
          if(type){
            $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida+'&dt='+type;
          }else{
            $window.location.href = '#/' + path + '?session='+vm.sess+'&ida='+vm.ida;
          }
        }


        vm.menuLinkReply = function(){
          console.log(vm.enable);
          $window.location.href = '#/reply2?session='+vm.sess+'&enable='+vm.enable+'&ida='+vm.ida;
        }


        // 切换个人与机构
        vm.switchPerOrg = function(num){
          console.log(num);
          if(num === 1){
            window.location.href = '#/wx?session='+vm.sess+'&ida=1';
          }else{
            window.location.href = '#/wx?session='+vm.sess+'&ida=0';
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

        vm.wxAuthor = function(){
          $http({
              method: 'get',
              url: GlobalUrl+'/exp/ThirdAuthRedirect.do',
              params: {
                  session:vm.sess,
                  ida: vm.ida
              },
              data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                // $window.location.href=data.url;
                $window.open(data.url,'_blank');
                // vm.authorFlag = false;
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }

        vm.getWxAuthorResult = function(){
          $http({
              method: 'get',
              url: GlobalUrl+'/exp/ThirdAuthInfoQuery.do',
              params: {
                  session:vm.sess,
                  ida: vm.ida
              },
              data: {},
              headers : {'Content-Type':undefined}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              console.log(vm.ownUri);
              // 授权状态  authStatus ：0 授权失败1 授权成功
              if(data.c == 1000){
                if(data.authStatus == 0){
                  vm.authorFlag = true;
                  vm.authState = '公众号授权';
                }else if(data.authStatus == 1){
                  vm.authorReault = data.nickName;
                  vm.authorFlag = false;
                  vm.authState = '公众号授权 > 欢迎图文设置';
                  vm.getImgTextReply();
                }
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }


        // 上传图片
        vm.uploadFile = function() {
          
          console.log('w,h,x,y:'+vm.imgw,vm.imgh,vm.imgx,vm.imgy);
            var f = document.getElementById('choose_file').files[0],
                r = new FileReader();
                console.log('f:'+f);
            // if (!f) return;
            if(!f){
              if(!vm.isServerData){
                alert('请先选择图片！');
                return;
              }else{
                vm.clipSourceImg(vm.picurl);
                return;
              }
            }
            //gif图片不被裁切
            if(f&&f.type.toString().toLowerCase().indexOf('gif')>-1){
              alert('暂不支持gif！');
              return;
            }
            Common.getLoading(true);
            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('ThirdUpload', f);
                fd.append('filename', f.name);
                fd.append('w', vm.imgw);
                fd.append('h', vm.imgh);
                fd.append('x', vm.imgx);
                fd.append('y', vm.imgy);
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo
                $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=4', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    Common.getLoading(false);
                    // alert('success');
                    console.log(data);
                    vm.picurl = data.on;
                    vm.isServerData = true;
                    vm.isImgUpload = true;
                    vm.imgUrl = vm.transferUrl+vm.picurl;
                    $('#themeCropper').cropper('destroy');
                    setTimeout(function() {
                      vm.initCropper();
                      alert('上传成功！')
                    }, 300);
                })
                .error(function() {
                    Common.getLoading(false);
                    // console.log('error');
                    alert('系统开了小差，请刷新页面');
                });
            };
            r.readAsDataURL(f);
        }

        //裁切素材
        vm.clipSourceImg = function(name){
          console.log('name:'+name);
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/UpdateMicWebImgs.do',
                params: {
                    session:vm.sess
                },
                data: {
                    in:name,
                    it:4,
                    w:vm.imgw,
                    h:vm.imgh,
                    x:vm.imgx,
                    y:vm.imgy
                }
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  Common.getLoading(false);
                  console.log('clipSourceImg success');
                  vm.isServerData = true;
                  vm.picurl = data.in;
                  vm.isImgUpload = true;
                  vm.imgUrl = vm.transferUrl+vm.picurl;
                  $('#themeCropper').cropper('destroy');
                  setTimeout(function() {
                    vm.initCropper();
                    alert('上传成功！');
                  }, 300);
                }
            }).
            error(function(data, status, headers, config) {
                
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        }


        // 获取用户设置被关注图文消息回复
        vm.getImgTextReply = function(){
          $http({
              method: 'get',
              url: GlobalUrl+'/exp/ThirdGetsubReplay.do',
              params: {
                  session:vm.sess,
                  ida: vm.ida
              },
              data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              console.log(vm.ownUri);
              var url = '';
              if(window.location.href.indexOf('localhost')>-1 || window.location.href.indexOf('t-dist')>-1){
                url = 'http://t-dist.green-stone.cn'
              }else{
                url = 'http://dist.green-stone.cn'
              }
              console.log(url);
              if(data.c == 1000){
                  vm.title = data.title;
                  vm.desc = data.desc;
                  vm.picurl = data.picurl?data.picurl:'image/placeholder.png';
                  vm.url =url + '/usr/ThirdHomePage.do?ownUri=' + vm.ownUri;
                  vm.isServerData = true;
                  vm.imgUrl = data.picurl?(vm.transferUrl+data.picurl):'image/placeholder.png';
                  //延迟初始化裁图插件
                  setTimeout(function() {
                    vm.initCropper();
                    vm.isImgUpload = true;
                  }, 300);
                }
                console.log(vm.picurl);
                console.log(vm.imgUrl);
                console.log(vm.url);
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });
        }


        vm.initCropper = function() {
          vm.hiddenInitImg = true;
            $('#themeCropper').cropper({
                aspectRatio: 9 / 5,
                preview: '#img_preview',
                viewMode:1,
                crop: function(e) {
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
        // 点击判断用户启用/关闭被关注图文消息回复
        // vm.changeImgTextReply = function(){
        //   console.log(vm.imgTextReply);
        //   if(vm.imgTextFlag){
        //     vm.enable = 1;
        //     vm.imgTextFlag = false;
        //     vm.imgTextReply = '关闭欢迎图文';
        //   }else{
        //     vm.enable = 0;
        //     vm.imgTextFlag = true;
        //     vm.imgTextReply = '开启欢迎图文';
        //   }

        //   // 设置启用/关闭状态
        //   $http({
        //       method: 'post',
        //       url: GlobalUrl+'/exp/ThirdSetSubReplay.do',
        //       params: {
        //           session:vm.sess
        //       },
        //       data: {
        //         enable:vm.enable
        //       }
        //   }).
        //   success(function(data, status, headers, config) {
        //       console.log(data);
        //   }).
        //   error(function(data, status, headers, config) {
        //       // console.log(data);
        //       alert('系统开了小差，请刷新页面');
        //   });
        // }



        // 获取用户ownUri
        vm.getOwnUri = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/CreateMicWebQrCode.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.ownUri = data.ownUri;
                  vm.getWxAuthorResult();
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('系统开了小差，请刷新页面');
            });
        };



        // 验证各项数据格式、字数是否合格
        vm.validateInput = function(){
            if(!vm.title){
              alert('标题不能为空！');
              return false;
            }else if(vm.title.length>60){
              alert('标题不能超过60个字符！');
              return false;
            }

            if(!vm.desc){
              alert('摘要不能为空！');
              return false;
            }else if(vm.desc.length>120){
              alert('摘要不能超过120个字符！');
              return false;
            }

            if(!vm.isImgUpload){
              alert('请先上传图片！')
            }else{
              return true;
            }

        }


        // 设置图文消息自动回复
        vm.setImgTextReply = function(){
          var data = {};
          if(!vm.validateInput()) return;
          console.log(vm.authenState);
          data = {
            msgType:vm.authenState,
            title:vm.title,
            desc: vm.desc,
            picUrl:vm.transferUrl+vm.picurl,
            url: vm.url,
            enable: 1
          }
          console.log(data);
          $http({
              method: 'post',
              url: GlobalUrl+'/exp/ThirdSetSubReplay.do',
              params:{
                session:vm.sess,
                ida: vm.ida
              },
              data: data,
              headers : {'Content-Type':undefined}
          }).
          success(function(data) {
            console.log(data);
            if(data.c == 1000){
              alert('保存成功');
              // vm.menuLink('wx');
            }
          }).
          error(function(){
            alert('系统开了小差，请刷新页面');
          })
          // 继续
        }


        // 获取公众号认证状态
        vm.getAuthenState = function(){
          $http({
              method: 'post',
              url: GlobalUrl+'/exp/ExpertInfo.do',
              params:{
                session:vm.sess,
                ida: vm.ida
              },
              data: {}
          }).
          success(function(data) {
            console.log(data);
            if(data.c == 1000){
              if(data.sts == 2){
                vm.authenState = 21;
              }else{
                vm.authenState = 22;
              }
            }
          }).
          error(function(){
            alert('系统开了小差，请刷新页面');
          })
        }

        vm.checkAuthorParam = function(){
          vm.wxUrlFlag = Common.getUrlParam('authSucc');
          if(vm.wxUrlFlag&&vm.wxUrlFlag == 1){
            vm.authorFlag = false;
            vm.authState = '公众号授权 > 欢迎图文设置';
          }else if(vm.wxUrlFlag&&vm.wxUrlFlag == 0){
            vm.authorFlag = true;
            vm.authState = '公众号授权';
          }else{
            vm.authorFlag = true;
            vm.authState = '公众号授权';
            return;
          }
        }
        

        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.getAuthenState();
          vm.getOwnUri();
          vm.checkAuthorParam();
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkUsrOrOrg();

        }

        init();

    };

    WxController.$inject = injectParams;

    app.register.controller('WxController', WxController);

});

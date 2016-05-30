'use strict';

define(['App'], function(app) {

    var injectParams = ['$location', '$window', '$http','GlobalUrl','TransferUrl','Common'];
    var Reply2Controller = function($location, $window, $http,GlobalUrl,TransferUrl,Common) {

        var vm = this;
        var curw = 0;
        var curh = 0;
        vm.str = 'manage!!!';
        vm.sess = '';
        vm.enable = '';// 状态值开启关闭自动回复 0 不启用  1启用
        vm.transferUrl = TransferUrl;
        vm.hiddenInitImg = false;//裁图初始化之后置为true
        vm.imgTextFlag = true;  //图文消息为true，纯文字false
        vm.isServerData = false;//服务器端数据还是本地上传
        vm.imgUrl = '';
        vm.isImgUpload = false;// 初始化为false，上传图片后为true
        vm.authenState = 22;// 获取用户是否为认证状态  21为已认证 22未认证
        vm.ownUri = ''; //获取用户ownUri 

        vm.menuLink = function(path){
          $window.location.href = '#/' + path + '?session='+vm.sess;
        }
        // 切换显示图文或纯文字
        vm.changeImgTextFlag = function(text){
          if(text == 'img'){
            vm.imgTextFlag = true;
            //延迟初始化裁图插件
            setTimeout(function() {
              vm.initCropper();
            }, 300);
          }else{
            vm.imgTextFlag = false;
          }
        }
        // 图片裁切
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
                    }, 300);
                })
                .error(function() {
                    Common.getLoading(false);
                    // console.log('error');
                    alert('网络连接错误或服务器异常！');
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
                    console.log('对不对');
                  }, 300);
                }
            }).
            error(function(data, status, headers, config) {
                
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        }

        // 获取用户设置被关注图文消息回复
        vm.getImgTextReply = function(){
          $http({
              method: 'get',
              url: GlobalUrl+'/exp/ThirdGetsubReplay.do',
              params: {
                  session:vm.sess
              },
              data: {}
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              if(data.c == 1000){
                if(data.msgCont){
                  vm.imgTextFlag = false;
                  vm.msgCont = data.msgCont;
                  vm.isServerData = false;
                  vm.imgUrl = 'image/placeholder.png';
                  vm.url = data.url?data.url:'http://dist.green-stone.cn/usr/ThirdHomePage.do?ownUri='+vm.ownUri;
                }else{
                  vm.imgTextFlag = true;
                  vm.title = data.title;
                  vm.desc = data.desc;
                  vm.picurl = data.picurl?data.picurl:'image/placeholder.png';
                  vm.url = data.url?data.url:'http://dist.green-stone.cn/usr/ThirdHomePage.do?ownUri='+vm.ownUri;
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
                console.log(vm.imgTextFlag);
                
              }
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('网络连接错误或服务器异常！');
          });
        }


        // 获取用户ownUri
        vm.getOwnUri = function(){
          $http({
                method: 'GET',
                url: GlobalUrl+'/exp/CreateMicWebQrCode.do',
                params: {
                    session:vm.sess
                },
                data: {}
            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if(data.c == 1000){
                  vm.ownUri = data.ownUri;
                  vm.getImgTextReply();
                }
            }).
            error(function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            });
        };


        // 验证各项数据格式、字数是否合格
        vm.validateInput = function(){
          // console.log(vm.imgTextFlag);
          if(vm.imgTextFlag){
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

            if(!vm.url){
              alert('链接不能为空！');
              return false;
            }

            if(!vm.isImgUpload){
              alert('请先上传图片！')
            }else{
              return true;
            }

          }else{

            if(!vm.msgCont){
              alert('内容不能为空！');
              return false;
            }else if(vm.msgCont.length>600){
              alert('内容不能超过600个字符！');
              return false;
            }else{
              return true;
            }
          }

        }


        // 设置图文消息自动回复
        vm.setImgTextReply = function(){
          var data = {};
          if(!vm.validateInput()) return;
          console.log(vm.imgTextFlag);
          console.log(vm.enable);
          console.log(vm.authenState);
          if(vm.imgTextFlag){
            data = {
              msgType:vm.authenState,
              title:vm.title,
              desc: vm.desc,
              picUrl:vm.transferUrl+vm.picurl,
              url: vm.url,
              enable: vm.enable
            }
          }else{
            data={
              msgType:0,
              msgCont:vm.msgCont,
              enable: vm.enable
            }
          }
          console.log(data);
          $http({
              method: 'post',
              url: GlobalUrl+'/exp/ThirdSetSubReplay.do',
              params:{session:vm.sess},
              data: data,
              headers : {'Content-Type':undefined}
          }).
          success(function(data) {
            console.log(data);
            if(data.c == 1000){
              alert('保存成功');
              vm.menuLink('wx');
            }
          }).
          error(function(){
            alert('网络连接错误或服务器异常！');
          })
          // 设置图文消息自动回复接口：ThirdSetSubReplay，判断imgTextFlag的状态来决定参数
          // 继续
        }

        // 获取公众号认证状态
        vm.getAuthenState = function(){
          $http({
              method: 'post',
              url: GlobalUrl+'/exp/ExpertInfo.do',
              params:{session:vm.sess},
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
            alert('网络连接错误或服务器异常！');
          })
        }
        
        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.enable = Common.getUrlParam('enable');
          vm.getOwnUri();
          // vm.getImgTextReply();
          vm.getAuthenState();
        }

        init();
    };

    Reply2Controller.$inject = injectParams;

    app.register.controller('Reply2Controller', Reply2Controller);

});

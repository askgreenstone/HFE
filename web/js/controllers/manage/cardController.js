'use strict';

define(['App'], function(app) {

    var injectParams = ['$location','$http','$window','GlobalUrl','TransferUrl','Common'];
    var CardController = function($location,$http,$window,GlobalUrl,TransferUrl,Common) {
        var vm = this;
        var curw = 0;
        var curh = 0;
        vm.userBg = '';
        vm.transferUrl = TransferUrl;
        vm.isServerData = false;//服务器端数据还是本地上传
        vm.hiddenInitImg = false;//裁图初始化之后置为true
        vm.preview = '';
        vm.qrIndex = '';
        // vm.isHeadUpload = false;
        // vm.isQrcodeUpload = false;
        vm.head = '';
        vm.qrIndex = '';
        vm.user = {
          HeadImg: '',
          NAME: '',
          Depart: '',
          Rank: '',
          QRCodeImg: '',
          Mobile: '',
          Email: '',
          TelNo: '',
          WebSite: '',
          Region: '',
          Address: '',
          Address_srh: '',
          Abstract: '',
          Introduction: ''
        };
        vm.CardID = '';
        vm.tempImageUrl = '';
        vm.tempImageQr = '';
        vm.state = 'undo';
        vm.isDeptAdmin = true;

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
          $window.history.back();
        };


        vm.calLength = function(cur){
          if(cur){
            var count = cur.replace(/[\u4E00-\u9FA5]/g,'aa').length;
          }else{
            var count = 0;
          }
          return count;
        }

        // 查询该session是个人还是机构，不需要ida参数
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


        // 获取微名片编辑状态：
        // 0  完全没有编辑过微名片
        // 1  已经编辑过微名片
        // 2  未编辑，但已经生成微名片数据（上传过头像）
        vm.checkCardState = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/GetMicroCardEditStatus.do?session='+vm.sess+'&ida='+vm.ida
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              // 微名片编辑状态：
              // 0  完全没有编辑过微名片
              // 1  已经编辑过微名片
              // 2  未编辑，但已经生成微名片数据（上传过头像）
              if(data.s == 0){
                vm.state = 'undo';
              }else{
                vm.state = 'do';  
              }
              vm.getCardInfo();
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });  
        }


        // 获取首页二维码，链接
        vm.getIndexQrcode = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/CreateMicWebQrCode.do?session='+vm.sess+'&ida='+vm.ida
          }).
          success(function(data, status, headers, config) {
              console.log(data);
              vm.qrIndex = data.qrn?data.qrn:'onlinelaw20160314185742.jpg';
              vm.checkCardState();
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          });  
        }

        //从后台拿数据，拿到的话就回显，没有数据设置默认数据
        // 判断依据：姓名项为必填，判断有无姓名
        vm.getCardInfo = function(){
          $http({
              method: 'GET',
              url: GlobalUrl+'/exp/QueryMicroCard.do?session='+vm.sess+'&ida='+vm.ida
            }).
            success(function(data, status, headers, config) {
              console.log(data);
              vm.CardID = data.cId;
              if(data.nm){
                vm.user = {
                    HeadImg: data.hI,
                    NAME: data.nm,
                    Depart: data.dp,
                    Rank: data.rk,
                    QRCodeImg: data.QR,
                    Mobile: data.Mob,
                    Email: data.eml,
                    TelNo: data.tel,
                    WebSite: data.web,
                    Address: data.adr,
                    Region: data.rg,
                    Address_srh: data.adr,
                    Abstract: data.abs,
                    Introduction: data.itd
                  }
              }else{
                vm.user = {
                    HeadImg: data.hI,
                    NAME: '',
                    Depart: '您的单位名称',
                    Rank: '律师',
                    QRCodeImg: vm.qrIndex?vm.qrIndex:'onlinelaw20160314185742.jpg',
                    Mobile: '86-10-12345678',
                    Email: 'sample@email.com',
                    TelNo: '86-10-12345678',
                    WebSite: 'www.askgreenstone.com',
                    Address: '北京市朝阳区世贸中心',
                    Region: '北京',
                    Address_srh: '北京市朝阳区世贸中心',
                    Abstract: '律师执业多年以来，长期担任企业法律常年法律顾问，服务客户包含XX等五百强企业。',
                    Introduction: '投融资及资本市场、公司法、知识产权'
                  }
              }
              vm.choosePic = data.hI;
              vm.isServerData = true;
              vm.head = vm.transferUrl+vm.user.HeadImg;
              console.log(vm.head);
              // vm.isHeadUpload = true;
              // vm.isQrcodeUpload = true;
              setTimeout(function() {
                vm.initCropper();
              }, 300);
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

        vm.uploadFile = function() {
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
                alert('上传成功');
                vm.state = 'do';
                $('#themeCropper').cropper('destroy');
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
                fd.append('ThirdUpload', f);
                fd.append('filename', f.name);
                fd.append('w', vm.imgw);
                fd.append('h', vm.imgh);
                fd.append('x', vm.imgx);
                fd.append('y', vm.imgy);
                console.log(fd);
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo
                $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=2', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    Common.getLoading(false);
                    console.log(data);
                    vm.user.HeadImg = data.on;
                    vm.head = vm.transferUrl+vm.user.HeadImg;
                    console.log(vm.head);
                    // vm.isHeadUpload = true;
                    vm.state = 'do';
                    alert('上传成功');
                    console.log(vm.CardID);
                    // document.getElementById("choose_file").innerHTML='<input type="file" id="choose_file" ng-model="vm.fileName"/>';   
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


        vm.gotoUpload = function(){
            var $choose_file = $('#step5_upload'),
                URL = window.URL || window.webkitURL,
                blobURL;
            if (URL) {
                $choose_file.change(function() {
                    var files = this.files,
                        file;

                    if (files && files.length) {
                        file = files[0];

                        if (/^image\/\w+$/.test(file.type)) {
                            console.log(file);
                            vm.uploadQrcode();
                            // vm.getLocationUrl();
                            // $('#userLogo').attr('src',file);
                        } else {
                            alert('请选择图片文件！');
                        }
                    }
                });
            } else {
                
            }
        }
        //二维码（不需裁切处理）
        vm.uploadQrcode = function() {
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
                fd.append('ThirdUpload', f);
                fd.append('filename', f.name);
                console.log(fd);
                // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6 微信分享图标
                $http.post(GlobalUrl + '/exp/ThirdUpload.do?session=' + vm.sess + '&type=1', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    console.log(data);
                    vm.user.QRCodeImg = data.on;
                    // vm.isQrcodeUpload = true;
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
        //裁切素材
        vm.clipSourceImg = function(name){
          console.log('name:'+name);
          Common.getLoading(true);
          $http({
                method: 'POST',
                url: GlobalUrl+'/exp/UpdateMicWebImgs.do',
                params: {
                    session:vm.sess,
                    ida: vm.ida
                },
                data: {
                    in:name,
                    it:3,
                    w:vm.imgw,
                    h:vm.imgh,
                    x:vm.imgx,
                    y:vm.imgy
                }
            }).
            success(function(data, status, headers, config) {
                Common.getLoading(false);
                console.log(data);
                if(data.c == 1000){
                  console.log('clipSourceImg success');
                  vm.user.HeadImg = data.in;
                  vm.head = vm.transferUrl+vm.user.HeadImg;
                  vm.choosePic = data.in;
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


        vm.setEcardInfo = function(){
          console.log(vm.state);
          console.log(vm.CardID);
          var data = [];
          // if(vm.user.QRCodeImg == 'onlinelaw20160314185742'){
          //   vm.user.QRCodeImg = ''
          // }
          for (var k in vm.user){
            data.push({"cn":k,"cv":vm.user[k]})
          };
          console.log(data);
          if(vm.state == "do"){
            var fd = {
              "tn": "jlt_expmicrocard",
              "cols": data,
              "cds":[{
                "cn": "CardID",
                "cv": vm.CardID
              }]
            };
            console.log(fd);
            $http({
                method: 'POST',
                url: GlobalUrl+'/exp/DataUpdate.do?session='+vm.sess+'&ida='+vm.ida,
                params: {
                },
                data: fd
              }).
              success(function(data, status, headers, config) {
                  console.log(data);
                  if(data.c == 1000){
                     $window.location.href = '#/card3?session='+vm.sess+'&ida='+vm.ida;
                  }
              }).
              error(function(data, status, headers, config) {
                  // console.log(data);
                  alert('系统开了小差，请刷新页面');
              });
          }else{
            var fd = {
              "tn": "jlt_expmicrocard",
              "cols": data
            };
            console.log(fd);
            $http({
                method: 'POST',
                url: GlobalUrl+'/exp/DataInsert.do?session='+vm.sess+'&ida='+vm.ida,
                params: {
                },
                data: fd
              }).
              success(function(data, status, headers, config) {
                  console.log(data);
                  if(data.c == 1000){
                     $window.location.href = '#/card3?session='+vm.sess+'&ida='+vm.ida;
                  }else if(data.c == 1037){
                    console.log("该用户微名片信息已存在，走update接口")
                  }
              }).
              error(function(data, status, headers, config) {
                  // console.log(data);
                  alert('系统开了小差，请刷新页面');
              });
          }
        }


        vm.setBasicInfo = function(){
          $http({
              method: 'GET',
              async:false,
              url: GlobalUrl+'/exp/QueryMicroCard.do?session='+vm.sess+'&ida='+vm.ida
          }).
          success(function(data, status, headers, config) {
            console.log(data);
            vm.CardID = data.cId; 
             // alert(vm.CardID);
          }).
          error(function(data, status, headers, config) {
              // console.log(data);
              alert('系统开了小差，请刷新页面');
          }); 
          console.log(vm.state);
          console.log(vm.CardID);
          vm.user.Address_srh = vm.user.Address;
          // if(!vm.isHeadUpload){
          //   alert("请上传头像！");
          //   return false;
          // }

          // if(!vm.isQrcodeUpload){
          //   alert("请上传二维码！");
          //   return false;
          // }

          if(!vm.user.NAME){
            alert("请填写您的姓名！");
            return false;
          }else if(vm.user.NAME && vm.calLength(vm.user.NAME)>18){
            alert("姓名长度不能超过十八位字符！"); 
            return false;
          }

          if(vm.user.Depart && vm.calLength(vm.user.Depart)>26){
            alert("律所长度不能超过二十六位字符！"); 
            return false;
          }

          if(vm.user.Rank && vm.calLength(vm.user.Rank)>24){
            alert("职务长度不能超过四十八位字符！"); 
            return false;
          }

          if(vm.user.Address && vm.calLength(vm.user.Address)>120){
            alert("地址长度不能超过一百二十位字符！"); 
            return false;
          }
          setTimeout(vm.setEcardInfo,300);
        }
       
        function init(){
          vm.sess = Common.getUrlParam('session');
          vm.ida = Common.getUrlParam('ida');
          vm.getIndexQrcode();
          vm.contentList = [{tn:'个人工作室',ida:0},{tn:'机构工作室',ida:1}];
          vm.abc = vm.ida == 0?vm.contentList[0]:vm.contentList[1];
          vm.checkUsrOrOrg();
        }
        init();
    };

    CardController.$inject = injectParams;

    app.register.controller('CardController', CardController);

});




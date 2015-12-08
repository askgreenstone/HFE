'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location', '$http', '$window', 'GlobalUrl'];
    var PreviewController = function($location, $http, $window, GlobalUrl) {

        var vm = this;
        vm.title = '标题';
        vm.updateFlag = 'false';
        vm.fileName = '';
        vm.fileUrl = 'http://t-transfer.green-stone.cn/A4466A00305BF5FC7B3FC99B82C77F99_W292_H220_S13.jpg';

        vm.getUrlParam = function(p) {
            var url = location.href;
            var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
            var paraObj = {};
            for (var i = 0, j = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
            }
            var returnValue = paraObj[p.toLowerCase()];
            if (typeof(returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
        };

        vm.gotoLink = function(path, title) {
            location.href = '#/' + path + '?title=' + encodeURI(title);
        };

        vm.goBack = function() {
            $window.history.back();
        };

        // 图片上传
        vm.uploadFile = function() {
          console.log('w,h,x,y:'+vm.imgw,vm.imgh,vm.imgx,vm.imgy);
            var f = document.getElementById('choose_file').files[0],
                r = new FileReader();
            if (!f) return;
            r.onloadend = function(e) {
                var data = e.target.result;
                var fd = new FormData();
                fd.append('WXPhotoToUpload', f);
                fd.append('filename', f.name);
                fd.append('w', vm.imgw);
                fd.append('h', vm.imgh);
                fd.append('x', vm.imgx);
                fd.append('y', vm.imgy);
                $http.post(GlobalUrl + '/exp/SaveWXPhoto.do?session=' + vm.sess + '&ntId=' + vm.ntid, fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .success(function(data) {
                        console.log(data);
                        $window.history.back();
                    })
                    .error(function() {
                        console.log('error');
                    });
            };
            r.readAsDataURL(f);
        }

        // 图片裁切
        vm.initCropper = function() {
            $('#imageCropper').cropper({
                // aspectRatio: 1 / 1,
                preview: '#img_preview',
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
                            $('#imageCropper').one('built.cropper', function() {
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

        function init() {
            vm.sess = vm.getUrlParam('session');
            vm.ntid = vm.getUrlParam('ntId');
            vm.initCropper();
        }

        init();
    };

    PreviewController.$inject = injectParams;

    app.register.controller('PreviewController', PreviewController);

});

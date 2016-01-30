// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

jQuery(function($) {
var imgx, imgy, imgh, imgw;
var sess = Common.getUrlParam('session');
var ratio = Common.getUrlParam('ratio');
var api = new Api();

function initCropper() {
  if (!ratio) return;
  $('#themeCropper').cropper({
      aspectRatio: ratio[0] / ratio[1],
      viewMode: 1,
      crop: function(e) {
          imgx = Math.round(e.x);
          imgy = Math.round(e.y);
          imgh = Math.round(e.height);
          imgw = Math.round(e.width);
      }
  })

  var $choose_file = $('#themebg_choose'),
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
  }
}

function getUserBg() {
  $.ajax({
      type: 'POST',
      url: Common.globalDistUrl() + 'exp/GetMicWebImgs.do?session=' + sess,
      success: function(data) {
          console.log(data);
          if (data.bi) {
              $('#themeCropper').attr('src', Common.globalTransferUrl() + data.bi);
          } else {
              $('#themeCropper').attr('src', Common.globalTransferUrl() + '../image/themes/1.png');
          }
          //延迟初始化裁图插件
          setTimeout(function() {
              initCropper();
          }, 300);
      },
      error: function(error) {
          alert('网络连接错误或服务器异常！');
      }
  })
}

$('#themebg_next').click(function() {
      var file = document.getElementById('themebg_choose').files[0],
          reader = new FileReader();
      reader.addEventListener('load', function() {
              var fd = new FormData();
              fd.append('ThirdUpload', file);
              fd.append('filename', file.name);
              fd.append('w', imgw);
              fd.append('h', imgh);
              fd.append('x', imgx);
              fd.append('y', imgy);
              console.log(fd);
              // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo
              $.ajax({
                  type: 'POST',
                  url: Common.globalDistUrl() + 'exp/ThirdUpload.do?session=' + sess+'&type=3',
                  data: fd,
                  processData: false,
									contentType: false,
                  success: function(data) {
                      console.log(data);
                      window.location.href = 'card.html?session='+sess;
                  },
                  error: function(error) {
                      alert('网络连接错误或服务器异常！');
                  }
              })
          })
          if (file) {
              reader.readAsDataURL(file);
          }
      });

  //初始化所有
  function initAll() {
      getUserBg();
  }

  initAll();

});

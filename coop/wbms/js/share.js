var session = Common.getUrlParam('session'),
    shareId = '',
    tempData = '',
    shareImg = '';
console.log(session);




jQuery(function($) {
    

    //验证文本框、文本域
    function validateInput() {
        if (!$("#title").val()) {
            alert('分享标题不能为空！');
            return false;
        } else if ($("#title").val().length > 15) {
            alert('分享标题不能超过15个字！');
            return false;
        }


        if (!$("#desc").val()) {
            alert('分享摘要不能为空！');
            return false;
        } else if ($("#desc").val().length > 40) {
            alert('分享摘要不能超过40个字！');
            return false;
        }
        console.log(shareImg);
        if (!shareImg) {
            alert('分享图标不能为空！');
            return false;
        } else {
            return true;
        }
    }

    //jartto:preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#share_preview').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $('#icon').change(function() {
        readURL(this);
        uploadShareImg();
    });
    //jartto:upload
    function uploadShareImg() {
        var file = document.getElementById('share_file').files[0],
            reader = new FileReader();
        reader.addEventListener('load', function() {
            var fd = new FormData();
            fd.append('ThirdUpload', file);
            fd.append('filename', file.name);
            Common.getLoading(true);
            // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6分享
            $.ajax({
                type: 'POST',
                url: Common.globalDistUrl() + 'exp/ThirdUpload.do?session=' + session + '&type=6',
                data: fd,
                processData: false,
                contentType: false,
                success: function(data) {
                    console.log(data); 
                    shareImg = data.on;
                    Common.getLoading(false);
                },
                error: function(error) {
                    Common.getLoading(false);
                    alert('网络连接错误或服务器异常！');
                }
            })
        })
        if (file) {
          reader.readAsDataURL(file);}
        // }else{
        // 	alert('请上传分享图标');
        // }
    }


    function readURL(input,preview) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            console.log(e);
              $('#'+preview).attr('src', e.target.result);
          }
          reader.readAsDataURL(input.files[0]);
      }
    }


    $('#share_file').change(function(){
        $('#share_box').hide();
        readURL(this,'share_preview');
        $('#share_preview').show();
        uploadShareImg();
    });


    //分享首页st：1，微名片st：2
    var setWxShare = function(src) {
        if(!validateInput()) return;
        console.log(src);
        if (shareId) { //更新
            tempData = {
                si: shareId,
                st: 1,
                sti: $("#title").val(),
                sd: $("#desc").val(),
                spu:src
            }
        } else { //插入
            tempData = {
                st: 1,
                sti: $("#title").val(),
                sd: $("#desc").val(),
                spu:src
            }
        }
        console.log(tempData);
        Common.getLoading(true);
        $.ajax({
            type: 'POST',
            url: Common.globalDistUrl() + 'exp/ThirdSetShareInfo.do?session=' + session,
            data: JSON.stringify(tempData),
            dataType:'json',
            contentType:'application/json',
            success: function(data) {
                console.log(data);
                if (data.c == 1000) {
                   Common.getLoading();
                   getIndexUrl();
                }
            },
            error: function() {
                Common.getLoading();
                alert('网络连接错误或服务器异常！');
            }
        })

    }


    // 获取首页二维码，链接
    function getIndexUrl(){
      $.ajax({
        method: 'GET',
        url: Common.globalDistUrl()+'exp/CreateMicWebQrCode.do?session='+session,
        data: {},
        success: function(data) {
                  console.log(data);
                  if(data.c == 1000){
                    window.location.href = Common.globalDistUrl()+'mobile/#/'+data.theme+'?ownUri='+data.ownUri+'&sess='+session+'&origin=wbms';
                  }
                },
        error: function(data, status, headers, config) {
                // console.log(data);
                alert('网络连接错误或服务器异常！');
            }
      })
    };
    $('#set_share').click(function(){
      console.log(shareImg);
      setWxShare(shareImg);
    })

    //初始化数据
    function initAll(){
        $.ajax({
            type: 'get',
            url: Common.globalDistUrl() + 'exp/GetMicWebShareInfo.do',
            data: {
                session: session,
                st: 1
            },
            success: function(data) {
                console.log(data);
                if (data.c == 1000) {
                    $('#share_box').hide();
                    $('#share_preview').show();
                    if (data.sil.length > 0) {
                        $("#title").val(data.sil[0].sti);
                        $("#desc").val(data.sil[0].sd);
                        $("#share_preview").attr('src',Common.globalTransferUrl() + data.sil[0].spu);
                        shareId = data.sil[0].si;
                        shareImg = data.sil[0].spu;
                    }else {
                        $("#title").val('我的微网站');
                        $("#desc").val('我正在绿石使用微网站，欢迎访问我的微网站！');
                        $("#share_preview").attr('src',Common.globalTransferUrl() + 'greenStoneicon300.jpg');
                        shareImg = 'greenStoneicon300.jpg';
                    }
                } 
            },
            error: function() {
                alert('网络连接错误或服务器异常！');
            }
        })
    }
    initAll();
})
var session = Common.getUrlParam('session'),
    globalUrl = Common.globalDistUrl(),
    shareId = '',
    tempData = '';
console.log(session);
console.log(globalUrl);


//globalUrl  待处理
//头像二维码 待处理

//页面加载通过session判断是否编辑过
window.onload = function() {
    $.ajax({
        type: 'get',
        url: 'http://t-dist.green-stone.cn/' + 'exp/GetMicWebShareInfo.do',
        data: {
            session: session,
            st: 2
        },
        success: function(data) {
            console.log(data);
            if (data.c == 1000) {
                if (data.sil[0] > 0) {
                    $("#title").val(data.sil[0].sti);
                    $("#desc").val(data.sil[0].spu);
                    //分享图片
                    shareId = data.sil[0].si;
                }
            } else {
                console.log('fqfqfqfwq');
                $("#title").val('XX律师微网站');
                $("#desc").val('XX律师专注于资本市场、基金、投融资、并购、公司法务等等');
                //分享图片
                shareId = data.sil[0].si;
            }
        },
        error: function() {
            alert('网络连接错误或服务器异常！');
        }
    })
}

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
});
//jartto:upload
function uploadShareImg() {
    var file = document.getElementById('icon').files[0],
        reader = new FileReader();
    reader.addEventListener('load', function() {
        var fd = new FormData();
        fd.append('ThirdUpload', file);
        fd.append('filename', file.name);
        // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo 6分享
        $.ajax({
            type: 'POST',
            url: Common.globalDistUrl() + 'exp/ThirdUpload.do?session=' + session + '&type=6',
            data: fd,
            processData: false,
            contentType: false,
            success: function(data) {
                console.log(data); 
                var shareImgSrc = data.on;
                setWxShare(shareImgSrc);
            },
            error: function(error) {
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

//设置分享
var setWxShare = function(src) {
    // if(!validateInput()) return;

    if (shareId) { //更新
        tempData = {
            si: shareId,
            st: 2,
            sti: $("#title").val(),
            sd: $("#desc").val(),
            spu:src
        }
    } else { //插入
        tempData = {
            st: 2,
            sti: $("#title").val(),
            sd: $("#desc").val(),
            spu:src
        }
    }

    $.ajax({
        type: 'POST',
        url: 'http://t-dist.green-stone.cn/' + 'exp/ThirdSetShareInfo.do?session=' + session,
        data: JSON.stringify(tempData),
        dataType:'json',
        contentType:'application/json',
        success: function(data) {
            console.log(data);
            if (data.c == 1000) {
                window.location.href = 'custom.html?session=' + session;
            }
        },
        error: function() {
            alert('网络连接错误或服务器异常！');
        }
    })

}

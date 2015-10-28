$(document).ready(function() {
    init(getServerInfo);
    // alert(window.screen.width);
    $('.box').click(function() {
        $(this).css({
            '-webkit-animation-name': 'moveOut',
            '-webkit-animation-iteration-count': '1',
            '-webkit-transform': 'scale(0)',
            '-webkit-animation-duration': '800ms'
        });
        $('.codebox').css({
            '-webkit-animation-name': 'bigSmall',
            '-webkit-transform': 'scale(1)'
        });
        $('.user i').show(1200);
    });

    function init(callback){
        var ic = getUrlParams('ic');
        if(!ic){
            alert('无效优惠码!');
            $('title').text('我是绿石科技，给你我的专属优惠码，找到你的私人律师！')
            $('#username').text('绿石科技');
            $('#qrcode').attr('src','qrcode/code.png');
            return;
        }
        callback(ic);
    }

    function getServerInfo(ic) {
        console.log(ic);
        $.ajax({
            method: 'get',
            url: 'http://mshare.green-stone.cn/comm/WeiXinCreatQrPic.do?ic='+ic,
            success: function(data) {
                console.log(JSON.stringify(data));
                if (data.c == 1000) {
                    $('title').text('我是'+data.nm+'，给你我的专属优惠码，找到你的私人律师！');
                    $('#username').text(data.nm);
                    $('#qrcode').attr('src','qrcode/'+data.fn);
                } else if (data.c == 1014) {
                    alert('error:' + data.d);
                }
            },
            error: function(xhr, status, err) {
                alert('error:' + err.toString());
                console.error(this.props.url, status, err.toString());
            }
        });
    }

    function getUrlParams(p) {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {};
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[p.toLowerCase()];
        if (typeof(returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    }
});

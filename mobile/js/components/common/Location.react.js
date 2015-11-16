var React = require('react');
var wx = require('weixin-js-sdk');

var Location = React.createClass({
    wxSignature: function() {
        var currentPath = window.location.href,
            uri = encodeURIComponent(currentPath.toString());
        //alert('uri:' + uri);
        $.ajax({
            type: 'get',
            url: '/usr/WeiXinJSapiSignature.do?apath=' + uri,
            success: function(data) {
                //alert('wxscan:' + JSON.stringify(data));
                if (data.c == 1000) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.noncestr, // 必填，生成签名的随机串
                        signature: data.signature, // 必填，签名，见附录1
                        jsApiList: ['openLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });

                    wx.ready(function() {
                        wx.checkJsApi({
                            jsApiList: ['openLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                            success: function(res) {
                                // 以键值对的形式返回，可用的api值true，不可用为false
                                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                            }
                        });
                        wx.openLocation({
                            latitude: 0, // 纬度，浮点数，范围为90 ~ -90
                            longitude: 0, // 经度，浮点数，范围为180 ~ -180。
                            name: '我的地址', // 位置名
                            address: '北京市朝阳区时间国际4号楼', // 地址详情说明
                            scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
                            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
                        });
                    });

                } else {
                    alert('code:' + data.c + ',error:' + data.d);
                }
            },
            error: function(xhr, status, err) {
                alert('error:' + JSON.stringify(err));
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    render: function() {
        return ( 
          <div onClick = {this.wxSignature}>
            测试类库 < /div>
        );
    },
});

module.exports = Location;

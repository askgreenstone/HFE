var React = require('react');
var wx = require('weixin-js-sdk');
var CommonMixin = require('../Mixin');
var Message = require('./Message.react');

var Share = React.createClass({
    mixins:[CommonMixin],
    wxSignature: function() {
        var that = this;
        // if(that.props.title) return;
        var ownUri = this.getUrlParams('ownUri'),
            ntid = this.getUrlParams('ntid'),
            nid = this.getUrlParams('nid'),
            currentPath = global.share+'/mobile/wxMiddle.html?ownUri='+ownUri+'&target='+this.props.target+'&ntid='+ntid+'&nid='+nid,
            // currentPath = 'http://dist.green-stone.cn/mobile/wxMiddle.html?ownUri=e442&wxsharetype=1',
            wxPath = window.location.href,
            uri = encodeURIComponent(wxPath.toString());
        // alert(currentPath);
        if(!ownUri) return;
        // alert('currentPath:'+currentPath+',wxPath:'+wxPath);
        // alert('uri:' + uri);
        $.ajax({
            type: 'get',
            url: global.url+'/usr/ThirdJSapiSignature.do?apath=' + uri+'&ownUri='+ownUri,
            success: function(data) {
                // alert('wxscan:' + JSON.stringify(data));
                if (data.c == 1000) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.noncestr, // 必填，生成签名的随机串
                        signature: data.signature, // 必填，签名，见附录1
                        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','hideOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });

                    wx.ready(function() {
                        wx.checkJsApi({
                            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','hideOptionMenu'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                            success: function(res) {
                                // 以键值对的形式返回，可用的api值true，不可用为false
                                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                            }
                        });
                        //分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: that.props.title, // 分享标题
                            link: currentPath, // 分享链接
                            imgUrl: that.props.imgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                // alert('success');
                                // alert(currentPath);
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                // alert('取消分享！');
                            }
                        });

                        // alert('title:'+that.props.title+',desc:'+that.props.desc);
                        // if(!that.props.title || !that.props.desc){
                        //   window.location.reload();
                        // }
                        //分享给朋友
                        wx.onMenuShareAppMessage({
                            title: that.props.title, // 分享标题
                            desc: that.props.desc, // 分享描述
                            link: currentPath,// 分享链接
                            imgUrl: that.props.imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                // alert('success');
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                // alert('取消分享！');
                            }
                        });
                        // wx.hideOptionMenu();
                        wx.error(function(res) {
                           // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                            // alert(res.errMsg);
                            // that.sendWxMsg(data.appId,res);
                            window.location.reload();
                         });
                    });

                } else if(data.c == 1040){
                    console.log("避开微信认证")
                } else {
                     that.showAlert('share code:' + data.c);
                }
            },
            error: function(xhr, status, err) {
                that.showAlert('网络连接错误或服务器异常！');
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    componentDidMount: function(){
      this.wxSignature();
    },
    componentWillMount: function(){
      // this.wxSignature();
    },
    render: function() {
        return ( 
          <div>  
          <Message/>
          </div>
        );
    },
});

module.exports = Share;

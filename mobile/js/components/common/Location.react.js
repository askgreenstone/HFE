var React = require('react');
var wx = require('weixin-js-sdk');
var CommonMixin = require('../Mixin');

var Location = React.createClass({
  mixins:[CommonMixin],
  wxSignature: function(x,y) {
    // alert('wxSignature');
      var temp = window.location.href+'',
          currentUrl = this.fixWxUrl(temp),
          uri = encodeURIComponent(currentUrl),
          ownUri = this.getUrlParams('ownUri');
      if(!ownUri) return;
      // alert(temp);
      // alert(currentUrl);
      var that = this;
      $.ajax({
          type: 'get',
          url: global.url+'/usr/ThirdJSapiSignature.do?apath=' + uri+'&ownUri='+ownUri,
          success: function(data) {
              // alert('ThirdJSapiSignature:' + JSON.stringify(data));
              if (data.c == 1000) {
                  wx.config({
                      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                      appId: data.appId, // 必填，公众号的唯一标识
                      timestamp: data.timestamp, // 必填，生成签名的时间戳
                      nonceStr: data.noncestr, // 必填，生成签名的随机串
                      signature: data.signature, // 必填，签名，见附录1
                      jsApiList: ['checkJsApi','openLocation','getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                  });

                  wx.ready(function() {
                      wx.checkJsApi({
                          jsApiList: ['openLocation','getLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                          success: function(res) {
                            // alert(JSON.stringify(res));
                              // 以键值对的形式返回，可用的api值true，不可用为false
                              // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                          }
                      });
                  });
                  wx.openLocation({
                    latitude: x, // 纬度，浮点数，范围为90 ~ -90
                    longitude: y, // 经度，浮点数，范围为180 ~ -180。
                    name: '办公地址', // 位置名
                    address: that.props.currentpath, // 地址详情说明
                    scale: 13, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
                  });
                  wx.getLocation({
                    success: function (res) {
                      // alert(JSON.stringify(res));
                    },
                    cancel: function (res) {
                      alert('用户拒绝授权获取地理位置');
                    }
                  });

                  wx.error(function(res) {
                      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                      // alert(res.errMsg);
                      that.sendWxMsg(data.appId,res);
                  });

                   // $('body').css({'background':'#fff'});

              } else {
                  alert('wx location code:' + data.c + ',error:' + data.d);
              }
          },
          error: function(xhr, status, err) {
              alert('网络连接错误或服务器异常！');
              console.error(this.props.url, status, err.toString());
          }
      });
  },
  getLocationInfo: function(){
    // $('.location_page').hide();
    // alert('click');
    var that = this;
    $.ajax({
        type: 'post',
        url: global.url+'/comm/QQMapLocation.do',
        data: JSON.stringify({
            'region': that.props.region,
            'address':that.props.target
        }),
        success: function(data) {
            // alert(JSON.stringify(data));
            console.log(JSON.stringify(data));
            // alert('lng:'+data.result.location.lng+'---'+'lat:'+data.result.location.lat);
            that.wxSignature(data.result.location.lat,data.result.location.lng);
        },
        error: function(xhr, status, err) {
            // alert('getLocationInfo error:' + JSON.stringify(xhr));
            console.error(this.props.url, status, err.toString());
        }
    });
  },
  componentDidMount: function(){
    $('body').css({'background':'url(image/map.png)','background-size':'cover'});
    this.getLocationInfo();
  },
  render: function() {
      return ( 
        <div className="location_page">
          <h3>{this.props.target}</h3>
          <span onClick={this.getLocationInfo}>查看详情</span>
        </div>
        
      );
  }
});

module.exports = Location;

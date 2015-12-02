var React = require('react');
var CommonMixin = require('../../Mixin');
var wx = require('weixin-js-sdk');
var Share = require('../../common/Share.react');

var Card = React.createClass({
  mixins:[CommonMixin],
  qrCode: function(){
    $('.qr_hidden').show(500);
  },
  hideDiv: function(){
    $('.qr_hidden').hide(500);
  },
  gotoLink: function(path){
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri');
  },
  wxSignature: function(x,y) {
      var currentPath = window.location.href,
          uri = encodeURIComponent(currentPath.toString()),
          ownUri = this.getUrlParams('ownUri');
      if(!ownUri) return;
      // alert(currentPath);
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
                      jsApiList: ['openLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                  });

                  wx.ready(function() {
                      wx.checkJsApi({
                          jsApiList: ['openLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                          success: function(res) {
                            // alert(JSON.stringify(res));
                              // 以键值对的形式返回，可用的api值true，不可用为false
                              // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                          }
                      });
                  });
                  // alert('openLocation:'+y+'-----'+x+',address:'+this.props.currentpath);
                  wx.openLocation({
                    latitude: x, // 纬度，浮点数，范围为90 ~ -90
                    longitude: y, // 经度，浮点数，范围为180 ~ -180。
                    name: '办公地址', // 位置名
                    address: '北京市朝阳区时间国际4号楼', // 地址详情说明
                    scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
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
                      alert(res.errMsg);
                  });

              } else {
                  alert('code:' + data.c + ',error:' + data.d);
              }
          },
          error: function(xhr, status, err) {
              alert('网络连接错误或服务器异常！');
              console.error(this.props.url, status, err.toString());
          }
      });
  },
  getLocationInfo: function(){
    var that = this;
    $.ajax({
        type: 'post',
        url: global.url+'/comm/QQMapLocation.do',
        data: JSON.stringify({
            'region': '北京',
            'address':'北京市昌平区天通苑西三区'
        }),
        success: function(data) {
            // alert(JSON.stringify(data));
            // console.log(JSON.stringify(data));
            // alert('lng:'+data.result.location.lng+'---'+'lat:'+data.result.location.lat);
            that.wxSignature(data.result.location.lat,data.result.location.lng);
        },
        error: function(xhr, status, err) {
            alert('getLocationInfo error:' + JSON.stringify(xhr));
            console.error(this.props.url, status, err.toString());
        }
    });
  },
  componentDidMount: function(){
    $('.user_info').css({'background':'#ebebeb'});
    $('.qr_hidden').height($('#myapp').height());
  },
  render: function() {
    return (
    	<div>
        <div className="qr_hidden" onClick={this.hideDiv}>
          <img src="image/qrcode.jpg" width="200" height="200"/>
        </div>
    		<div className="user_info">
    			<img className="ui_header" src="image/wj.png" width="65" height="65"/>
    			<p>
    				<span>王杰</span><br/>
    				<span>大成律师事务所</span><br/>
    				<span>合伙人</span>
    			</p>
    			<img onClick={this.qrCode} className="ui_qrcode" src="image/qrcode.jpg" width="55" height="55"/>
    		</div>
    		<div className="user_content">
    			<div className="uc_input">
    				<a href="tel://13718128160">
              13718128160
              <img src="image/theme002/telphone1.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input">
            <a href="mailto:jie.wang@dachenglaw.com">
              jie.wang@dachenglaw.com
    				  <img src="image/theme002/email.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input">
            <a href="tel://010-4009649288">
              010-4009649288
    				  <img src="image/theme002/fax.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input">
            <a href="http://www.dachengnet.com/">
              http://www.dachengnet.com/
    				  <img src="image/theme002/web.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input fixed">
            <a href="javascript:void(0);" onClick={this.gotoLink.bind(this,'adress')}>
    				  北京市朝阳区三元桥曙光西路<br/>时间国际四号楼1201室，100026
              <img src="image/theme002/adress.png" width="25" height="25"/>
            </a>
    			</div>
	    		<div className="user_intro">
	    			<i>简介</i>
	    			<p>王杰律师常年担任众多大型国有企业、跨国公司、国际投资机构、商业银行机构、
	    			投资基金等常年法律顾问，对企业改制、上市、并购、投融资、不良贷款剥离与处置等有
	    			深入的了解和掌握。涉及业务包括境内外VC／PE、改制重组、IPO、企业改制、产权交易。
	    			</p>
	    		</div>
	    		<div className="user_intro">
	    			<i>专业领域</i>
	    			<p>资本市场、基金、投融资、并购、公司法务、境外直接投资</p>
	    		</div>
	    		<div className="user_create">
                    <a href="http://viewer.maka.im/pcviewer/FI09ICYA">创建我的微名片</a>
                </div>
	    	</div>
        <Share title={"王杰律师微名片"} desc={"王杰律师:北京大成律师事务所高级合伙人"} 
        imgUrl={"http://transfer.green-stone.cn/WXweb_wangjiepor.png"}/>
    	</div>
    );
  },
});

module.exports = Card;
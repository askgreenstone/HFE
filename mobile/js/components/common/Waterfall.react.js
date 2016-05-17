var React = require('react');
var Masonry = require('react-masonry-component')(React);
var wx = require('weixin-js-sdk');
var CommonMixin = require('../Mixin');

var masonryOptions = {
  // transitionDuration: 0
  percentPosition:true,
  gutter:5
};

var Waterfall = React.createClass({
  mixins:[CommonMixin],
  getInitialState:function(){
    return {src:'',describe:''};
  },
  gotoSingle: function(src,describe){
    console.log(this.props.item);
    var photoLists = [];
    this.props.item.forEach(function(item,index){
      // console.log(item.pn);
      photoLists.push(global.img+item.pn);
    });
    wx.ready(function() {
        wx.checkJsApi({
            jsApiList: ['previewImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
              // alert(JSON.stringify(res));
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
        });
        wx.previewImage({
            current: global.img+src, // 当前显示图片的http链接
            urls: photoLists // 需要预览的图片http链接列表
        });
    });
  },
  wxSignature: function(one,all) {
    // alert('wxSignature');
      var temp = window.location.href+'',
          currentUrl = this.fixWxUrl(temp),
          uri = encodeURIComponent(currentUrl),
          ownUri = this.getUrlParams('ownUri');
      if(!ownUri) return;

      var that = this;
      $.ajax({
          type: 'get',
          url: global.url+'/usr/ThirdJSapiSignature.do?apath=' + uri+'&ownUri='+ownUri,
          success: function(data) {
              // alert('location:' + JSON.stringify(data));
              if (data.c == 1000) {
                  wx.config({
                      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                      appId: data.appId, // 必填，公众号的唯一标识
                      timestamp: data.timestamp, // 必填，生成签名的时间戳
                      nonceStr: data.noncestr, // 必填，生成签名的随机串
                      signature: data.signature, // 必填，签名，见附录1
                      jsApiList: ['checkJsApi','previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                  });

                  wx.error(function(res) {
                      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                      // alert(res.errMsg);
                      that.sendWxMsg(data.appId,res);
                  });

              } else if(data.c == 1040){
                  console.log("避开微信认证");
              }  else {
                  alert('wx preview code:' + data.c + ',error:' + data.d);
              }
          },
          error: function(xhr, status, err) {
              this.showAlert('网络连接错误或服务器异常！');
              console.error(this.props.url, status, err.toString());
          }
      });
  },
  componentDidMount:function(){
    this.wxSignature();
  }, 
  render: function () {
      var screenWidth = document.body.scrollWidth/2-10;
      var that = this;
      var childElements = this.props.item.map(function(ele,i){
         return (
              <li onClick={that.gotoSingle.bind(that,ele.pn,ele.pd?ele.pd:'暂无描述')} key={new Date().getTime()+i} className="water-fall-list">
                  <img src={global.img+ele.pn+'@300w'} width={screenWidth}/>
                  <div>{ele.pd?(ele.pd.length>12?ele.pd.substring(0,12)+'...':ele.pd):'暂无描述'}</div>
              </li>
          );
      });
      return (
          <div>
            <Masonry
                className={'water-fall-ul'} 
                elementType={'ul'} 
                options={masonryOptions} 
                disableImagesLoaded={false} >
                {childElements}
            </Masonry>
          </div>
      );
  }
});

module.exports = Waterfall;
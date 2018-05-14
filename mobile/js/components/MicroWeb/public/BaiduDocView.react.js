// 用于打开百度文档
var React = require('react');
var CommonMixin = require('../../Mixin');
var Share = require('../../common/BaiduDoc.react');

var BaiduDocView = React.createClass({
  mixins:[CommonMixin],
  getInitialState:function(){
    return {docSrc:''}
  },
  openBaiduoffice: function(){
    var bdid = this.getUrlParams('bdid');
    var docId = bdid.substring(0,bdid.indexOf('_'));
    // console.log(docId);
    var option = {
        docId: docId,
        token: 'TOKEN',
        host: 'BCEDOC',
        width: 600, //文档容器宽度
        zoom: true,              //是否显示放大缩小按钮
        zoomStepWidth:200,
        pn: 1,  //定位到第几页，可选
        ready: function (handler) {  // 设置字体大小和颜色, 背景颜色（可设置白天黑夜模式）
            handler.setFontSize(1);
            handler.setBackgroundColor('#fff');
            handler.setFontColor('#000');
        },
        flip: function (data) {    // 翻页时回调函数, 可供客户进行统计等
            // console.log(data.pn);
        },
        fontSize:'big'
    };
    new Document('reader', option);
    window.Wenku.userSide = "dulearn"; 

    
    // 横屏检测
    var ua = navigator.userAgent.toLowerCase();
    window.addEventListener('orientationchange', function(event){
      if ( window.orientation == 180 || window.orientation==0 ) {
          $('#myapp').css('display','block');
      }
      if( window.orientation == 90 || window.orientation == -90 ) {
          $('#myapp').css('display','none');
          setTimeout(function(){
            alert('横屏体验较差，请竖屏查看');
          },500);
      }
    });
  },
  componentDidMount: function(){
    var that = this;
  },
  componentWillMount: function(){
    this.openBaiduoffice()
  },
  render: function() {
  	return (
      <div>
        <div id="reader"></div>
      </div>
    );
  },
});

module.exports = BaiduDocView;


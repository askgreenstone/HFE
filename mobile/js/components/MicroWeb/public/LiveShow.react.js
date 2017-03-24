var React = require('react');

var CommonMixin = require('../../Mixin');
var prismplayer = require('../../common/prism-min.react');
var Message = require('../../common/Message.react');


var LiveShow = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {};
  },
  getTheOne: function(data,LiveDetailId){
    var arr = [];
    console.log(data);
    for(var i = 0,len = data.length;i<len;i++){
      if(data[i].ldid == LiveDetailId){
        arr = data[i]
      }
    }
    console.log(arr);
    return [arr];
  },
  getLiveInfo: function(LiveDetailId){
    var ownUri = this.getUrlParams('ownUri');
    var lid = this.getUrlParams('lid');
    // console.log(livedetailid);
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveInfo.do?do='+ownUri+'&lid='+lid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          // livestatus: int 直播状态  1 未直播   2直播中  3直播结束
          var liveShowData = this.getTheOne(data.ll,LiveDetailId)[0];
          console.log(liveShowData);
          var source = liveShowData.ls==3?liveShowData.va:liveShowData.la;
          console.log(source);
          var player = new prismplayer({
            id: "J_prismPlayer", // 容器id
            source: source,// 视频地址
            autoplay: true,    //自动播放：否
            width: "100%",       // 播放器宽度
            height: "100%",      // 播放器高度
            skinLayout: []
          });
          // setTimeout(function(){
          //     player.play();
          //     console.log('qiaof:video play success')
          //   },300
          // );
          player.play();
          player.on("pause", function() {
              alert("播放器暂停啦！");
              player.setPlayerSize('1px','1px')
          });
          $('.liveShow_bottom').css('display','-webkit-box');
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  }, 
  componentDidMount: function(){
    var $body = $('body')
    document.title = '播放页面';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
  },
  componentWillMount: function(){
    var ldid = this.getUrlParams('ldid');
    this.getLiveInfo(ldid);
  },
  render:function(){
    var now  = new Date().getTime();
    return(
        <div>
          <div id="J_prismPlayer" className="prism-player"></div>
          <div className="liveShow_bottom">
            <div className="liveShow_input"><input type="text" name=""/></div>
            <div className="liveShow_span"><span>发送</span></div>
          </div>
        </div> 
    );
  }
});

module.exports = LiveShow;
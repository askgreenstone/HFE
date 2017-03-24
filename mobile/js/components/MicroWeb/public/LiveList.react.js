var React = require('react');
var Message = require('../../common/Message.react');
var CommonMixin = require('../../Mixin');

var LiveList = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      FirstData:[],
      ListData:[],
    };
  },
  getLiveList: function(){
    var ownUri = this.getUrlParams('ownUri');
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveListInfo.do?do='+ownUri,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          this.setState({
            FirstData: data.ll.length > 0?data.ll.slice(0,1):[],
            ListData: data.ll.length > 1?data.ll.slice(1):[]
          })
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  gotoLiveDetail:function(lid){
    var ownUri = this.getUrlParams('ownUri');
    window.location.href = '#LiveDetail?ownUri='+ownUri+'&lid='+lid;
  },
  componentDidMount: function(){
    var $body = $('body')
    document.title = '直播列表';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
    var session = this.getUrlParams('session');
    // alert('直播列表页session='+session);
  },
  componentWillMount: function(){
    this.getLiveList();
  },
  render:function(){
    var FirstDataShow = this.state.FirstData.map(function(item,i){
      return(
        <div className="live_list_top" key={new Date().getTime()+i} onClick={this.gotoLiveDetail.bind(this,item.lid)}>
          <img src={global.img+item.lp} />
          <div className="live_list_top_content">
            <div><span>{item.ln}</span><span style={{display:'none'}} className="live_list_live">直播中</span></div>
            <div><span className="live_list_teacher">主讲：<span>{item.sn}</span> <span>律师</span></span><span>{new Date(item.lt).Format("MM/dd hh:mm")}</span></div>
          </div>
        </div>
       );
    }.bind(this));
    var ListDataShow = this.state.ListData.map(function(item,i){
      return(
        <li key={new Date().getTime()+i} onClick={this.gotoLiveDetail.bind(this,item.lid)}>
          <div className="live_list_bot_img"><img src={global.img+item.lp} /></div>
          <div className="live_list_bot_content">
            <div className="live_list_title">{item.ln}</div>
            <div className="live_list_content">主讲：<span>{item.sn}</span> <span>律师</span></div>
            <div className="live_list_content"></div>
          </div>
        </li>
       );
    }.bind(this));
    return(
        <div className="live_list_box">
          {FirstDataShow}
          <ul className="Live_list">
            {ListDataShow}
          </ul>
          <Message/>
        </div> 
    );
  }
});

module.exports = LiveList;
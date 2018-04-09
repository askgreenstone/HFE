var React = require('react');
var Message = require('../../common/Message.react');
var CommonMixin = require('../../Mixin');


var LiveListShow = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      ListData:[],
      pageNum: 0,
      getMoreList: false
    };
  },
  // 跳转到直播详情页面
  gotoLiveDetailShow: function(ldid){
    console.log(ldid);
    var ownUri = this.getUrlParams('ownUri');
    window.location.href = '#/LiveDetailShow?ownUri='+ownUri+'&ldid='+ldid;
  },
  // 获取直播列表
  getLiveDetailNoList: function(){
    var ownUri = this.getUrlParams('ownUri');
    // ip字段区分直播公开，私有（微信端没有授权，所以只展示公开课程）
    // ip=1表示公开   ip=2表示内部
    // 增加ife字段，is-fee : int是否收费（1免费  2收费）
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveDetailNoList.do?dou='+ownUri+'&ldid=0&c=10&ip=1&ife=1&p='+this.state.pageNum,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          if(data.ll.length<10){
            this.setState({
              getMoreList: false,
              ListData:this.state.ListData.concat(data.ll)
            })
          }else{
            this.setState({
              getMoreList: true,
              pageNum: this.state.pageNum*1+1,
              ListData:this.state.ListData.concat(data.ll)
            })
          }
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
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
  },
  componentWillMount: function(){
    this.getLiveDetailNoList();
  },
  render:function(){
    console.log(this.state.ListData);
    var that = this;
    var  LiveDetailNoList= this.state.ListData.map(function(item,i){
      return(
        <li key={i}  onClick={that.gotoLiveDetailShow.bind(that,item.ldid)}>
          <div className="lawyer_list_logo">
            <img src={item.sp?(global.img+item.sp):(global.img+'header.jpg')} width="45" height="45"/>
          </div>
          <div className="lawyer_list_msg LiveDetailNoList_box">
            <div className="lawyer_list_desc LiveDetailNoList_title">
              {item.lt}
            </div>
            <div className="lawyer_list_name LiveDetailNoList_name" >
              <div>主讲人：<span>{item.sn}</span></div><div className="LiveDetailNoList_name_isfee">{item.ife==2?'收费':'免费'}</div>
            </div>
            <div className="lawyer_list_company LiveDetailNoList_name">
              <div>时间：{new Date(item.livetime).Format("MM/dd hh:mm")}</div><div>{item.ls==1?'未直播':(item.ls==2?'直播中':'已结束')}</div>
            </div>
          </div>
        </li>
       );
      });
    return(
        <div>
          <ul className="lawyer_list">
            {LiveDetailNoList}
            <div className="timeline_more" style={{display:this.state.getMoreList?'block':'none'}}>
              <span onClick={this.getLiveDetailNoList}>加载更多</span>
            </div>
          </ul>
          <Message/>
        </div> 
    );
  }
});

module.exports = LiveListShow;
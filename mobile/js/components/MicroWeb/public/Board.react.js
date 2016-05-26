var React = require('react');
var CommonMixin = require('../../Mixin');
var Message = require('../../common/Message.react');
//时间格式化
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
//存取头像信息
var pageImg = [];
var Board = React.createClass({
  mixins:[CommonMixin],
	getInitialState:function(){
		return {flag:false,msgList:[]}
	},
  getMsgList: function(gi,sess,mb){
    var ts = new Date().getTime();
    var that = this;
    $.ajax({
        type: 'get',
        url: global.url+'/usr/GroupMsgList.do?session='+sess+'&gi='+gi+'&o=0&t=0&c=1000&ts='+ts,
        success: function(data) {
            console.log(data);
            if (data.c == 1000) {
              var newArrs = [];
              $('#msgCount').text(data.s.length);
              for(var i=0;i<data.s.length;i++){
                newArrs.push({
                  type:data.s[i].f.indexOf('u')>-1?true:false,//类型：专家或者用户
                  img:data.s[i].f.indexOf('u')>-1?(mb[1].wxpor?mb[1].wxpor:'image/header.jpg'):global.img+mb[0].p,
                  name:data.s[i].p.ext.nm,
                  time:new Date(data.s[i].ts).Format("yyyy-MM-dd hh:mm:ss"),
                  ts:data.s[i].ts,
                  content:data.s[i].p.msg.msg
                });
              }
              newArrs.sort(function(obj1,obj2){
                return obj1['ts']>obj2['ts']?-1:1;
              });
              that.setState({msgList:newArrs});
            }
        },
        error: function(xhr, status, err) {
            that.showAlert('网络连接错误或服务器异常！');
            // console.error(this.props.url, status, err.toString());
        }
    });
  },
  getGroupInfo: function(){
    var that = this;
    var sess = this.getUrlParams('session'),
        gi = this.getUrlParams('groupId');
    if(!sess || !gi) return;
    $.ajax({
        type: 'get',
        url: global.url+'/usr/GroupInfo.do?session='+sess+'&gi='+gi,
        success: function(data) {
            console.log(data);
            if (data.c == 1000) {
              that.getMsgList(gi,sess,data.mb);
              pageImg = data.mb;
            }
        },
        error: function(xhr, status, err) {
            that.showAlert('网络连接错误或服务器异常！');
            console.error(this.props.url, status, err.toString());
        }
    });
  },
  sendBoardMsg: function(){
    var userInput = this.refs.boardMsgInput.value.trim();
    var that = this,
        sess = this.getUrlParams('session'),
        gi = this.getUrlParams('groupId');
    // console.log(userInput);
    if(!userInput){
      this.showAlert('留言不能为空！');
      return;
    }
    if(!sess || !gi) return;
    var tempObj = {
      target:[gi],
      msg:{
              type:'txt',
              msg:userInput
      },
      ext:{
        mi:this.createUUID(),
        nm:pageImg[1].n,
        isFromServer:1
      }
    }
    // console.log(tempObj);
    $.ajax({
        type: 'post',
        url: global.url+'/usr/SendMsg.do?session='+sess,
        data: JSON.stringify(tempObj),
        success: function(data) {
            console.log(data);
            if (data.c == 1000) {
              that.refs.boardMsgInput.value = '';
              that.showTip('留言发送成功！');
              if(pageImg){
                setTimeout(function(){
                  that.getMsgList(gi,sess,pageImg);
                },300);          
              }
            }
        },
        error: function(xhr, status, err) {
            that.showAlert('网络连接错误或服务器异常！');
        }
    });
  },
  componentDidMount: function(){
    var documentHeight = document.body.scrollHeight;
    $('.board_content').css({'height':documentHeight});
    this.getGroupInfo();
  },
  render: function() {
    var navNodes = this.state.msgList.map(function(item,i){
      return(
             <li key={new Date().getTime()+i}>
                <img src={item.img} width="65" height="65"/>
                <div className={item.type?'board_list_right':'board_list_left'}>
                  <i></i>
                  <span>{item.name+'  '+item.time}</span>
                  <p>{item.content}</p>
                </div>
                <div className="clean"></div>
              </li>
       );
    }.bind(this));
    return (
        <div className="board_box">
          <div className="board_content">
            <h3>留言板</h3>
            <textarea ref="boardMsgInput" cols="" rows="" placeholder="请输入您的问题，我会第一时间给您反馈。"/>
            <a className="board_btn" href="javascript:void(0)" onClick={this.sendBoardMsg}>提 交</a>
            <p>&nbsp;</p>
            <h3>咨询会话（<b id="msgCount">0</b>）</h3>
            <ul className="board_list">
              {navNodes}
              <div className="clean"></div>
            </ul>
          </div>
          <Message/>
        </div>
        
    );
  },
});

module.exports = Board;
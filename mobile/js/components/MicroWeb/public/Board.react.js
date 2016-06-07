var React = require('react');
// import IScrollReact ,{setDefaultIScrollOptions}from 'iscroll-react';
// import IScroll from 'iscroll';
var wx = require('weixin-js-sdk');
var CommonMixin = require('../../Mixin');
var Message = require('../../common/Message.react');
//初始化iscroll配置
// setDefaultIScrollOptions({
//     scrollbars: false,
//     mouseWheel: true,
//     shrinkScrollbars: "scale",
//     fadeScrollbars: true,
//     click: true,
// })

// <IScrollReact iScroll={IScroll} ref="iscroll" alwaysScroll>
// </IScrollReact>

// componentDidUpdate: function(){
//   if (this.refs.iscroll) {
//       this.refs.iscroll.updateIScroll();
//   }
// }
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
		return {flag:false,msgList:[],mi:'',sess:'',expt:''}
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
                  time:new Date(data.s[i].ts).Format('yyyy-MM-dd hh:mm:ss'),
                  ts:data.s[i].ts,
                  content:data.s[i].p.msg.msg,
                  pic:data.s[i].p.ext.file?(global.img+data.s[i].p.ext.on):'',
                  doc:!data.s[i].p.ext.file&&data.s[i].p.ext.on?that.fixSrc(data.s[i].p.ext.on):'',
                  fn:data.s[i].p.ext.fn,
                  pay:data.s[i].p.ext.p?data.s[i].p.ext.p:'',
                  mi:data.s[i].p.ext.mi?data.s[i].p.ext.mi:'',
                  sn:data.s[i].p.ext.sn?data.s[i].p.ext.sn:'',
                  extra:data.s[i].p.ext.extra?data.s[i].p.ext.extra:''
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
  fixSrc:function(src){
    console.log(src);
    var temp = src.split('.')[0];
    return temp;
  },
  //小数点后保留两位数
  formartDecimal:function(x){
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        //alert('function:changeTwoDecimal->parameter error');
        return false;
    }
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
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
              for(var i=0;i<data.mb.length;i++){
                if( data.mb[i].i.indexOf('e')>-1 ){
                  that.setState({expt:data.mb[i].f});
                }
              }
              
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
  reloadMsg: function(){
    var sess = this.getUrlParams('session'),
        gi = this.getUrlParams('groupId');
    if(pageImg){
      this.getMsgList(gi,sess,pageImg); 
      this.showTip('刷新成功！');   
    }
  },
  viewDoc: function(name){
    window.location.href = '#empty?name='+name;
  },
  weixinpay: function(mi){
    var sess = this.getUrlParams('session');
    var url = '';
    var str = window.location.href;
    if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
      url = 'http://t-mshare.green-stone.cn'
    }else{
      url = 'http://mshare.green-stone.cn'
    }
    window.location.href = url + '/htm/react/card.html?session='+sess+'&mi='+mi+'&expType='+this.state.expt;
  },
  gotoSingle: function(src){
    // alert(src);
    var photoLists = [];
    photoLists.push(src);
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
            current: src,// 当前显示图片的http链接
            urls: photoLists
        });
    });
  },
  wxSignature: function(one,all) {
    // alert('wxSignature');
      var temp = window.location.href+'',
          currentUrl = this.fixWxUrl(temp),
          uri = encodeURIComponent(currentUrl);

      var that = this;
      $.ajax({
          type: 'get',
          url: global.url+'/usr/ThirdJSapiSignature.do?apath=' + uri,
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
  componentDidMount: function(){
    var documentHeight = document.body.scrollHeight;
    $('.board_content').css({'height':documentHeight});
  },
  componentWillMount: function(){
    this.wxSignature();
    this.getGroupInfo();
  },
  render: function() {
    var navNodes = this.state.msgList.map(function(item,i){
      if(item.pic || item.doc || item.pay){
      return(
              <li key={new Date().getTime()+i}>
                <img src={item.img} width="65" height="65"/>
                <div className={item.type?'board_list_left':'board_list_right'}>
                  <i></i>
                  <span>{item.name+'  '+item.time}</span>
                  <img style={{'display':item.pic?'block':'none'}} src={item.pic+'@300w'} onClick={this.gotoSingle.bind(this,item.pic)} width="100%"/>
                  <a style={{'display':item.doc?'block':'none'}} onClick={this.viewDoc.bind(this,item.doc)} href="javascript:void(0);">{'文件：'+item.fn}</a>
                  <div style={{'display':item.pay?'block':'none'}}>
                    收费名片<br/>
                    {'收款方：'+item.name}<br/>
                    {'收费项目：'+item.sn}<br/>
                    {'收费金额：'+this.formartDecimal(item.pay)+' 元'}<br/>
                    {'备注信息：'+item.extra}<br/>
                    <a onClick={this.weixinpay.bind(this,item.mi)} href="javascript:void(0);">点击此处，立即支付</a>
                  </div>
                </div>
                <div className="clean"></div>
              </li>
      )}else{
        return(<li key={new Date().getTime()+i}>
                <img src={item.img} width="65" height="65"/>
                <div className={item.type?'board_list_left':'board_list_right'}>
                  <i></i>
                  <span>{item.name+'  '+item.time}</span>
                  <p>{item.content}</p>
                </div>
                <div className="clean"></div>
              </li>
      )}
    }.bind(this));
    return (
        <div className="board_box">
            <div className="board_content">
                <div id="iscroll_wrap">
                  <h3>留言板</h3>
                  <textarea ref="boardMsgInput" cols="" rows="" placeholder="请输入您的问题，我会第一时间给您反馈。"/>
                  <a className="board_btn" href="javascript:void(0)" onClick={this.sendBoardMsg}>提 交</a>
                  <p>&nbsp;</p>
                  <h3>咨询会话（<b id="msgCount">0</b>）</h3>
                  <a className="board_reload" href="javascript:void(0)" onClick={this.reloadMsg}>刷新会话</a>
                  <ul className="board_list">
                    {navNodes}
                    <div className="clean"></div>
                  </ul>
                </div>
            </div>
          <Message/>
        </div>
    );
  },
});

module.exports = Board;
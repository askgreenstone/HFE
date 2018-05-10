var React = require('react');
var Message = require('../../common/Message.react');
var Share = require('../../common/Share.react');
var CommonMixin = require('../../Mixin');
var CryptoJS = require('../../common/CryptoJS.react');

var MemberLogin = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      messageCodeFlag: true,
      time: 60,
      userSession: '',
      payParams: {}
    };
  },
  checkUserTel: function(){
    var userTel = $('#userTel').val();
    // console.log(userTel);
    if(!userTel){
      this.showAlert('请输入电话！')
      return;
    }else if(userTel.length != 11){
      this.showAlert('电话号码位数不正确！')
      return;
    };
    var token = encodeURIComponent(CryptoJS.HmacSHA1('gstonesms'+userTel+'gstone-bu5-rEIqop89NZiJwkqX6Bi1ZW2wEi92','gstonesms').toString(CryptoJS.enc.Base64));
    // console.log(token);
    $.ajax({
      type: 'get',
      url: global.url+'/comm/Verify.do?pn='+userTel+'&token='+token,
      success: function(data) {
        // console.log(data);
        if(data.c == 1000){
          this.getMessageCode();
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  getMessageCode: function(){
    var that = this;
    // console.log(that.state.time);
    var messageTime = that.state.time;
    if(messageTime == 0 ){
      that.setState({
        messageCodeFlag: true,
        time: 60
      })
      return;
    }
    that.setState({
      messageCodeFlag: false
    })
    setTimeout(function(){
      that.setState({
        time: that.state.time*1-1
      })
      that.getMessageCode();
    },1000)
  },
  expLogin: function(){
    var userTel = $('#userTel').val();
    var userCode = $('#userCode').val();
    var ownUri = this.getUrlParams('ownUri');
    var lid = this.getUrlParams('lid');
    var ldid = this.getUrlParams('ldid');
    var openId = this.getUrlParams('openId');
    var unionid = this.getUrlParams('unionid');
    if(!userTel){
      this.showAlert('请输入电话！')
      return;
    }else if(userTel.length != 11){
      this.showAlert('电话号码位数不正确！')
      return;
    }else if(!userCode){
      this.showAlert('请输入验证码！')
      return;
    }
    var data = {
      pn: userTel,
      vc: userCode,
      openId: openId,
      unionid: unionid
    }
    $.ajax({
      type: 'post',
      url: global.url+'/exp/WebLogin.do?',
      data: JSON.stringify(data),
      success: function(data) {
        // console.log(data);
        if(data.c == 1001){
          this.showAlert('验证码错误！');
          return;
        }
        // else if(data.c == 1014){
        //   var that = this;
        //   this.showAlert('您尚未注册，请先注册！',function(){
        //     window.location.href = global.url + '/coop/askLawyers/view/openMember.html?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid+'&openId='+openId+'&unionid='+unionid;
        //   });
        // }
        else if(data.c == 1000){
          // is-live-member : int 是否直播会员 1 是， 0 否
          // if(data.ilm == 1){
          //   // window.location.href = global.url +'/mobile/wxMiddle.html?ownUri='+ownUri+'&target=LiveDetail&lid='+lid+'&ldid='+ldid+'&session='+data.session;
            
          //   window.location.href = '#LiveDetail?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid+'&session='+data.session;
            
          // }else if(data.ilm == 0){
          //   this.showAlert('您尚未购买会员服务，请先购买！',function(){
          //     window.location.href = global.url + '/coop/askLawyers/view/openMember.html?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid+'&openId='+openId+'&unionid='+unionid;
          //   });
          // }
          this.checkUserType(data.session)
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  checkUserType: function(session){
    var ownUri = this.getUrlParams('ownUri');
    var lid = this.getUrlParams('lid');
    var ldid = this.getUrlParams('ldid');
    $.ajax({
      type: 'post',
      url: global.url+'/exp/QueryIsDeptMember.do?session='+session+'&do='+ownUri,
      success: function(data) {
        // console.log(data);
        // idm : int 是否机构成员 1 是， 0 否
        if(data.c == 1000){
          if(data.idm == 1){
            window.location.href = '#LiveDetail?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid+'&session='+session;
          }else{
            this.showAlert('您还不是机构成员！',function(){
              window.location.href = '#LiveDetail?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid;
            });
          }
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  gotoOpenMember: function(){
    var ownUri = this.getUrlParams('ownUri');
    var lid = this.getUrlParams('lid');
    var ldid = this.state.ldid;
    var temp;
    var appid;
    var str = window.location.href;
    // window.location.href = '#OpenMember?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid;
    if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
      temp = 't-web';
      appid = 'wx2858997bbc723661';
    }else{
      temp = 'web';
      appid = 'wx73c8b5057bb41735';
    }
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri=http%3a%2f%2f'+temp+'.green-stone.cn%2fexp%2fWeiXinWebOAuthForExp.do&response_type=code&scope=snsapi_base&state=livememberpay_'+ownUri+'_'+lid+'_'+ldid+'#wechat_redirect';
  },
  componentDidMount: function(){
    var $body = $('body')
    document.title = '用户登录';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
  },
  componentWillMount: function(){

  },
  render:function(){
    return(
        <div className="open_member">
          <div className="open_member_input_box">
            <span>+86</span>
            <input type="text" placeholder="请输入电话号码" id="userTel"/>
          </div>
          <div className="open_member_input_box">
            <input type="text" placeholder="请输入短信验证码" id="userCode"/>
            <span className="login_box_code_button" style={{display:this.state.messageCodeFlag?'block':'none'}} onClick={this.checkUserTel} >短信验证码</span>
            <span className="login_box_code_time" style={{display:this.state.messageCodeFlag?'none':'block'}}>
              <span className="login_box_code_button">重新发送</span>
              <span className="login_box_code_time_code">{this.state.time}</span>
              s
            </span>
          </div>
          <div className="open_member_submit member_login_submit" onClick={this.expLogin}>
            <span>登录</span>
          </div>
          <Message/>
        </div> 
    );
  }
});

module.exports = MemberLogin;
var React = require('react');
var Message = require('../../common/Message.react');
var Share = require('../../common/Share.react');
var CommonMixin = require('../../Mixin');
var Message = require('../../common/Message.react');

var OpenMember = React.createClass({
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
    console.log(userTel);
    if(!userTel){
      this.showAlert('请输入电话！')
      return;
    }else if(userTel.length != 11){
      this.showAlert('电话号码位数不正确！')
      return;
    };
    $.ajax({
      type: 'get',
      url: global.url+'/comm/Verify.do?pn='+userTel,
      success: function(data) {
        console.log(data);
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
    console.log(that.state.time);
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
  expRegister: function(){
    var userTel = $('#userTel').val();
    var userCode = $('#userCode').val();
    var ownUri = this.getUrlParams('ownUri');
    var lid = this.getUrlParams('lid');
    var ldid = this.getUrlParams('ldid');
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
      vc: userCode
    }
    $.ajax({
      type: 'post',
      url: global.url+'/exp/WebLogin.do?',
      data: JSON.stringify(data),
      success: function(data) {
        console.log(data);
        if(data.c == 1001){
          this.showAlert('验证码错误！');
          return;
        }else if(data.c == 1014){
          var that = this;
          this.showAlert('您尚未注册，请先注册！',function(){
            that.gotoOpenMember();
          });
        }else if(data.c == 1000){
          window.location.href = '#LiveShow?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid+'&session='+data.session;
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
    document.title = '会员登录';
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
          <div className="open_member_submit" onClick={this.expRegister}>
            <span>登录</span>
          </div>
          <Message/>
        </div> 
    );
  }
});

module.exports = OpenMember;
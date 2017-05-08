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
    var userName = $('#userName').val();
    var userTel = $('#userTel').val();
    var userCode = $('#userCode').val();
    var userDepart = $('#userDepart').val();
    var openId = this.getUrlParams('openId');
    if(!userName){
      this.showAlert('请输入您的姓名！')
      return;
    }else if(!userTel){
      this.showAlert('请输入电话！')
      return;
    }else if(userTel.length != 11){
      this.showAlert('电话号码位数不正确！')
      return;
    }else if(!userCode){
      this.showAlert('请输入验证码！')
      return;
    }else if(!userDepart){
      this.showAlert('请输入所在单位名称！')
      return;
    }
    var data = {
      en: userName,
      pn: userTel,
      vc: userCode,
      cy: userDepart,
      openId: openId
    }
    $.ajax({
      type: 'post',
      url: global.url+'/exp/WXRegister.do?pn='+userTel,
      data: JSON.stringify(data),
      success: function(data) {
        console.log(data);
        if(data.c == 1001){
          this.showAlert('请输入正确的验证码！')
        }else if(data.c == 1000){
          this.gotoTrade(data.session);
          this.setState({
            userSession : data.session
          })
          // var ownUri = this.getUrlParams('ownUri');
          // var lid = this.getUrlParams('lid');
          // var ldid = this.getUrlParams('ldid');
          // window.location.href = '#/LiveDetail?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid+'&session='+data.session;
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  gotoTrade: function(session){
    // 掉起微信支付
    var payInfo = {
        'd': '直播会员', //描述
        'dt': 0, //int 目标类型，0 系统 1 用户 2 专家
        'f': 0.01, //float 交易金额
        'p': 2, //int 支付方式，0 账户余额 1 支付宝 2 微信支付
        't': 28, //int 交易类型。直播会员
        'from': 3 //int 客户端来源 3 web
      };
    $.ajax({
        type: 'POST',
        url: global.url+ '/exp/Trade.do?session=' + session,
        data: JSON.stringify(payInfo),
        dataType: 'json',
        success: function(data) {
            //alert( 'success:' + JSON.stringify(data) );
            console.log(data);
            if (data.c == 1000) {
              this.setState({
                payParams: {
                    'appId': data.appId,
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.packageStr,
                    'signType': 'MD5',
                    'paySign': data.paySign
                }
              })
              var that = this;
              setTimeout(function(){
                that.callPay();
              },500)
            } else {
                alert('Trade error:' + data.d);
            }
        }.bind(this),
        error: function(err) {
            alert('error:' + JSON.stringify(err));
        }.bind(this)
      });
  },
  callPay:function() {
    // alert('callPay run');
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        }
    } else {
        this.onBridgeReady();
    }
  },
  onBridgeReady:function() {
    //alert('onBridgeReady run');
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', this.state.payParams,
        function(res) {

            //if (res.err_msg == "get_brand_wcpay_request：ok") {} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
            WeixinJSBridge.log(res.err_msg);
            alert(res.err_code+res.err_desc+res.err_msg);
            if (res.err_msg.indexOf('ok') > -1) {
              // alert('tit:'+icObj.it+',month:'+icObj.lt+',ic:'+ic);
                // alert('支付成功！')
                var ownUri = this.getUrlParams('ownUri');
                var lid = this.getUrlParams('lid');
                var ldid = this.getUrlParams('ldid');
                window.location.href = '#/LiveDetail?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid+'&session='+this.state.userSession;
                // location.href = '/htm/react/success.html';
            } else if (res.err_msg.indexOf('cancel') > -1) {
                //alert('取消支付！');
            } else if (res.err_msg.indexOf('fail') > -1) {
                alert('支付失败！');
            }
        }
    );
  },
  componentDidMount: function(){
    var $body = $('body')
    document.title = '开通会员';
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
            
            <input type="text" placeholder="请输入真实姓名" id="userName"/>
          </div>
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
          <div className="open_member_textarea_box">
            <textarea placeholder="请填写所在单位名称" id="userDepart"></textarea>
          </div>
          <div className="open_member_submit" onClick={this.expRegister}>
            <span>支付会员费  1999元</span>
          </div>
          <div className="open_member_content">
            <div>会员服务介绍：</div>
            <p>违法完了那内为开工过个我违法呢为了纪念分位列国内为各位看过完了国内为开工过完了那个我那个我违法呢为了纪念分位列国内为各位看过完了国内为开工过完了那个我那个我违法呢为了纪念分位列国内为各位看过完了国内为开工过完了那个我那个我违法呢为了纪念分位列国内为各位看过完了国内为开工过完了那个我那个我违法呢为了纪念分位列国内为各位看过完了国内为开工过完了那个我那个我违法呢为了纪念分位列国内为各位看过完了国内为开工过完了那个我那个我违法呢为了纪念分位列国内为各位看过完了国内为开工过完了那个我那个我违法呢为了纪念分位列国内为各位看过完了国内为开工过完了那个我那个我违法呢为了纪念分位列国内为各位看过完了国内为开工过完了那个我那个我</p>
          </div>
          <Message/>
        </div> 
    );
  }
});

module.exports = OpenMember;
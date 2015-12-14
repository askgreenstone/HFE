var React = require('react');
var CommonMixin = require('../../Mixin');
var wx = require('weixin-js-sdk');
var Share = require('../../common/Share.react');

var Card = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {datas:[]};
  },
  qrCode: function(){
    $('.qr_hidden').show(500);
  },
  hideDiv: function(){
    $('.qr_hidden').hide(500);
  },
  gotoLink: function(path){
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri');
  },
  getServerInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    $.ajax({
      type:'get',
      url: global.url+'/usr/QueryMicroCard.do?ownUri='+ownUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
           this.setState({
            QR:global.img+data.QR,
            hI:global.img+data.hI,
            nm:data.nm,
            dp:data.dp,
            rk:data.rk,
            Mob:data.Mob,
            eml:data.eml,
            tel:data.tel,
            web:data.web,
            adr:data.adr,
            abs:data.abs,
            rg:data.rg,
            itd:data.itd
          });
          $('.qr_hidden').height($('#myapp').height());
        }
      }.bind(this),
      error: function(xhr, status, err) {
        alert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.getServerInfo();
    $('body').css({'background':'#ebebeb'});
  },
  render: function() {
    return (
    	<div>
        <div className="qr_hidden" onClick={this.hideDiv}>
          <img src={this.state.QR} width="200" height="200"/>
        </div>
    		<div className="user_info">
    			<img className="ui_header" src={this.state.hI} width="65" height="65"/>
    			<p>
    				<span>{this.state.nm}</span><br/>
    				<span>{this.state.dp}</span><br/>
    				<span>{this.state.rk}</span>
    			</p>
    			<img onClick={this.qrCode} className="ui_qrcode" src={this.state.QR} width="55" height="55"/>
    		</div>
    		<div className="user_content">
    			<div className="uc_input">
    				<a href={'tel://'+this.state.Mob}>
              {this.state.Mob}
              <img src="image/theme002/telphone1.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input">
            <a href={'mailto:'+this.state.eml}>
              {this.state.eml}
    				  <img src="image/theme002/email.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input">
            <a href={'tel://'+this.state.tel}>
              {this.state.tel}
    				  <img src="image/theme002/fax.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input">
            <a href={this.state.web}>
              {this.state.web}
    				  <img src="image/theme002/web.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input fixed">
            <a href="javascript:void(0);" onClick={this.gotoLink.bind(this,'adress')}>
    				  {this.state.adr}
              <img src="image/theme002/adress.png" width="25" height="25"/>
            </a>
    			</div>
	    		<div className="user_intro">
	    			<i>简介</i>
	    			<p>{this.state.abs}
	    			</p>
	    		</div>
	    		<div className="user_intro">
	    			<i>专业领域</i>
	    			<p>{this.state.itd}</p>
	    		</div>
	    		<div className="user_create">
                    <a href="http://viewer.maka.im/pcviewer/FI09ICYA">创建我的微名片</a>
                </div>
	    	</div>
        <Share title={"王杰律师微名片"} desc={"王杰律师:北京大成律师事务所高级合伙人"} 
        imgUrl={global.img+"WXweb_wangjiepor.png"} target="card"/>
    	</div>
    );
  },
});

module.exports = Card;
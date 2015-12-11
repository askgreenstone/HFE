var React = require('react');
var CommonMixin = require('../../Mixin');
var wx = require('weixin-js-sdk');
var Share = require('../../common/Share.react');

var Card = React.createClass({
  mixins:[CommonMixin],
  qrCode: function(){
    $('.qr_hidden').show(500);
  },
  hideDiv: function(){
    $('.qr_hidden').hide(500);
  },
  gotoLink: function(path){
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri');
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    $('.qr_hidden').height($('#myapp').height());
  },
  render: function() {
    return (
    	<div>
        <div className="qr_hidden" onClick={this.hideDiv}>
          <img src="image/qrcode.jpg" width="200" height="200"/>
        </div>
    		<div className="user_info">
    			<img className="ui_header" src="image/wj.png" width="65" height="65"/>
    			<p>
    				<span>王杰</span><br/>
    				<span>大成律师事务所</span><br/>
    				<span>高级合伙人</span>
    			</p>
    			<img onClick={this.qrCode} className="ui_qrcode" src="image/qrcode.jpg" width="55" height="55"/>
    		</div>
    		<div className="user_content">
    			<div className="uc_input">
    				<a href="tel://13718128160">
              13718128160
              <img src="image/theme002/telphone1.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input">
            <a href="mailto:jie.wang@dachenglaw.com">
              jie.wang@dachenglaw.com
    				  <img src="image/theme002/email.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input">
            <a href="tel://010-4009649288">
              010-4009649288
    				  <img src="image/theme002/fax.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input">
            <a href="http://www.dentons.com/zh/">
              http://www.dentons.com/zh/
    				  <img src="image/theme002/web.png" width="25" height="25"/>
            </a>
    			</div>
    			<div className="uc_input fixed">
            <a href="javascript:void(0);" onClick={this.gotoLink.bind(this,'adress')}>
    				  北京市朝阳区东大桥路9号<br/>侨福芳草地大厦B座7层 邮编: 100020
              <img src="image/theme002/adress.png" width="25" height="25"/>
            </a>
    			</div>
	    		<div className="user_intro">
	    			<i>简介</i>
	    			<p>王杰律师常年担任众多大型国有企业、跨国公司、国际投资机构、商业银行机构、
	    			投资基金等常年法律顾问，对企业改制、上市、并购、投融资、不良贷款剥离与处置等有
	    			深入的了解和掌握。涉及业务包括境内外VC／PE、改制重组、IPO、企业改制、产权交易。
	    			</p>
	    		</div>
	    		<div className="user_intro">
	    			<i>专业领域</i>
	    			<p>资本市场、基金、投融资、并购、公司法务、境外直接投资</p>
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
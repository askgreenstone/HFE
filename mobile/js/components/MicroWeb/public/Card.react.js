var React = require('react');

var Card = React.createClass({
  render: function() {
    return (
    	<div>
    		<div className="user_info">
    			<img className="ui_header" src="image/wj.png" width="65" height="65"/>
    			<p>
    				<span>王杰</span><br/>
    				<span>大成律师事务所</span><br/>
    				<span>合伙人</span>
    			</p>
    			<img className="ui_qrcode" src="image/qrcode.jpg" width="55" height="55"/>
    		</div>
    		<div className="user_content">
    			<div className="uc_input">13718128160
    				<img src="image/theme002/telphone1.png" width="25" height="25"/>
    			</div>
    			<div className="uc_input">jie.wang@dachenglaw.com
    				<img src="image/theme002/email.png" width="25" height="25"/>
    			</div>
    			<div className="uc_input">010-4009649288
    				<img src="image/theme002/telphone1.png" width="25" height="25"/>
    			</div>
    			<div className="uc_input">www.askgreenstone.com
    				<img src="image/theme002/web.png" width="25" height="25"/>
    			</div>
    			<div className="uc_input fixed">北京市朝阳区三元桥曙光西路<br/>
    				时间国际四号楼1201室，100026
    				<img src="image/theme002/adress.png" width="25" height="25"/>
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
	    		<div className="user_create">创建我的微名片</div>
	    	</div>
    	</div>
    );
  },
});

module.exports = Card;
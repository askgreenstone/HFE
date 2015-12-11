var React = require('react');

require('../../../../css/theme/theme003.less');
var Index003=React.createClass({
	render:function(){
		return (
				<div>
					<header className="theme3_header">
						<span>返回</span>
						<h2>王杰微网站</h2>
					</header>
					<div className="theme3_main">
						<div>
							<img src="image/theme003/photo65.png" alt="" className="theme3_main_bg"/>
							<img src="image/theme003/logo.png" className="theme3_main_logo"/>
						</div>
						<ul className="theme3_main_list">
							<li><h2>律师介绍</h2><p>Professional Profile</p><span></span></li>
							<li><h2>代表案例</h2><p>Representative Cases</p><span></span></li>
							<li><h2>团队介绍</h2><p>Our Team</p><span></span></li>
							<li><h2>微 名 片</h2><p>E-card</p><span></span></li>
						</ul>
					</div>
				</div>
			)
	}
})

module.exports = Index003;
var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');

require('../../../../css/theme/theme003.less');
var Index003=React.createClass({
	mixins:[CommonMixin],
	getInitialState: function(){
    return {
      navArrs:[],
      path:['articleDetail','articleList','photo']
    };
  },
  gotoLink: function(path,ntid){
    var ownUri = this.getUrlParams('ownUri');
    //测试环境和正式环境用户切换
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    location.href = '#'+path+'?ownUri='+ownUri+'&ntid='+ntid;
  },
	getUserList: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    $.ajax({
      type:'get',
      url: global.url+'/exp/QueryNewsTypes.do?&ownUri='+ownUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          this.setState({navArrs:data.ntl});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        alert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
	componentDidMount: function(){
    this.staticWebPV(1);
    this.getUserList();
  },
	render:function(){
		var navNodes = this.state.navArrs.map(function(item,i){
      return(
            <li key={new Date().getTime()+i} onClick={this.gotoLink.bind(this,this.state.path[i],item.ntId)}>
              <img src={this.state.imgs[i]} width="55" height="55"/>
              <div>{item.tn}</div>
            </li>
       );
    }.bind(this));
		return (
				<div>
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
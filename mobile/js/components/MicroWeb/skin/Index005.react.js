var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

require('../../../../css/theme/theme005.less');
var Index005 = React.createClass({
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
        this.showAlert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.staticWebPV(1);
    this.getUserList();
  },
	render:function(){
		var desE = ['Professional Profile','Representative Cases','Our Team'];
		var navNodes = this.state.navArrs.map(function(item,i){
      return(
            <li key={new Date().getTime()+i} onClick={this.gotoLink.bind(this,this.state.path[i],item.ntId)}>
              <span>{item.tn}</span>
              <span>{desE[i]}</span>
            </li>
       );
    }.bind(this));
		return (
				<div>
					<div className="theme5_main">
							<div className="theme5_main_logo">
								<img src="image/theme005/logo.png" width="130" />
							</div>
							<ul className="theme5_main_list">
								{navNodes}
								<li><span>律师论坛</span><span>Lawyers Forum</span></li>
								<li onClick={this.gotoLink.bind(this,'card')}><span>微 名 片</span><span>E-Card</span></li>
							</ul>
						</div>
					<Share title={"王杰律师微网站"} desc={"王杰律师专注于资本市场、基金、投融资、并购、公司法务、境外直接投资"} 
        imgUrl={global.img+"WXweb_wangjiepor.png"} target="index005"/>
        <Message/>
				</div>
			)
	}
})
module.exports = Index005;
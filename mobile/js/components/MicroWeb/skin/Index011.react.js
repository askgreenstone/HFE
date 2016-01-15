var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

require('../../../../css/theme/theme006.less');
var Index011 = React.createClass({
	mixins:[CommonMixin],
  getInitialState: function(){
    return {
      navArrs:[],
      path:['articleList','articleList','photo']
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
		var desE = ['Articles & Publications','Lawyers Forum','Our Team'];
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
					<div className="theme6_main">
							<div className="logo">
								<img src=""/>
							</div>
							<ul className="theme6_main_list">
                {navNodes}
                <li onClick={this.gotoLink.bind(this,'card')}><span>微 名 片</span><span>E-Card</span></li>
							</ul>
						</div>
					<Share title={"青山律师团队微网站"} desc={"《青山律师直通车》是由武汉市青山区司法局整合全区律师资源，为社会提供法律服务的电商平台。汇集了5个青山区的优秀律师事务所：湖北欣安律师事务所、湖北扬子律师事务所、湖北联正律师事务所、湖北静海律师事务所、湖北圣青律师事务所。"} 
        imgUrl={global.img+"tzsxjlb20160111154037.jpg"} target="index011"/>
        <Message/>
				</div>
			)
	}
})
module.exports = Index011;

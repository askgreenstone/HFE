var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

require('../../../../css/theme/theme006.less');
var Index010 = React.createClass({
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
		var desE = ['Area of Focus','Professionals','News & Events'];
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
							<div className="logo" style={{display:this.state.logo?'block':'none'}}>
								<img src="image/theme010/logo.png"/>
							</div>
							<ul className="theme6_main_list" style={{'top':'35%'}}>
                <li onClick={this.gotoLink.bind(this,'card2')}><span>金融业务介绍</span><span>Practices & Capabilities</span></li>
								{navNodes}
                <li><a href="tel:010-58137799"><span>金融业务咨询</span><span>Finance Legal Consultancy</span></a></li>
							</ul>
						</div>
            <div className="theme6_copyright"><a href="tel:010-58678723">绿石科技研发</a></div>
					  <Share title={"大成金融律师团队微网站"} desc={"大成金融律师团队专注于融资租赁、银行、保险、信托、家族办公室咨询服务、保理、互联网金融、金融衍生品"} 
        imgUrl={global.img+"dcjr20160108111315.jpg"} target="index010"/>
        <Message/>
				</div>
			)
	}
})
module.exports = Index010;
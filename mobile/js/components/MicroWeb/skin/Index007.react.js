
//肖飒律师，与王忠德律师模板相同，待合并

var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

require('../../../../css/theme/theme003.less');
var Index007=React.createClass({
	mixins:[CommonMixin],
	getInitialState: function(){
    return {
      navArrs:[],
      path:['articleDetail','articleList','photo','articleList']
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
		var navChi=['Professional Profile','Representative Cases','Micro Album'];
    var navNodes = this.state.navArrs.map(function(item,i){
      return(
            <li key={new Date().getTime()+i} onClick={this.gotoLink.bind(this,this.state.path[i],item.ntId)}>
              <a href="javascript:void(0)"><h2>{item.tn}</h2><p>{navChi[i]}</p><span></span></a>
            </li>
       );
    }.bind(this));
		return (
				<div>
					<div className="theme3_main">
						<div className="main">
							<img src="image/theme007/photo.png" alt="" className="theme3_main_bg"/>
              <div className="logo">
                <img src="image/theme007/logo.png"/>
              </div>
							
						</div>
						<ul className="theme3_main_list">
              {navNodes}
              <li onClick={this.gotoLink.bind(this,'card')}><a href="javascript:void(0)"><h2>微 名 片</h2><p>E-Card</p><span></span></a></li>
						</ul>
            <Share title={"王忠德律师微网站"} desc={"王忠德律师专注于律师事务所运营管理，律师机构战略规划，法律行业发展研究与实践"} 
            imgUrl={global.img+"wzd20151221145959.png"} target="index003"/>
					</div>
          <Message/>
				</div>
			)
	}
})

module.exports = Index007;
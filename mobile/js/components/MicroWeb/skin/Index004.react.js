var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');

require('../../../../css/theme/theme004.less');
var Index004=React.createClass({
	mixins:[CommonMixin],
  getInitialState: function(){
    return {
      navArrs:[],
      imgs:['image/theme004/laywers.png','image/theme004/case.png','image/theme004/team.png'],
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
              <img src={this.state.imgs[i]}/>
              <p>{item.tn}</p>
            </li>
       );
    }.bind(this));
		return (
				<div>
					<div className="theme4_main">
						<div>
							<img src="image/theme004/photo.png" alt="" className="theme4_main_bg"/>
							<img src="image/theme004/logo.png" className="theme4_main_logo"/>
						</div>
						<ul className="theme4_main_list">
							<li onClick={this.gotoLink.bind(this,'card')}><img src="image/theme004/card.png"/><p>微名片</p></li>
							{navNodes}
							<li><img src="image/theme004/laywers.png"/><p>律师介绍</p></li>
							<li><img src="image/theme004/case.png"/><p>典型案例</p></li>
							<li><img src="image/theme004/team.png"/><p>团队风采</p></li>
						</ul>
					</div>
					<Share  title={"刘晓燕律师微网站"} desc={"刘晓燕律师专注于公司业务，招投标业务，非银行金融机构、投资公司业务"} 
        imgUrl={global.img+"lxy20151215113726.png"} target="index004"/>
				</div>
			)
	}
})
module.exports = Index004;
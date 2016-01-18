var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

require('../../../../css/theme/theme012.less');
var Index012 = React.createClass({
	mixins:[CommonMixin],
  getInitialState: function(){
    return {
      navArrs:[],
      imgs:['image/theme012/self.png','image/theme012/yewu.png','image/theme012/learning.png','image/theme012/lytm.png','image/theme012/photo.png','image/theme012/lycp.png'],
      path:['articleList','articleList','articleList','articleList','photo','articleList']
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
     var navNodes = this.state.navArrs.map(function(item,i){
      return(
            <li key={new Date().getTime()+i} onClick={this.gotoLink.bind(this,this.state.path[i],item.ntId)}>
              <img src={this.state.imgs[i]}/>
              <div>{item.tn}</div>
            </li>
       );
    }.bind(this));
		return (
				<div>
					<div className="theme012_container">
            <img src="image/theme012/bg.png" width="100%"/>
            <div className="logo">
              <img src="image/theme012/logo.png"/>
            </div>
            <ul className="theme012_menu_list">
              <li>
                <a href="tel://13834238386" onClick={this.staticWebPV.bind(this,2)}>
                  <img src="image/theme012/telphone.png"/>
                  <div>电话咨询</div>
                </a>
              </li>
              <li onClick={this.gotoLink.bind(this,'card')}>
                <img src="image/theme012/card.png"/>
                <div>微名片</div>
              </li>
              {navNodes}
            </ul>
          </div>
					<Share title={"赵多政律师微网站"} desc={"赵多政律师专注于资本与证券市场类、收购兼并、改制重组、发行上市、投融资、企业税务筹划等法律服务。"} 
        imgUrl={global.img+"tzsxjlb20160111154037.jpg"} target="index012"/>
        <Message/>
				</div>
			)
	}
})
module.exports = Index012;

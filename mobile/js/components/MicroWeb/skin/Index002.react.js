var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');

require('../../../../css/theme/theme002.less');

var Index002 = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      navArrs:[],
      imgs:['image/theme002/team.png','image/theme002/laws.png','image/theme002/photo.png'],
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
    // var screenHeight = '';
    // var flag = this.isIOS();
    // if(flag){
    //   screenHeight = window.screen.height;
    // }else{
    //   screenHeight = document.body.clientHeight;
    // }
    this.getUserList();
    // var temp = $('.leftBg img').height();
    // console.log(temp);
    // $('.menu_list').height(temp);
    // $('.leftBg,.verticalMenu').height(screenHeight);
    
    $('body').css({'background':'#ebebeb'});
    
  },
  render: function() {
    var navNodes = this.state.navArrs.map(function(item,i){
      return(
            <li key={new Date().getTime()+i} onClick={this.gotoLink.bind(this,this.state.path[i],item.ntId)}>
              <img src={this.state.imgs[i]} width="45" height="45"/>
              <div>{item.tn}</div>
            </li>
       );
    }.bind(this));
    return (
      <div className="container">
        <div className="leftBg">
          <img src="image/theme002/bg1.png" width="100%"/>
        </div>
        <div className="verticalMenu">
          <ul className="menu_list">
            <li>
              <a href="tel://13718128160">
                <img src="image/theme002/telphone.png" width="45" height="45"/>
                <div>电话咨询</div>
              </a>
            </li>
            <li onClick={this.gotoLink.bind(this,'card')}>
              <img src="image/theme002/card.png" width="45" height="45"/>
              <div>微名片</div>
            </li>
            {navNodes}
          </ul>
        </div>
        <Share wxsharetype={"1"} title={"王杰律师微网站"} desc={"王杰律师专注于资本市场、基金、投融资、并购、公司法务、境外直接投资"} 
        imgUrl={"http://transfer.green-stone.cn/WXweb_wangjiepor.png"}/>
      </div>
    );
  },
});

module.exports = Index002;
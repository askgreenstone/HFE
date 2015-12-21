var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

require('../../../../css/theme/theme002.less');

//横屏检测
window.addEventListener('orientationchange', function(event){
    if ( window.orientation == 180 || window.orientation==0 ) {
        $('#myapp').css('display','block');
    }
    if( window.orientation == 90 || window.orientation == -90 ) {
        $('#myapp').css('display','none');
        setTimeout(function(){
          alert('横屏体验较差，请竖屏查看');
        },500);
    }
}); 

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
        this.showAlert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.staticWebPV(1);
    this.getUserList();
    $('.leftBg').height(document.body.scrollHeight);
    $('body').css({'background':'#ebebeb'});
  },
  render: function() {
    var navNodes = this.state.navArrs.map(function(item,i){
      return(
            <li key={new Date().getTime()+i} onClick={this.gotoLink.bind(this,this.state.path[i],item.ntId)}>
              <img src={this.state.imgs[i]} width="55" height="55"/>
              <div>{item.tn}</div>
            </li>
       );
    }.bind(this));
    return (
      <div className="container">
        <div className="leftBg">
          <div className="logo002">
            <img src="image/theme002/logo.png" width="110" height="115"/>
          </div>
          <img src="image/theme002/bg1.png" width="100%"/>
        </div>
        <div className="verticalMenu">
          <ul className="menu_list">
            <li>
              <a href="tel://13718128160" onClick={this.staticWebPV.bind(this,2)}>
                <img src="image/theme002/telphone.png" width="55" height="55"/>
                <div>电话咨询</div>
              </a>
            </li>
            <li onClick={this.gotoLink.bind(this,'card')}>
              <img src="image/theme002/card.png" width="55" height="55"/>
              <div>微名片</div>
            </li>
            {navNodes}
          </ul>
        </div>
        <Share title={"王杰律师微网站"} desc={"王杰律师专注于资本市场、基金、投融资、并购、公司法务、境外直接投资"} 
        imgUrl={global.img+"WXweb_wangjiepor.png"} target="index002"/>
        <Message/>
      </div>
    );
  },
});

module.exports = Index002;
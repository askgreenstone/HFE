var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');

require('../../../../css/theme/theme002.less');

var Index002 = React.createClass({
  mixins:[CommonMixin],
  gotoLink: function(path,ntid){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = 'e442';
    }
    
    if(ntid){
      location.href = '#'+path+'?ownUri='+ownUri+'&ntid='+ntid;
    }else{
      location.href = '#'+path+'?ownUri='+ownUri;
    }
    
  },
  componentDidMount: function(){
    var screenHeight = document.body.clientHeight;
    // var screenHeight = document.body.clientHeight;
    // alert('availHeight:'+screenHeight+',height1:'+window.screen.height);
    $('.leftBg,.verticalMenu').css('height',screenHeight);
    $('body').css({'background':'#ebebeb'});
  },
  render: function() {
    return (
      <div className="container">
        <div className="leftBg">
          <img src="image/theme002/bg1.png" width="100%" height="100%"/>
        </div>
        <div className="verticalMenu">
          <ul className="menu_list">
            <li>
              <a href="tel://13718128160">
                <img src="image/theme002/telphone.png" width="38" height="38"/>
                <div>电话咨询</div>
              </a>
            </li>
            <li onClick={this.gotoLink.bind(this,'articleDetail',4)}>
              <img src="image/theme002/team.png" width="45" height="30"/>
              <div>律师介绍</div>
            </li>
            <li onClick={this.gotoLink.bind(this,'card')}>
              <img src="image/theme002/card.png" width="45" height="30"/>
              <div>微名片</div>
            </li>
            <li onClick={this.gotoLink.bind(this,'articleList')}>
              <img src="image/theme002/laws.png" width="50" height="35"/>
              <div>典型案例</div>
            </li>
            <li onClick={this.gotoLink.bind(this,'photo')}>
              <img src="image/theme002/photo.png" width="38" height="38"/>
              <div>微相册</div>
            </li>
          </ul>
        </div>
        <Share wxsharetype={"1"} title={"王杰律师微网站"} desc={"王杰律师专注于资本市场、基金、投融资、并购、公司法务、境外直接投资"} 
        imgUrl={"http://transfer.green-stone.cn/WXweb_wangjiepor.png"}/>
      </div>
    );
  },
});

module.exports = Index002;
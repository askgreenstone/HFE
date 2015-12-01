var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');



require('../../../../css/theme/theme002.less');

var Index002 = React.createClass({
  mixins:[CommonMixin],
  gotoLink: function(path,ntid){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = 'e1107';
    }
    location.href = '#'+path+'?ownUri='+ownUri+'&ntid='+ntid;
  },
  componentDidMount: function(){
    var screenHeight = window.screen.availHeight;
    // alert('availHeight:'+screenHeight+',height:'+window.screen.height);
    $('.leftBg,.verticalMenu').css('height',screenHeight);
  },
  render: function() {
    return (
      <div className="container">
        <div className="leftBg"></div>
        <div className="verticalMenu">
          <ul className="menu_list">
            <li>
              <a href="tel://13718128160">
                <img src="image/theme002/telphone.png" width="38" height="38"/>
                <div>电话咨询</div>
              </a>
            </li>
            <li onClick={this.gotoLink.bind(this,'articleDetail','4')}>
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
      </div>
    );
  },
});

module.exports = Index002;
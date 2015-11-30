var React = require('react');
var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');

require('../../../../css/theme/theme002.less');

var Index002 = React.createClass({
  gotoLink: function(path,ntid){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = 'e1107';
    }
    location.href = '#'+path+'?ownUri='+ownUri+'&ntid='+ntid;
  },
  getUrlParams: function(p){
    var url = location.href; 
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
    var paraObj = {} ;
    for (var i=0,j=0; j=paraString[i]; i++){ 
      paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
    } 
    var returnValue = paraObj[p.toLowerCase()]; 
    if(typeof(returnValue)=="undefined"){ 
      return ""; 
    }else{ 
      return  returnValue;
    } 
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
              <div>团队风采</div>
            </li>
          </ul>
        </div>
      </div>
    );
  },
});

module.exports = Index002;
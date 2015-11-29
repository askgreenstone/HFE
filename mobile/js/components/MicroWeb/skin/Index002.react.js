var React = require('react');

require('../../../../css/theme/theme002.less');

var Index002 = React.createClass({
  gotoLink: function(path){
    location.href = '#'+path;
  },
  componentDidMount: function(){
    var screenHeight = window.screen.height;
    $('.leftBg,.verticalMenu').css('height',screenHeight);
  },
  render: function() {
    return (
      <div className="container">
        <div className="leftBg"></div>
        <div className="verticalMenu">
          <ul className="menu_list">
            <li>
              <img src="image/theme002/telphone.png" width="38" height="38"/>
              <div>电话咨询</div>
            </li>
            <li>
              <img src="image/theme002/team.png" width="45" height="30"/>
              <div>律师团队</div>
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
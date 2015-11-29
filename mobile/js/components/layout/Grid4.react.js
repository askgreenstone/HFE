var React = require('react');

var Grid4 = React.createClass({
  gotoLink: function(path){
    location.href = '#'+path;
  },
  render: function() {
  	return (
      <ul className="grid4">
      	<li>
      		<div>
      			<img src="image/theme001/lawyers.png" width="30" height="30"/>
      			<span>律师团队</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img onClick={this.gotoLink.bind(this,'articlelist')} src="image/theme001/article.png" width="30" height="30"/>
      			<span>律师文集</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/theme001/range.png" width="30" height="30"/>
      			<span>业务范围</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/theme001/location.png" width="30" height="30"/>
      			<span>位置</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/theme001/question.png" width="30" height="30"/>
      			<span>线上咨询</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/theme001/law.png" width="30" height="30"/>
      			<span>法律法规</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img onClick={this.gotoLink.bind(this,'photo')} src="image/theme001/grace.png" width="30" height="30"/>
      			<span>团队风采</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/theme001/card.png" width="30" height="30"/>
      			<span>微名片</span>
      		</div>
      	</li>
      	<div style={{'clear':'both'}}></div>
      </ul>
    );
  },
});

module.exports = Grid4;

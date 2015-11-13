var React = require('react');

var Grid4 = React.createClass({
  render: function() {
  	return (
      <ul className="grid4">
      	<li>
      		<div>
      			<img src="image/lawyers.png" width="30" height="30"/>
      			<span>律师团队</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/article.png" width="30" height="30"/>
      			<span>律师文集</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/range.png" width="30" height="30"/>
      			<span>业务范围</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/location.png" width="30" height="30"/>
      			<span>位置</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/question.png" width="30" height="30"/>
      			<span>线上咨询</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/law.png" width="30" height="30"/>
      			<span>法律法规</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/grace.png" width="30" height="30"/>
      			<span>团队风采</span>
      		</div>
      	</li>
      	<li>
      		<div>
      			<img src="image/card.png" width="30" height="30"/>
      			<span>微名片</span>
      		</div>
      	</li>
      	<div style={{'clear':'both'}}></div>
      </ul>
    );
  },
});

module.exports = Grid4;

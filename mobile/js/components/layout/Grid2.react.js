var React = require('react');

var Grid2 = React.createClass({
  render: function() {
  	return (
      <ul className="grid2">
      	<li>
      		<div>
	      		<img src="image/theme001/introduce.png" width="40" height="40"/>
	      		<span>律师简介</span>
	      	</div>
      	</li>
      	<li>
      		<div>
	      		<img src="image/theme001/phone.png" width="40" height="40"/>
	      		<span>电话咨询</span>
	      	</div>
      	</li>
      </ul>
    );
  },
});

module.exports = Grid2;


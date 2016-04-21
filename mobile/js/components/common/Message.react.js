var React = require('react');
//type{info,success,error}
var Message = React.createClass({
	hideShadow: function(){
  	$('.base_shadow').hide();
    window.location.reload();
	},
	componentWillMount:function(){
    $('.base_shadow').height(document.body.scrollHeight);
  }, 
  render: function() {
    return (
      <div className="base_shadow" onClick={this.hideShadow}>
      	<div className="base_alert">
      		<img src="image/warn.png" width="35" height="35"/>
      		<span></span>
      	</div>
      	<div className="base_tip">
      		<img src="image/right.png" width="35" height="35"/>
      		<span></span>
      	</div>
      </div>
    );
  }     
});

module.exports = Message;


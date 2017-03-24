var React = require('react');
//type{info,success,error}
var Message = React.createClass({
	hideShadow: function(){
  	$('.base_shadow').hide();
	},
  windowReload: function(){
    $('.base_shadow').hide();
    window.location.reload();
  },
	componentWillMount:function(){
    $('.base_shadow').height(document.body.scrollHeight);
  }, 
  render: function() {
    return (
      <div className="base_shadow">
      	<div className="base_alert">
      		<span></span>
          <i id="base_alert_confirm" onClick={this.hideShadow}>确定</i>
      	</div>
        <div className="base_reFresh">
          <span></span>
          <i onClick={this.windowReload}>确定</i>
        </div>
      	<div className="base_confirm">
      		<span></span>
          <div>
            <i id="base_confirm_cancle">取消</i>
            <i id="base_confirm_confirm">确定</i>
          </div>
      	</div>
      </div>
    );
  }     
});

module.exports = Message;


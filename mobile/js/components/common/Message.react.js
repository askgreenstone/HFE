var React = require('react');
//type{info,success,error}
var Message = React.createClass({
	getInitialState: function(){
    return {
      alertMess:'',
      tipMess:''
    };
  },
	showAlert: function(){
		console.log('alert:'+this.props.text);
		// $('.base_shadow').css({'display':'none'});
	},
	showTip: function(){
		console.log('tip:'+this.props.text);
		// $('.base_shadow').css({'display':'none'});
		setTimeout(function(){
			$('.base_shadow').css({'display':'none'});
		},1000);
	},
	switchFunction: function(){
		$('.base_shadow').css({'display':'block'});
		var tempType = this.props.type;
		if(tempType == 'success'||tempType == 'error'){
			$('.base_tip').hide();
			this.showAlert();
		}else if(tempType == 'info'){
			$('.base_alert').hide();
			this.showTip();
		}
	},
	componentWillMount:function(){
    $('.base_shadow').height(document.body.scrollHeight);
    this.setState({alertMess:this.props.text});
    this.setState({tipMess:this.props.text});
  }, 
  render: function() {
    return (
      <div className="base_shadow" onClick={this.switchFunction}>
      	<div className="base_alert">
      		<h3>警告框</h3>
      		<span>{this.state.alertMess}</span>
      	</div>
      	<div className="base_tip">
      		<span>{this.state.tipMess}</span>
      	</div>
      </div>
    );
  }     
});

module.exports = Message;


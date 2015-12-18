var React = require('react');
var CommonMixin = require('../../Mixin');
//待修改
var Single = React.createClass({
	getInitialState:function(){
		return {flag:false}
	},
  mixins:[CommonMixin],
  singleHidden:function(e){
  	alert(0)
  },
  render: function() {
    return (
     <div onClick={this.singleHidden} className='single_show'>
         
         <span className="single_describe">{this.props.describe}</span>
         <img src={this.props.src} width="100%" />
         
     </div>
    );
  },
});

module.exports = Single;
var React = require('react');
var Location = require('../../common/Location.react');
var CommonMixin = require('../../Mixin');

var Adress = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {ln:[]};
  },
  componentDidMount: function(){
  	var ln = this.getUrlParams('ln'),
  		region = this.getUrlParams('region');
  	console.log('ln:'+decodeURI(ln)+',rg:'+decodeURI(region));
    this.setState({
    	ln:decodeURI(ln),
    	rg:decodeURI(region)
    })
  },
  render: function() {

    return (
        <Location currentpath={this.state.ln} target={this.state.ln} region={this.state.rg}/>
    );
  },
});

module.exports = Adress;
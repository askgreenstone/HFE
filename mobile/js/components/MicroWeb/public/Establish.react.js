var React = require('react');
var CommonMixin = require('../../Mixin');

var Establish = React.createClass({
	mixins:[CommonMixin],
  render: function() {
    return (
    	<div className="theme6_copyright"><a href={global.url+"/coop/wbms/view/wxtemplate.html"}>我要创建</a></div>
    );
  }
});

module.exports = Establish;
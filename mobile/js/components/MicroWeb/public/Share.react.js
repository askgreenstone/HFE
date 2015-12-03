var React = require('react');
var Share = require('../../common/Share.react');
var CommonMixin = require('../../Mixin');

var WXShare = React.createClass({
	mixins:[CommonMixin],
	redirectUrl: function(){
		// var url = window.location.href;
		// var newUrl = this.fixWxUrl(url);
		// location.href = 'http://dist.green-stone.cn/mobile/#/adress?ownUri=e442&_k=wgpm7x';
	},
  componentDidMount: function(){
  	// this.redirectUrl();
  },
  render: function() {
    return (
    	<div>loading</div>
    );
  }
});

module.exports = WXShare;
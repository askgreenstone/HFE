// 只用于解析文档转成的html文件，需要嵌套iframe
var React = require('react');
var CommonMixin = require('../Mixin');

var Empty = React.createClass({
  mixins:[CommonMixin],
  getInitialState:function(){
    return {docSrc:''}
  },
  componentDidMount: function(){
   var name = this.getUrlParams('name');
   this.setState({
     docSrc : global.img + name +'.html'
   })
  },
  render: function() {
  	return (
      <iframe frameBorder="0" src={this.state.docSrc} width="100%" height="100%"/>
    );
  },
});

module.exports = Empty;


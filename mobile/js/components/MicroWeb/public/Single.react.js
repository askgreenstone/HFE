var React = require('react');
var CommonMixin = require('../../Mixin');

var Single = React.createClass({
  mixins:[CommonMixin],
  render: function() {
    var tempSrc = global.img + this.getUrlParams('src');
    return (
      <div className="single_show">
      	<span className="helper"></span><img src={tempSrc} width="100%" height="100%"/>
      </div>
    );
  },
});

module.exports = Single;
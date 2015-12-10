var React = require('react');
var CommonMixin = require('../../Mixin');

var Single = React.createClass({
  mixins:[CommonMixin],
  componentDidMount: function(){
    $('.spinner-bounce-circle').css({'display':'none'});
  },
  render: function() {
    var tempSrc = 'http://transfer.green-stone.cn/'+ this.getUrlParams('src');
    return (
      <div className="single_show">
      	<span className="helper"></span><img src={tempSrc} width="100%" height="100%"/>
      </div>
    );
  },
});

module.exports = Single;
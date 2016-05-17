var React = require('react');
var CommonMixin = require('../Mixin');

var Popnotice = React.createClass({
  mixins:[CommonMixin],
  render: function() {
    return(
        <div className="notice_box">
          <div className="notice_tip">
            <span></span>
            <div onClick={this.hideNotice}>OK</div>
          </div>
        </div>
      )
    
  }     
});

module.exports = Popnotice;


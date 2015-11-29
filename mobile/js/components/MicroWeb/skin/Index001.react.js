var React = require('react');
var Carousel = require('../../common/Carousel.react');
var Grid2 = require('../../layout/Grid2.react');
var Grid4 = require('../../layout/Grid4.react');
var List1 = require('../../layout/List1.react');

require('../../../../css/theme/theme001.less');

var Index001 = React.createClass({
  render: function() {
    var arr=['image/1.png','image/2.png','image/3.png','image/4.png','image/5.png'];
    return (
      <div>
        <Carousel item={arr} width="100%" height="180"/>
        <Grid2/>
        <Grid4/>
        <List1 legend="true"/>
      </div>
    );
  },
});

module.exports = Index001;
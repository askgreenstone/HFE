var React = require('react');
var Carousel = require('../../common/Carousel.react');
var Grid2 = require('../../layout/Grid2.react');
var Grid4 = require('../../layout/Grid4.react');
var ArticleList = require('./ArticleList.react');

var Home = React.createClass({
  render: function() {
    var arr=['image/1.png','image/2.png','image/3.png','image/4.png','image/5.png'];
    return (
      <div>
        <Carousel item={arr} width="100%" height="150"/>
        <Grid2/>
        <Grid4/>
        <ArticleList legend="true"/>
      </div>
    );
  },
});

module.exports = Home;
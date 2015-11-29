var React = require('react');
var Waterfall = require('../../common/Waterfall.react');

var Photo = React.createClass({
  render: function() {
    var arr=[
      {src:'image/11.jpg',des:'律师团队'},
      {src:'image/12.jpg',des:'个人工作室'},
      {src:'image/13.jpg',des:'个人风采'},
      {src:'image/14.jpg',des:'我是律师'},
      {src:'image/15.jpg',des:'大律师'},
      {src:'image/16.jpg',des:''},
      {src:'image/17.jpg',des:'律师'}
    ];
    return (
        <Waterfall item={arr} />
    );
  },
});

module.exports = Photo;
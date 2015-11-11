var React = require('react');
var Input = require('./Input.react');
var List = require('./List.react');
var ContentCss = require('../../../css/component/content.css');
var ReactRouter = require('react-router');
var Waterfall = require('../common/Waterfall.react');
var Link = ReactRouter.Link;

var Section = React.createClass({
  render: function() {
  	var arr=['image/waterfall/a.png','image/waterfall/b.png',
    'image/waterfall/c.png','image/waterfall/d.png','image/waterfall/e.png',
    'image/waterfall/f.png','image/waterfall/i.png','image/waterfall/j.png',
    'image/waterfall/k.png','image/waterfall/l.png','image/waterfall/m.png',
    'image/waterfall/n.png','image/waterfall/o.png'];
    return (
      <div id="content">
      <Waterfall item={arr} />
        <Input />
        <List />
        <Link to='/page'>去看看路由！</Link>
      </div>
    );
  },
});

module.exports = Section;
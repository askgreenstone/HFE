var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

require('../../../css/group/chengying.less');

var Home = React.createClass({
  render: function() {
    return (
      <div className="temp">
        <p>微网站入口</p>
        <div><Link to='/index'>程颖律师微网站</Link></div>
        <div><Link to='/photo'>微相册</Link></div>
        <div><Link to='/articlelist'>文章列表</Link></div>
        <div><Link to='/adress'>我的位置</Link></div>
      </div>
    );
  },
});

module.exports = Home;
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

var Home = React.createClass({
  render: function() {
    return (
      <div className="temp">
        <p>微网站入口</p>
        <div><Link to='/index001'>程颖律师微网站</Link></div>
        <div><Link to='/index002'>王杰律师微网站</Link></div>
      </div>
    );
  },
});

module.exports = Home;
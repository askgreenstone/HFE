var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

//后台调用接口兼容
if(window.location.href.indexOf('localhost')>-1||window.location.href.indexOf('t-dist')>-1){
	global.url = 'http://t-dist.green-stone.cn';
  global.img = 'http://t-transfer.green-stone.cn/';
  global.share = 'http://t-dist.green-stone.cn';
}else{
	global.url = '';
  global.img = 'http://transfer.green-stone.cn/';
  global.share = 'http://dist.green-stone.cn';
}



var Home = React.createClass({
  render: function() {
    return (
      <div className="temp">
        <p>微网站入口</p>
        <div><Link to='/index001'>程颖律师微网站</Link></div>
        <div><Link to='/index002'>王杰律师微网站</Link></div>
        <div><Link to='/index003'>王杰律师微网站二</Link></div>
        <div><Link to='/index004'>王杰律师微网站三</Link></div>
      </div>
    );
  },
});

module.exports = Home;
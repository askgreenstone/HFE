var React = require('react');
var	ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;

require('../css/base.less');

//微网站总入口
var Home = require('./components/MicroWeb/Home.react');
//极简版
var Index001 = require('./components/MicroWeb/skin/Index001.react');
//英伦版风格
var Index002 = require('./components/MicroWeb/skin/Index002.react');

//公共组件承载页面
var Photo = require('./components/MicroWeb/public/Photo.react');
var Single = require('./components/MicroWeb/public/Single.react');
var ArticleList = require('./components/MicroWeb/public/ArticleList.react');
var Adress = require('./components/MicroWeb/public/Adress.react');
var ArticleDetail = require('./components/MicroWeb/public/ArticleDetail.react');
var Card = require('./components/MicroWeb/public/Card.react');

//定义路由：https://github.com/rackt/react-router
ReactDOM.render((
  <Router>
    <Route path="/" component={Home}/>
    
    <Route path="/index001" component={Index001}/>
    <Route path="/index002" component={Index002}/>
    
    <Route path="/photo" component={Photo}/>
    <Route path="/single" component={Single}/>
    <Route path="/articleList" component={ArticleList}/>
    <Route path="/articleDetail" component={ArticleDetail}/>
    <Route path="/adress" component={Adress}/>
    <Route path="/card" component={Card}/>
  </Router>
), document.getElementById('myapp'))









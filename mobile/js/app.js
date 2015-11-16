var React = require('react');
var	ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;

require('../css/base.less');

var Home = require('./components/MicroWeb/Home.react');
//程颖微网站
var Index = require('./components/MicroWeb/chengying/Index.react');
var Photo = require('./components/MicroWeb/chengying/Photo.react');
var ArticleList = require('./components/MicroWeb/chengying/ArticleList.react');
var Adress = require('./components/MicroWeb/chengying/Adress.react');

//定义路由：https://github.com/rackt/react-router
ReactDOM.render((
  <Router>
    <Route path="/" component={Home}/>
    <Route path="/index" component={Index}/>
    <Route path="/photo" component={Photo}/>
    <Route path="/articlelist" component={ArticleList}/>
    <Route path="/adress" component={Adress}/>
  </Router>
), document.getElementById('myapp'))









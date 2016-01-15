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
//皮肤三
var Index003 = require('./components/MicroWeb/skin/Index003.react');
//皮肤四
var Index004 = require('./components/MicroWeb/skin/Index004.react');
//皮肤五
var Index005 = require('./components/MicroWeb/skin/Index005.react');
//皮肤六
var Index006 = require('./components/MicroWeb/skin/Index006.react');

//皮肤七（同皮肤三）
var Index007 = require('./components/MicroWeb/skin/Index007.react');

//皮肤八（同皮肤二，背景图为GIF格式）
var Index008 = require('./components/MicroWeb/skin/Index008.react');

//皮肤九（测试）
var Index009 = require('./components/MicroWeb/skin/Index009.react');

//皮肤十（同皮肤六，大成金融）
var Index010 = require('./components/MicroWeb/skin/Index010.react');

//皮肤十一（同皮肤六，青山律师）
var Index011 = require('./components/MicroWeb/skin/Index011.react');

//皮肤十二
var Index012 = require('./components/MicroWeb/skin/Index012.react');

//公共组件承载页面
var Photo = require('./components/MicroWeb/public/Photo.react');
var Single = require('./components/MicroWeb/public/Single.react');
var ArticleList = require('./components/MicroWeb/public/ArticleList.react');
var Adress = require('./components/MicroWeb/public/Adress.react');
var ArticleDetail = require('./components/MicroWeb/public/ArticleDetail.react');
var Card = require('./components/MicroWeb/public/Card.react');
var Card2 = require('./components/MicroWeb/public/Card2.react');
var Share = require('./components/MicroWeb/public/Share.react');

//定义路由：https://github.com/rackt/react-router
ReactDOM.render((
  <Router>
    <Route path="/" component={Home}/>
    
    <Route path="/index001" component={Index001}/>
    <Route path="/index002" component={Index002}/>
    <Route path="/index003" component={Index003}/>
    <Route path="/index004" component={Index004}/>
    <Route path="/index005" component={Index005}/>
    <Route path="/index006" component={Index006}/>
    <Route path="/index007" component={Index007}/>
    <Route path="/index008" component={Index008}/>
    <Route path="/index009" component={Index009}/>
    <Route path="/index010" component={Index010}/>
    <Route path="/index011" component={Index011}/>
    <Route path="/index012" component={Index012}/>



    
    <Route path="/photo" component={Photo}/>
    <Route path="/single" component={Single}/>
    <Route path="/articleList" component={ArticleList}/>
    <Route path="/articleDetail" component={ArticleDetail}/>
    <Route path="/adress" component={Adress}/>
    <Route path="/card" component={Card}/>
    <Route path="/card2" component={Card2}/>
    <Route path="/share" component={Share}/>
  </Router>
), document.getElementById('myapp'))









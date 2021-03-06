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

//皮肤七
var Index007 = require('./components/MicroWeb/skin/Index007.react');

//皮肤八
var Index008 = require('./components/MicroWeb/skin/Index008.react');

//皮肤九
var Index009 = require('./components/MicroWeb/skin/Index009.react');

//皮肤十（大成金融）
var Index010 = require('./components/MicroWeb/skin/Index010.react');

//皮肤十一
var Index011 = require('./components/MicroWeb/skin/Index011.react');

//皮肤十二
var Index012 = require('./components/MicroWeb/skin/Index012.react');

//皮肤十三
var Index013 = require('./components/MicroWeb/skin/Index013.react');

//皮肤十四
var Index014 = require('./components/MicroWeb/skin/Index014.react');

//皮肤十五
var Index015 = require('./components/MicroWeb/skin/Index015.react');

//皮肤十六（同皮肤十三，菜单外方内圆）
var Index016 = require('./components/MicroWeb/skin/Index016.react');

//皮肤十七（圆心旋转）
var Index017 = require('./components/MicroWeb/skin/Index017.react');
//皮肤十八（滚动变大）
var Index018 = require('./components/MicroWeb/skin/Index018.react');
//皮肤十九（简版一）
var Index019 = require('./components/MicroWeb/skin/Index019.react');
//皮肤二十（d9x设计出品 左图右文竖向菜单）
var Index020 = require('./components/MicroWeb/skin/Index020.react');
//皮肤二十一（d9x设计出品 上图下文底部菜单横向滚动）
var Index021 = require('./components/MicroWeb/skin/Index021.react');
//皮肤二十二（d9x设计出品 上图下文底部菜单竖向罗列）
var Index022 = require('./components/MicroWeb/skin/Index022.react');
//皮肤二十三（d9x设计出品 上图下文左下角菜单竖向罗列）
var Index023 = require('./components/MicroWeb/skin/Index023.react');
//皮肤二十四（d9x设计出品 山水画风格）
var Index024 = require('./components/MicroWeb/skin/Index024.react');
//皮肤二十五（大成本部）
var Index025 = require('./components/MicroWeb/skin/Index025.react');


//公共组件承载页面
var Photo = require('./components/MicroWeb/public/Photo.react');
var Single = require('./components/MicroWeb/public/Single.react');
var ArticleList = require('./components/MicroWeb/public/ArticleList.react');
var Adress = require('./components/MicroWeb/public/Adress.react');
var Address2 = require('./components/MicroWeb/public/Address2.react');
var ArticleDetail = require('./components/MicroWeb/public/ArticleDetail.react');
var Card = require('./components/MicroWeb/public/Card.react');
var Card2 = require('./components/MicroWeb/public/Card2.react');
// 时间轴
var TimeAxis = require('./components/MicroWeb/public/TimeAxis.react');
// 时间轴具体动态页
var Dynamic = require('./components/MicroWeb/public/Dynamic.react');
// 举报列表
var ReportList = require('./components/MicroWeb/public/ReportList.react');
// 举报详情
var ReportDetail = require('./components/MicroWeb/public/ReportDetail.react');
//特殊需求，添加了英文版本微名片
// 李玉龙英文微名片
var Card3 = require('./components/MicroWeb/public/Card3.react');
//特殊需求，添加了英文版本微名片
// 于洪彬英文微名片
var Card4 = require('./components/MicroWeb/public/Card4.react');
var Share = require('./components/MicroWeb/public/Share.react');
// 留言板
var Board = require('./components/MicroWeb/public/Board.react');
// 空页面，嵌套iframe
var Empty = require('./components/layout/Empty.react');
// 找律师界面
var Lawyers = require('./components/MicroWeb/public/Lawyers.react');
// 找律师搜索界面
var SearchLawyers = require('./components/MicroWeb/public/SearchLawyers.react');
// 直播列表页面
var LiveList = require('./components/MicroWeb/public/LiveList.react');
// 直播详情
var LiveDetail = require('./components/MicroWeb/public/LiveDetail.react');
// 公众号直播列表
var LiveListShow = require('./components/MicroWeb/public/LiveListShow.react');
// 公众号直播详情
var LiveDetailShow = require('./components/MicroWeb/public/LiveDetailShow.react');
// 开通会员
var MemberLogin = require('./components/MicroWeb/public/MemberLogin.react');

// 打开百度文档
var BaiduDocView = require('./components/MicroWeb/public/BaiduDocView.react');


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
    <Route path="/index013" component={Index013}/>
    <Route path="/index014" component={Index014}/>
    <Route path="/index015" component={Index015}/>
    <Route path="/index016" component={Index016}/>
    <Route path="/index017" component={Index017}/>
    <Route path="/index018" component={Index018}/>
    <Route path="/index019" component={Index019}/>
    <Route path="/index020" component={Index020}/>
    <Route path="/index021" component={Index021}/>
    <Route path="/index022" component={Index022}/>
    <Route path="/index023" component={Index023}/>
    <Route path="/index024" component={Index024}/>
    <Route path="/index025" component={Index025}/>

    
    <Route path="/photo" component={Photo}/>
    <Route path="/single" component={Single}/>
    <Route path="/articleList" component={ArticleList}/>
    <Route path="/articleDetail" component={ArticleDetail}/>
    <Route path="/adress" component={Adress}/>
    <Route path="/address2" component={Address2}/>
    <Route path="/card" component={Card}/>
    <Route path="/card2" component={Card2}/>
    <Route path="/card3" component={Card3}/>
    <Route path="/card4" component={Card4}/>
    <Route path="/TimeAxis" component={TimeAxis}/>
    <Route path="/Dynamic" component={Dynamic}/>
    <Route path="/ReportList" component={ReportList}/>
    <Route path="/ReportDetail" component={ReportDetail}/>
    <Route path="/Lawyers" component={Lawyers}/>
    <Route path="/SearchLawyers" component={SearchLawyers}/>
    <Route path="/LiveList" component={LiveList}/>
    <Route path="/LiveDetail" component={LiveDetail}/>
    <Route path="/LiveListShow" component={LiveListShow}/>
    <Route path="/LiveDetailShow" component={LiveDetailShow}/>
    <Route path="/MemberLogin" component={MemberLogin}/>
    <Route path="/BaiduDocView" component={BaiduDocView}/>
    <Route path="/share" component={Share}/>
    <Route path="/board" component={Board}/>
    <Route path="/empty" component={Empty}/>
  </Router>
), document.getElementById('myapp'))









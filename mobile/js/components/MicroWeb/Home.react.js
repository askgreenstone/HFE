var React = require('react');
var ReactRouter = require('react-router');
var Waterfall = require('../common/Waterfall.react');
var Link = ReactRouter.Link;
var CommonMixin = require('../Mixin');

//后台调用接口兼容
if(window.location.href.indexOf('localhost')>-1||window.location.href.indexOf('t-dist')>-1){
	global.url = 'http://t-dist.green-stone.cn';
  global.img = 'http://t-transfer.green-stone.cn/';
  global.share = 'http://t-dist.green-stone.cn';
  global.mshare = 'http://t-mshare.green-stone.cn/';
  //临时添加
  // global.url = 'http://dist.green-stone.cn';
}else{
	global.url = '';
  global.img = 'http://transfer.green-stone.cn/';
  global.share = 'http://dist.green-stone.cn';
  global.mshare = 'http://mshare.green-stone.cn/';
}


//横屏检测
window.addEventListener('orientationchange', function(event){
    if ( window.orientation == 180 || window.orientation==0 ) {
        $('#myapp').css('display','block');
    }
    if( window.orientation == 90 || window.orientation == -90 ) {
        $('#myapp').css('display','none');
        setTimeout(function(){
          alert('横屏体验较差，请竖屏查看');
        },500);
    }
}); 


var Home = React.createClass({
  render: function() {
    return (
      <div className='temp'>
        <div><Link to='/index001'><img src='image/index001.png'/><span>程颖001e1</span></Link></div>
        <div><Link to='/index002'><img src='http://t-transfer.green-stone.cn/index002_samplepicture_20160127193313.png'/><span>index002</span></Link></div>
        <div><Link to='/index003'><img src='http://t-transfer.green-stone.cn/index003_samplepicture_20160127180001.png'/><span>index003</span></Link></div>
        <div><Link to='/index004'><img src='http://t-transfer.green-stone.cn/index004_samplepicture_20160127180311.png'/><span>index004</span></Link></div>
        <div><Link to='/index005'><img src='http://t-transfer.green-stone.cn/index005_samplepicture_20160127193411.png'/><span>index005</span></Link></div>
        <div><Link to='/index006'><img src='image/index006.png'/><span>index006</span></Link></div>
        <div><Link to='/index007'><img src='image/index007.png'/><span>index007</span></Link></div>
        <div><Link to='/index008'><img src='image/index008.png'/><span>index008</span></Link></div>
        <div><Link to='/index009'><img src='image/index009.png'/><span>index009</span></Link></div>
        <div><Link to='/index010'><img src='image/index006.png'/><span>010</span></Link></div>
        <div><Link to='/index011'><img src='image/index006.png'/><span>011</span></Link></div>
        <div><Link to='/index012'><img src='image/index012.png'/><span>006e2103</span></Link></div>
        <div><Link to='/index013'><img src='image/index013.png'/><span>index013</span></Link></div>
        <div><Link to='/index014'><img src='image/index006.png'/><span>青山律师014</span></Link></div>
        <div><Link to='/index015'><img src='image/index015.png'/><span>015e2147</span></Link></div>
        <div><Link to='/index016'><img src='image/index013.png'/><span>index016</span></Link></div>
        <div><Link to='/index017'><img src='image/index017.png'/><span>index017</span></Link></div>
        <div><Link to='/index018'><img src='image/index018.png'/><span>index018</span></Link></div>
        <div><Link to='/index019'><img src='image/index019.png'/><span>index019</span></Link></div>
        <div><Link to='/index020'><img src='image/index020.png'/><span>index020</span></Link></div>
        <div><Link to='/index021'><img src='image/index021.png'/><span>index021</span></Link></div>
        <div><Link to='/index022'><img src='image/index022.png'/><span>index022</span></Link></div>
      </div>
      );
  },
});

module.exports = Home;
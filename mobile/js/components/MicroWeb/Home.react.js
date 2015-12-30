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
}else{
	global.url = '';
  global.img = 'http://transfer.green-stone.cn/';
  global.share = 'http://dist.green-stone.cn';
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
    if(window.location.href.indexOf('localhost')>-1||window.location.href.indexOf('t-dist')>-1){
    return (
      <div className='temp'>
        <div><Link to='/index001'><img src='image/index001.png'/><span>程颖001e1</span></Link></div>
        <div><Link to='/index002'><img src='image/index002.png'/><span>王杰002e442</span></Link></div>
        <div><Link to='/index003'><img src='image/index003.png'/><span>王忠德003e611</span></Link></div>
        <div><Link to='/index004'><img src='image/index004.png'/><span>刘晓燕004e394</span></Link></div>
        <div><Link to='/index005'><img src='image/index005.png'/><span>index005</span></Link></div>
        <div><Link to='/index006'><img src='image/index006.png'/><span>index006</span></Link></div>
        <div><Link to='/index007'><img src='image/index003.png'/><span>肖飒007</span></Link></div>
      </div>
      );
    } else{
      return (
        <div className='temp'>
          <div><Link to='/index001?ownUri=e1'><img src='image/index001.png'/><span>程颖001e1</span></Link></div>
          <div><Link to='/index002?ownUri=e442'><img src='image/index002.png'/><span>王杰002e442</span></Link></div>
          <div><Link to='/index003?ownUri=e611'><img src='image/index003.png'/><span>王忠德003e611</span></Link></div>
          <div><Link to='/index004?ownUri=e394'><img src='image/index004.png'/><span>刘晓燕004e394</span></Link></div>
          <div><Link to='/index005'><img src='image/index005.png'/><span>index005</span></Link></div>
          <div><Link to='/index006'><img src='image/index006.png'/><span>index006</span></Link></div>
          <div><Link to='/index007'><img src='image/index003.png'/><span>肖飒007</span></Link></div>
        </div>
        );
    } 
    
  },
});

module.exports = Home;
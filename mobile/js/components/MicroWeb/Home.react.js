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
  //临时添加
  // global.url = 'http://dist.green-stone.cn';
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
        <div><Link to='/index007'><img src='image/index007.png'/><span>index007</span></Link></div>
        <div><Link to='/index008'><img src='image/index008.png'/><span>index008</span></Link></div>
        <div><Link to='/index009'><img src='image/index009.png'/><span>index009</span></Link></div>
        <div><Link to='/index010'><img src='image/index006.png'/><span>大成金融010</span></Link></div>
        <div><Link to='/index011'><img src='image/index006.png'/><span>青山律师011</span></Link></div>
        <div><Link to='/index012'><img src='image/index012.png'/><span>山西投资006e2103</span></Link></div>
        <div><Link to='/index013'><img src='image/index013.png'/><span>index013</span></Link></div>
        <div><Link to='/index014'><img src='image/index006.png'/><span>青山律师014</span></Link></div>
        <div><Link to='/index015'><img src='image/index015.png'/><span>西安分所015e2147</span></Link></div>
        <div><Link to='/index016'><img src='image/index013.png'/><span>index016</span></Link></div>
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
          <div><Link to='/index007?ownUri=e2102'><img src='image/index007.png'/><span>index007</span></Link></div>
          <div><Link to='/index008'><img src='image/index008.png'/><span>index008</span></Link></div>
          <div><Link to='/index009?ownUri=e399'><img src='image/index009.png'/><span>index009</span></Link></div>
          <div><Link to='/index010?ownUri=e487'><img src='image/index006.png'/><span>大成金融010</span></Link></div>
          <div><Link to='/index011'><img src='image/index006.png'/><span>青山律师011</span></Link></div>
          <div><Link to='/index012?ownUri=e2103'><img src='image/index012.png'/><span>山西投资006e2103</span></Link></div>
          <div><Link to='/index013'><img src='image/index013.png'/><span>index013</span></Link></div>
          <div><Link to='/index014?ownUri=e2109'><img src='image/index006.png'/><span>青山律师014e2109</span></Link></div>
          <div><Link to='/index015?ownUri=e2147'><img src='image/index015.png'/><span>西安分所015e2147</span></Link></div>
          <div><Link to='/index016'><img src='image/index013.png'/><span>index016</span></Link></div>
        </div>
        );
    } 
    
  },
});

module.exports = Home;
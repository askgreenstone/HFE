var React = require('react');
var CommonMixin = require('../../Mixin');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');
Date.prototype.Format = function(fmt){ //author: meizz
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  console.log(today.getTime());
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };  
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  
var TimeAxis = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {datas:[],Abstract:'',Title:'',Introduction:'',Img:'',TimeAxis:[],getMore:false,headImg:''};
  },
  gotoLink: function(path,fid,session,usrUri){
    if(!fid){
      return;
    }else{
      location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri')+'&fid='+fid+'&session='+session+'&usrUri='+usrUri+'&refresh=1';
    }
  },
  getServerInfo: function(){
    var session = this.getUrlParams('session');
    var ownUri = this.getUrlParams('ownUri');
    var ei = ownUri.replace('e','');
    $.ajax({
      type:'get',
      url: global.url+'/exp/ExpertInfo.do?session='+ session+'&ei='+ei,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
           this.setState({
            headImg: data.p,
            lawyerName: data.n
          });
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getMoreData: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var fid = window.localStorage.getItem('TimeAxis');
    this.getTimeAxis(fid);
  },
  getTimeAxis: function(fid){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    $.ajax({
      type:'get',
      url: global.url+'/usr/FeedTimeline.do?ownUri='+ownUri+'&c=10&fid='+fid,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          // console.log(data.sil[0].spu)
          if(data.r.fl.length<10){
            this.setState({
              TimeAxis: this.state.TimeAxis.concat(data.r.fl),
              getMore: false 
            })
            window.localStorage.removeItem('TimeAxis');
          }else{
            this.setState({
              TimeAxis: this.state.TimeAxis.concat(data.r.fl),
              getMore: true 
            })
            window.localStorage.setItem('TimeAxis',data.r.fl[data.r.fl.length-1].fid);
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  transferTime: function(count){
    var date = new Date().getTime();
    var number = date - count;
    console.log(number);
  },
  goHome: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    console.log(global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri);
    window.location.href = global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri;
  },
  getIndexTheme: function(){
    var ownUri = this.getUrlParams('ownUri');
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/QueryMicWebInfo.do?ownUri='+ownUri,
      success: function(data) {
          console.log(data);
          if(data.c == 1000){
            this.setState({
              indexTheme: data.url
            })
          }
      }.bind(this),
      error: function(data) {
          // console.log(data);
          alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    console.log($('.timeline_container'));
    console.log(this.state.Abstract);
  },
  componentWillMount:function(){
    this.getIndexTheme();
    this.getTimeAxis(0);
    this.getServerInfo();
  }, 
  render: function() {
    var ShareTitile = this.state.lawyerName+'律师与您分享了TA的足迹';
    var ShareDesc = '邀请您一起来看看'+this.state.lawyerName+'律师最近都在忙些什么';
    var ShareImg = this.state.headImg;
    var session = this.getUrlParams('session');
    var usrUri = this.getUrlParams('usrUri');
    var ownUri = this.getUrlParams('ownUri');
    var str = window.location.href;
    var temp,appid,ShareUrl;
    // 时间轴，动态详情页面分享需要授权
    if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
        temp = 't-web';
        appid = 'wx2858997bbc723661';
      }else{
        temp = 'web';
        appid = 'wx73c8b5057bb41735';
      }
    ShareUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri=http%3a%2f%2f'+temp+'.green-stone.cn%2fusr%2fWeiXinWebOAuthDispatch.do&response_type=code&scope=snsapi_userinfo&state=expNews_'+ownUri+'#wechat_redirect';
    var navNodes = this.state.TimeAxis.map(function(item,i){
      return(
        <li key={new Date().getTime()+i} className="timeline" onClick={this.gotoLink.bind(this,'Dynamic',item.fid,session,usrUri)}>
          <div className={i==0?'timeline_time timeline_time_first':'timeline_time'}>
            <p>{new Date(item.ts).Format("MM-dd hh:mm")}</p>
            <img src={i==0?'image/LatestNews/bor.png':'image/LatestNews/ellipse.png'}/>
          </div>
          <div className="timeline_content">
            <div className="timeline_img">
              <img src={item.il[0]?(global.img+item.il[0]):global.img+item.p}/>
            </div>
            <div className="timeline_con">
              <h2>{item.title?(item.title.length>6?item.title.substr(0,6)+'...':item.title):''}</h2>
              <p>{item.content?(item.content.length>30?item.content.substr(0,30)+'...':item.content):''}</p>
            </div>
          </div>
        </li>
       );
    }.bind(this));
  console.log(navNodes);  
  return (
    <div className="htmleaf_container">
      <ul className="timeline_container">
        {navNodes}
      </ul>
      <div className="timeline_more" style={{display:this.state.getMore?'block':'none'}}><span onClick={this.getMoreData}>加载更多</span></div>
      <Share title={ShareTitile} desc={ShareDesc} imgUrl={global.img+ShareImg} target="TimeAxis" targetUrl={ShareUrl}/>
    </div>
  )
  }
});

module.exports = TimeAxis;
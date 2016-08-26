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
    return {datas:[],Abstract:'',Title:'',Introduction:'',Img:'',TimeAxis:[],getMore:false};
  },
  gotoLink: function(path,fid,session,usrUri){
    if(!fid){
      return;
    }else{
      location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri')+'&fid='+fid+'&session='+session+'&usrUri='+usrUri;
    }
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
  getShareInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    $.ajax({
      type:'get',
      url: global.url+'/usr/GetMicWebShareInfo.do?ou='+ownUri+'&st=1',
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          // console.log(data.sil[0].spu)
          if(data.sil.length>0){
            this.setState({
              Title:data.sil[0].sti,
              Introduction:data.sil[0].sd,
              Img:data.sil[0].spu
            });
          }else{
            this.setState({
              Title:'我的工作室',
              Introduction:'欢迎访问我的工作室！这里有我的职业介绍和成就',
              Img:'greenStoneicon300.png'
            });
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
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
    this.getShareInfo();
    this.getIndexTheme();
    this.getTimeAxis(0);
  }, 
  render: function() {
    var ShareTitile = this.state.Title;
    var ShareDesc = this.state.Introduction;
    var ShareImg = this.state.Img;
    var session = this.getUrlParams('session');
    var usrUri = this.getUrlParams('usrUri');
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
    </div>
  )
  }
});

module.exports = TimeAxis;
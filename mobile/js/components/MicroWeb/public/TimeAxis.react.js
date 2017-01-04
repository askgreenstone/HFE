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
    return {
      datas:[],
      Abstract:'',
      Title:'',
      Introduction:'',
      Img:'',
      TimeAxis:[],
      getMore:false,
      headImg:''
    };
  },
  gotoLink: function(path,fid,session,usrUri){
    var ida = this.getUrlParams('ida');
    var idf = this.getUrlParams('idf')?this.getUrlParams('idf'):0;
    var ownUri = this.getUrlParams('ownUri');
    var isFrom = this.getUrlParams('isFrom');
    if(!fid){
      return;
    }else{
      console.log(global.url);
      if(isFrom == 'app'){
        location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri')+'&fid='+fid+'&ida='+ida+'&idf='+idf+'&isFrom=app';
      }else{
        location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri')+'&fid='+fid+'&ida='+ida+'&idf='+idf;
      }
    }
  },
  getServerInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    var ei = ownUri.replace('e','');
    var idf = this.getUrlParams('idf');
    $.ajax({
      type:'get',
      url: global.url+'/exp/ExpertInfo.do?ei='+ei,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          if(idf == 0){
            this.setState({
              ShareTitile : data.n+'律师与您分享了TA的足迹',
              ShareDesc : '邀请您一起来看看'+data.n+'律师最近都在忙些什么',
              ShareImg : data.p?data.p:'batchdeptlogo20160811_W108_H108_S15.png'
            })
          }else{
            this.setState({
              ShareTitile : data.cn+'律师与您分享了TA的足迹',
              ShareDesc : '邀请您一起来看看'+data.cn+'律师最近都在忙些什么',
              ShareImg : data.cl?data.cl:'batchdeptlogo20160811_W108_H108_S15.png'
            })
          }
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
    var fid = window.localStorage.getItem('TimeAxisfid');
    this.getTimeAxis(fid);
  },
  getTimeAxis: function(fid){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var idf = this.getUrlParams('idf')?this.getUrlParams('idf'):0;
    var isFrom = this.getUrlParams('isFrom');
    var url;
    // p字段区分公开私密动态
    if(isFrom == 'app'){
      url = global.url+'/usr/FeedTimeline.do?ownUri='+ownUri+'&c=10&fid='+fid+'&idf='+idf+'&p=1';
    }else{
      url = global.url+'/usr/FeedTimeline.do?ownUri='+ownUri+'&c=10&fid='+fid+'&idf='+idf+'&p=0';
    }
    $.ajax({
      type:'get',
      url: url,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          // console.log(data.sil[0].spu)
          console.log(data.r.fl);
          if(data.r.fl.length<10){
            if(fid == 0){
              this.setState({
                TimeAxis: data.r.fl,
                getMore: false 
              })
            }else{
              this.setState({
                TimeAxis: this.state.TimeAxis.concat(data.r.fl),
                getMore: false 
              })
            }
            window.localStorage.removeItem('TimeAxisfid');
          }else{
            if(fid == 0){
              this.setState({
                TimeAxis: data.r.fl,
                getMore: true 
              })
            }else{
              this.setState({
                TimeAxis: this.state.TimeAxis.concat(data.r.fl),
                getMore: true 
              })
            }
            window.localStorage.setItem('TimeAxisfid',data.r.fl[data.r.fl.length-1].fid);
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
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
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
  // 删除某一条数据
  deleteDynamic: function(fid){
    var session = this.getUrlParams('session');
    var ownUri = this.getUrlParams('ownUri');
    var usrUri = this.getUrlParams('usrUri');
    var ida = this.getUrlParams('ida');
    var idf = this.getUrlParams('idf');
    var flag = window.confirm('确定要删除么？');
    if(flag){
      $.ajax({
        type: 'POST',
        url: global.url+'/usr/DeleteFeed.do?session='+session,
        data: JSON.stringify({
          fid: fid
        }),
        success: function(data) {
            console.log(data);
            if(data.c == 1000){
              this.getTimeAxis(0);
              // window.location.reload();
              // window.location.href = '#TimeAxis?ownUri='+ownUri+'&session='+session+'&usrUri='+usrUri+'&ida'+ida+'&idf='+idf;
            }
        }.bind(this),
        error: function(data) {
            // console.log(data);
            alert('系统开了小差，请刷新页面');
        }.bind(this)
      })
    }
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    console.log($('.timeline_container'));
    console.log(this.state.Abstract);
    var $body = $('body')
    document.title = '律师动态';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
  },
  componentWillMount:function(){
    this.getServerInfo();
    this.getIndexTheme();
    this.getTimeAxis(0);
    var usrUri = this.getUrlParams('usrUri');
    var ownUri = this.getUrlParams('ownUri');
    this.setState({
      isSelf: ownUri == usrUri?true:false
    })
  }, 
  render: function() {
    var ida = this.getUrlParams('ida');
    var session = this.getUrlParams('session');
    var usrUri = this.getUrlParams('usrUri');
    var ownUri = this.getUrlParams('ownUri');
    var idf = this.getUrlParams('idf');
    var str = window.location.href;
    var temp,appid,ShareUrl;
    console.log(this.state.TimeAxis);
    // 控制台打印分享信息
    console.log(this.state.ShareTitile);
    console.log(this.state.ShareDesc);
    console.log(this.state.ShareImg);
    ShareUrl = window.location.href;
    var nowDate = (new Date().getMonth()*1+1)+'-'+new Date().getDate();
    console.log(nowDate);
    var navNodes = this.state.TimeAxis.map(function(item,i){
      return(
        <li key={new Date().getTime()+i} className={i==0?"timeline timeline_first":(i%2 == 0?"timeline":"timeline_double")}>
          <div className="timeline_str"></div>
          <p className={(new Date(item.ts).Format("MM-dd")==nowDate)?'timeline_box_day':'timeline_box_day timeline_box_date'}>{(new Date(item.ts).Format("MM-dd")== nowDate) ? '今天' : new Date(item.ts).Format("MM-dd")}</p>
          <p className="timeline_box_hour">{new Date(item.ts).Format("hh:mm")}</p>
          <div className="timeline_box_img_box">
            <img className="timeline_box_img" src={item.il[0]?(global.img+item.il[0]):(item.cil[0].il[0]?(global.img+item.cil[0].il[0]):(global.img+item.p))} width="56" height="56"  onClick={this.gotoLink.bind(this,'Dynamic',item.fid,session,usrUri,ida,idf)}/>
            <img className="timeline_box_close" onClick={this.deleteDynamic.bind(this,item.fid)} style={{display:this.state.isSelf?'block':'none'}} src="image/delete.png" />
          </div>
          <div className="timeline_box_link" onClick={this.gotoLink.bind(this,'Dynamic',item.fid,session,usrUri,ida,idf)}>
            <p className="timeline_box_title">{item.title?(item.title.length>10?item.title.substr(0,10)+'...':item.title):''}</p>
            <div className="timeline_action">
              <span className="timeline_action_read">{item.readnum?item.readnum:'0'}</span>
              <span className="timeline_action_nice">{item.rnum?item.rnum:'0'}</span>
              <span className="timeline_action_tip">{item.cnum?item.cnum:'0'}</span>
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
      <Share title={this.state.ShareTitile} desc={this.state.ShareDesc} imgUrl={global.img+this.state.ShareImg} target="TimeAxis" />
    </div>
  )
  }
});

module.exports = TimeAxis;
var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');
var Shadow = require('../../common/Shadow.react');
var Password = require('../../common/Password.react');
var Toolbar = require('../../common/Toolbar.react');
var Establish = require('../public/Establish.react');
var Shade = require('../../common/Shade.react');
var LatestNews = require('../public/LatestNews.react');

require('../../../../css/theme/theme004.less');

// $(window).on(function(){
//   // alert($('body').scrollTop());
//   if($('body').scrollTop() > 0){
//     $('.theme4_main_list').animate({'bottom':'40px'});
//     $('#copybar').show();
//     $('#copybar').animate({'bottom':'0px'});
//   }else{
//     $('.theme4_main_list').animate({'bottom':'0px'});
//     // $('#copybar').hide();
//     $('#copybar').animate({'bottom':'-50px'});
//   }
// });

var Index004=React.createClass({
	mixins:[CommonMixin],
  getInitialState: function(){
    return {
      activeState:false,
      navArrs:[],
      bg:'',
      logo:'',
      shareTitle:'',
      shareDesc:'',
      shareImg:'',
      documentDepartTitle: '',
      documentExpTitle: ''
    };
  },
  getLatestNews:function(){
    var that = this;
    // if(that.props.title) return;
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    var idf = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/FeedTimeline.do?ownUri='+ownUri+'&c=1&idf='+idf+'&p=0',
      success:function(data){
        console.log(data);
        if(data.c == 1000){
          this.setState({
            newsTitle: data.r.fl.length>0?data.r.fl[0].title:'',
            newsContent: data.r.fl.length>0?data.r.fl[0].content:'',
            newsShow: false
          });
        }
      }.bind(this),
      error:function(){
        alert('网络连接错误或服务器异常！')
      }.bind(this)
    })
    
  },
  getUserList: function(flag){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    console.log(flag);
    //flag=true，需要重新请求数据，否则直接读取缓存
    if(flag){
      $.ajax({
        type:'get',
        url: global.url+'/exp/QueryNewsTypes.do?&ownUri='+ownUri+'&ida='+ida,
        success: function(data) {
          // alert(JSON.stringify(data));
          console.log(data);
          if(data.c == 1000){
            var temp = this.checkMenuType(data.ntl);
            this.setState({navArrs:temp});
            //缓存菜单数据
            sessionStorage.setItem('menu_info_index004',JSON.stringify(data.ntl));
          }
        }.bind(this),
        error: function(xhr, status, err) {
          this.showAlert('系统开了小差，请刷新页面');
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }else{
      // console.log(localStorage.getItem('menu_info'));
      var localJsons = this.checkMenuType(JSON.parse(sessionStorage.getItem('menu_info_index004')));
      // console.log(JSON.parse(localStorage.getItem('menu_info')));
      this.setState({navArrs:localJsons});
    }
  },
  getBgLogo: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    $.ajax({
      type:'get',
      async:false,
      url: global.url+'/usr/GetMicWebImgs.do?ou='+ownUri+'&ida='+ida,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          // this.setState({navArrs:data.ntl});
          //alert(0);
          this.setState({bg:data.bi,logo:data.l});
          //依据菜单版本号判断，版本号不一致，需要重新请求服务端数据
          // console.log(sessionStorage.getItem('menu_version'));
          if(sessionStorage.getItem('menu_version_index004')){
            if(sessionStorage.getItem('menu_version_index004') != data.mv){
              this.getUserList(true);
            }else{
              this.getUserList(false);
            }
          }else{
            this.getUserList(true);
          }
          sessionStorage.setItem('menu_version_index004',data.mv);
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getWxShareInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    $.ajax({
      type:'get',
      url: global.url+'/usr/GetMicWebShareInfo.do?ou='+ownUri+'&st=1&ida='+ida,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          if(data.sil.length>0){
            this.setState({
              shareTitle:data.sil[0].sti,
              shareDesc:data.sil[0].sd,
              shareImg:data.sil[0].spu,
              documentDepartTitle: data.dnm?data.dnm:'机构介绍',
              documentExpTitle: data.enm?data.enm:'我'
            });
          }else{
            if(ida == 1){
              this.setState({
                shareTitle:(data.dnm?data.dnm:'我的')+'机构工作室',
                shareDesc:'欢迎访问我的机构工作室，您可以直接在线咨询我',
                shareImg:'batchdeptlogo20160811_W108_H108_S15.png'
              });
            }else{
              this.setState({
                shareTitle:(data.enm?data.enm+'律师的':'我的')+'名片',
                shareDesc:'欢迎访问我的工作室，您可以直接在线咨询我',
                shareImg:'batchdeptlogo20160811_W108_H108_S15.png'
              });
            }
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  //查询用户微网站是否过期
  getUserWebState: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    $.ajax({
      type:'get',
      url: global.url+'/exp/QueryMicWebActivate.do?ownUri='+ownUri+'&ida='+ida,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          //0未激活、1试用、2正常付费、3试用到期、4正常付费到期
          if(data.as==3||data.as==4){
            //activeState true则显示弹层
            this.setState({activeState:true});
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  setIphoneHeight:function(){   
    if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
        var h = $(window).height();
        // alert(h);
        $('.theme4_main').css({'height':h,'position':'relative'});
    }; 
  },
  checkIOSVersion: function(){
    // alert(window.navigator.appVersion);
  // 判断是否 iPhone 或者 iPod
    if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {
      // 判断系统版本号是否大于 4
      return Boolean(navigator.userAgent.match(/OS [9]_\d[_\d]* like Mac OS X/i));
    } else {
      return false;
    }
  },
  componentDidMount: function(){
    this.staticWebPV(1);
    $('body').css({'background':'#ebebeb'});
    // $('#bottomBar').css('bottom','5px');
    var temp = this.checkIOSVersion();
    // alert(this.isAndroid());
    if(!temp&&this.isIOS()){
      $('#bottomBar').css('bottom','12px');
      $('body').css('backgroundColor','#2D3132');
    }else if(this.isAndroid()){
      $('#bottomBar').css('bottom','-40px');
    }
    // 乔凡：重新修改title（解决ios不能修改document.title问题）
    var that = this;
    setTimeout(function(){
      var ida = that.getUrlParams('ida');
      var title = '';
      console.log(that.state.documentDepartTitle);
      console.log(that.state.documentExpTitle);
      if(ida == 1){
        title = that.state.documentDepartTitle?that.state.documentDepartTitle:'机构介绍';
      }else{
        title = that.state.documentExpTitle?(that.state.documentExpTitle+'的名片'):'名片';
      }
      var $body = $('body')
      document.title = title;
      // hack在微信等webview中无法修改document.title的情况
      var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
        setTimeout(function() {
          $iframe.off('load').remove()
        }, 0)
      }).appendTo($body);
    },300)
  },
  componentWillMount: function(){
    this.getBgLogo();
    console.log('bg:'+this.state.bg);
    this.getWxShareInfo();
    this.setIphoneHeight();
    this.getUserWebState();
    this.getLatestNews();
  },
	render:function(){
		 var navNodes = this.state.navArrs.map(function(item,i){
      return(
            <li key={new Date().getTime()+i}>
              <a href={item.ac?item.ac:'javascript:void(0);'} onClick={this.menuLink.bind(this,item.type,item.ntid,item.limit,item.psw,item.title)}>
                <img src={global.img+item.src}/>
                <p>{item.title}</p>
              </a>
            </li>
       );
    }.bind(this));
		return (
				<div>
					<div className="theme4_main">
						<div className="main">
							<img src={global.img+this.state.bg} alt="" className="theme4_main_bg"/>
              <div className="logo" style={{display:this.state.logo?'block':'none'}}>
                <img src={global.img+this.state.logo}/>
              </div>
							
						</div>
            <div id="bottomBar" style={{'position':'absolute','bottom':'-55px','width':'100%','overflow':'hidden'}}>
  						<ul className="theme4_main_list">
              {navNodes}
  						</ul>
              <Establish/>
            </div>
					</div>
          <LatestNews newsShow={this.state.newsShow} newsTitle={this.state.newsTitle} newsContent={this.state.newsContent} />
					<Share title={this.state.shareTitle} desc={this.state.shareDesc} 
        imgUrl={global.img+this.state.shareImg} target="index004"/>
        <Message/>
        <Shadow display={this.state.activeState} context="用户尚未开通此功能!"/>
        <div id="limit_password_box" title="" value="" name="" type="">
          <Password display="true"/>
        </div>
        <Toolbar/>
        <Shade/>
				</div>
			)
	}
})
module.exports = Index004;
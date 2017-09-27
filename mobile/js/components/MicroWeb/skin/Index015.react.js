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
var LatestNews = require('../public/LatestNews.react');


require('../../../../css/theme/theme015.less');
var Index015 = React.createClass({
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
      documentExpTitle: '',
      documentDepartTitle: ''
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
        this.showRefresh('系统开了小差，请刷新页面');
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
            sessionStorage.setItem('menu_info_index015',JSON.stringify(data.ntl));
          }
        }.bind(this),
        error: function(xhr, status, err) {
          this.showRefresh('系统开了小差，请刷新页面');
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }else{
      var localJsons = this.checkMenuType(JSON.parse(sessionStorage.getItem('menu_info_index015')));
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
      var from = this.getUrlParams('from');
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
            if(from == 'app'){
              this.getUserList(true);
            }else if(sessionStorage.getItem('menu_version_index015')){
              if(sessionStorage.getItem('menu_version_index015') != data.mv){
                this.getUserList(true);
              }else{
                this.getUserList(false);
              }
            }else{
              this.getUserList(true);
            }
            sessionStorage.setItem('menu_version_index015',data.mv);
          }
        }.bind(this),
        error: function(xhr, status, err) {
          this.showRefresh('系统开了小差，请刷新页面');
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
          console.log(global.img);
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
                  shareTitle:(data.dnm?data.dnm:'我的')+'机构简介',
                  shareDesc:'欢迎访问'+(data.dnm?data.dnm:'我的')+'机构简介',
                  shareImg:'batchdeptlogo20160811_W108_H108_S15.png'
                });
              }else{
                this.setState({
                  shareTitle:(data.enm?data.enm+data.rk+'的':'我的')+'名片',
                  shareDesc:'欢迎访问我的名片，您可以直接在线咨询我',
                  shareImg:'batchdeptlogo20160811_W108_H108_S15.png'
                });
              }
            }
          }
        }.bind(this),
        error: function(xhr, status, err) {
          this.showRefresh('系统开了小差，请刷新页面');
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
        this.showRefresh('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.staticWebPV(1);
    // this.getUserList();
    $('body').css({'background':'#ebebeb'});
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
    this.getUserWebState();
    this.getLatestNews();
  },
	render:function(){
     var navNodes = this.state.navArrs.map(function(item,i){
      return(
            <li key={new Date().getTime()+i}>
              <a href={item.ac?item.ac:'javascript:void(0);'} onClick={this.menuLink.bind(this,item.type,item.ntid,item.limit,item.psw,item.title)}>
                <img src={global.img+item.src}/>
                <div>{item.title}</div>
              </a>
            </li>
       );
    }.bind(this));
		return (
				<div>
					<div className="theme015_container">
            <img src={global.img+this.state.bg} width="100%"/>
            <div className="logo" style={{display:this.state.logo?'block':'none'}}>
              <img src={global.img+this.state.logo}/>
            </div>
            <ul className="theme015_menu_list">
              {navNodes}
            </ul>
          </div>
          <LatestNews newsShow={this.state.newsShow} newsTitle={this.state.newsTitle} newsContent={this.state.newsContent} />
          <Establish/>
					<Share title={this.state.shareTitle} desc={this.state.shareDesc} 
        imgUrl={global.img+this.state.shareImg} target="index015"/>
        <Message/>
        <Shadow display={this.state.activeState} context="用户尚未开通此功能!"/>
        <div id="limit_password_box" title="" value="" name="" type="">
          <Password display="true"/>
        </div>
        <Toolbar/>
				</div>
			)
	}
})
module.exports = Index015;

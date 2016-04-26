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
var MobileBlocks = require('../../common/Mobilyblocks.react');

require('../../../../css/theme/theme017.less');
var Index017 = React.createClass({
	mixins:[CommonMixin],
  getInitialState: function(){
    return {
      activeState:false,
      navArrs:[],
      bg:'',
      logo:'',
      shareTitle:'',
      shareDesc:'',
      shareImg:''
    };
  },
  getUserList: function(flag){
    // alert($(window).width()+'x'+$(window).height());
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    if(flag){
      $.ajax({
        type:'get',
        url: global.url+'/exp/QueryNewsTypes.do?&ownUri='+ownUri,
        success: function(data) {
          // alert(JSON.stringify(data));
          console.log(data);
          if(data.c == 1000){
            var temp = this.checkMenuType(data.ntl);
            this.setState({navArrs:temp});
            //缓存菜单数据
            sessionStorage.setItem('menu_info_index016',JSON.stringify(data.ntl));
          }
        }.bind(this),
        error: function(xhr, status, err) {
          this.showAlert('网络连接错误或服务器异常！');
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }else{
      var localJsons = this.checkMenuType(JSON.parse(sessionStorage.getItem('menu_info_index016')));
      this.setState({navArrs:localJsons});
    }
  },
  getBgLogo: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    $.ajax({
      type:'get',
      async:false,
      url: global.url+'/usr/GetMicWebImgs.do?ou='+ownUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          // this.setState({navArrs:data.ntl});
          //alert(0);
          this.setState({bg:data.bi,logo:data.l});
          //依据菜单版本号判断，版本号不一致，需要重新请求服务端数据
          if(sessionStorage.getItem('menu_version_index016')){
            if(sessionStorage.getItem('menu_version_index016') != data.mv){
              this.getUserList(true);
            }else{
              this.getUserList(false);
            }
          }else{
            this.getUserList(true);
          }
          sessionStorage.setItem('menu_version_index016',data.mv);
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
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
    $.ajax({
      type:'get',
      url: global.url+'/usr/GetMicWebShareInfo.do?ou='+ownUri+'&st=1',
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          if(data.sil.length>0){
            this.setState({
              shareTitle:data.sil[0].sti,
              shareDesc:data.sil[0].sd,
              shareImg:data.sil[0].spu
            });
          }else{
            this.setState({
              shareTitle:'微网站首页',
              shareDesc:'这是一个律师微网站，由绿石开发提供技术支持！',
              shareImg:'greenStoneicon300.png'
            });
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
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
    $.ajax({
      type:'get',
      url: global.url+'/exp/QueryMicWebActivate.do?ownUri='+ownUri,
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
        this.showAlert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.staticWebPV(1);
    // this.getUserList();
    $('body').css({'background':'#ebebeb'});
    $('.nature').mobilyblocks({
      trigger: 'click', //触发的方式
      direction: 'counter', //动画方向
      duration:500,  //动画持续时间
      zIndex:50,  //z-inde值
      widthMultiplier:1.15  //宽度的倍数
    });
  },
  componentWillMount: function(){
    // this.getBgLogo();
    console.log('bg:'+this.state.bg);
    // this.getWxShareInfo();
  },
	render:function(){
    var navNodes = this.state.navArrs.map(function(item,i){
      return(
            <li key={new Date().getTime()+i}>
              <a href={item.ac?item.ac:'javascript:void(0);'} onClick={this.menuLink.bind(this,item.type,item.ntid,item.limit,item.psw,item.title)}>
                <div className="theme016_circle">
                  <img src={global.img+item.src}/>
                  <p>{item.title}</p>
                </div>
              </a>
            </li>
       );
    }.bind(this));
		return (
				<div>
					<div id="content">
            <div className="nature">
              <h1>主菜单</h1>
              <ul className="reset">
                <li><a href="http://www.jqcool.net">jQ酷</a></li>
                <li><a href="http://www.jqcool.net/jquery-download">jqeury下载</a></li>
                <li><a href="http://www.jqcool.net/plug">jquery插件</a></li>
                <li><a href="http://www.jqcool.net/jquery-course">jquery教程</a></li>
                <li><a href="http://www.jqcool.net/adminnote">站长随记</a></li>
                <li><a href="http://www.jqcool.net/guestbook">留言</a></li>
                <li><a href="http://www.jqcool.net">jQ大神</a></li>
              </ul>
            </div>
          </div>
				</div>
			)
	}
})
module.exports = Index017;

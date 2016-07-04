var React = require('react');
var wx = require('weixin-js-sdk');

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

var Global_share_arr = [];
require('../../../../css/theme/theme008.less');
var Index008=React.createClass({
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
      container1:[],
      container2:[],
      container3:[]
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

              if(temp.length > 0 && temp.length < 3){
                var arr0 = [];
                for(var i=0;i<2;i++){
                  arr0.push(temp[i]);
                }
                this.setState({container1:arr0});
              }else if(temp.length > 3 && temp.length < 5 || temp.length == 3){
                var  arr0 = [],
                     arr1 = [];
                for(var i=0;i<2;i++){
                  arr0.push(temp[i]);
                }
                for(var i=2;i<temp.length;i++){
                  arr1.push(temp[i]);
                }
                this.setState({container1:arr0});
                this.setState({container2:arr1});
              }else if(temp.length > 5 || temp.length == 5){
                var arr1 = [],
                    arr2 = [],
                    arr3 = [];
                for(var i=0;i<2;i++){
                  arr1.push(temp[i]);
                }
                for(var i=2;i<5;i++){
                  arr2.push(temp[i]);
                }
                for(var i=5;i<temp.length;i++){
                  arr3.push(temp[i]);
                }
                this.setState({container1:arr1});
                this.setState({container2:arr2});
                this.setState({container3:arr3});
              }
            }
            //缓存菜单数据
            sessionStorage.setItem('menu_info_index008',JSON.stringify(data.ntl));
        }.bind(this),
        error: function(xhr, status, err) {
          this.showAlert('系统开了小差，请刷新页面');
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }else{
      var temp = this.checkMenuType(JSON.parse(sessionStorage.getItem('menu_info_index008')));
      if(temp.length > 0 && temp.length < 3){
          var arr0 = [];
          for(var i=0;i<2;i++){
            arr0.push(temp[i]);
          }
          this.setState({container1:arr0});
        }else if(temp.length > 3 && temp.length < 5 || temp.length == 3){
          var  arr0 = [],
               arr1 = [];
          for(var i=0;i<2;i++){
            arr0.push(temp[i]);
          }
          for(var i=2;i<temp.length;i++){
            arr1.push(temp[i]);
          }
          this.setState({container1:arr0});
          this.setState({container2:arr1});
        }else if(temp.length > 5 || temp.length == 5){
          var arr1 = [],
              arr2 = [],
              arr3 = [];
          for(var i=0;i<2;i++){
            arr1.push(temp[i]);
          }
          for(var i=2;i<5;i++){
            arr2.push(temp[i]);
          }
          for(var i=5;i<temp.length;i++){
            arr3.push(temp[i]);
          }
          this.setState({container1:arr1});
          this.setState({container2:arr2});
          this.setState({container3:arr3});
        }
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
      url: global.url+'/usr/GetMicWebImgs.do?ou='+ownUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        // console.log(data);
        if(data.c == 1000){
          // this.setState({navArrs:data.ntl});
          //alert(0);
          this.setState({bg:data.bi,logo:data.l});
          if(sessionStorage.getItem('menu_version_index008')){
            if(sessionStorage.getItem('menu_version_index008') != data.mv){
              this.getUserList(true);
            }else{
              this.getUserList(false);
            }
          }else{
            this.getUserList(true);
          }
          sessionStorage.setItem('menu_version_index008',data.mv);
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
    $.ajax({
      type:'get',
      url: global.url+'/usr/GetMicWebShareInfo.do?ou='+ownUri+'&st=1',
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          Global_share_arr = data.sil;
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
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.staticWebPV(1);
    if(Global_share_arr.length>0){
      this.setState({
          shareTitle:Global_share_arr[0].sti,
          shareDesc:Global_share_arr[0].sd,
          shareImg:Global_share_arr[0].spu
      });
    }else{
      this.setState({
        shareTitle:'我的微网站',
        shareDesc:'欢迎访问我的微网站！这里有我的职业介绍和成就!',
        shareImg:'greenStoneicon300.png'
      });
    }
  },
  componentWillMount: function(){
    this.getBgLogo();
    this.getWxShareInfo();
    this.getUserWebState();
  },
  render:function(){
    var navNodes1 = this.state.container1.map(function(item,i){
      return(
          <a key={new Date().getTime()+i} href={item.ac?item.ac:'javascript:void(0);'} onClick={this.menuLink.bind(this,item.type,item.ntid,item.limit,item.psw,item.title)}>
            <div className="test">
              <div className="icons">
                <img src={global.img+item.src} width="100%"/>
                <span>{item.title}</span>
              </div>
              <div className="one"></div>
              <div className="two"></div>
              <div className="three"></div>
            </div>
          </a>
       );
    }.bind(this));
    var navNodes2 = this.state.container2.map(function(item,i){
      return(
          <a key={new Date().getTime()+i} href={item.ac?item.ac:'javascript:void(0);'} onClick={this.menuLink.bind(this,item.type,item.ntid,item.limit,item.psw,item.title)}>
            <div className="test">
              <div className="icons">
                <img src={global.img+item.src} width="100%"/>
                <span>{item.title}</span>
              </div>
              <div className="one"></div>
              <div className="two"></div>
              <div className="three"></div>
            </div>
          </a>
       );
    }.bind(this));
    var navNodes3 = this.state.container3.map(function(item,i){
      return(
          <a key={new Date().getTime()+i} href={item.ac?item.ac:'javascript:void(0);'} onClick={this.menuLink.bind(this,item.type,item.ntid,item.limit,item.psw,item.title)}>
            <div className="test">
              <div className="icons">
                <img src={global.img+item.src} width="100%"/>
                <span>{item.title}</span>
              </div>
              <div className="one"></div>
              <div className="two"></div>
              <div className="three"></div>
            </div>
          </a>
       );
    }.bind(this));
    return (
        <div>
          <div className="theme8_main">
            <div className="main">
              <img src={global.img+this.state.bg} alt="" className="theme3_main_bg"/>
              <div className="logo" style={{display:this.state.logo?'block':'none'}}>
                <img src={global.img+this.state.logo}/>
              </div>
            </div>
            <div className="theme8_ul">
              <div className="container1">
                {navNodes1}
              </div>
              <div className="container2">
                {navNodes2}
              </div>
              <div className="container3">
                {navNodes3}
              </div>
            </div>
          </div>
          <Share title={this.state.shareTitle} desc={this.state.shareDesc} 
        imgUrl={global.img+this.state.shareImg} target="index008"/>
          <Establish/>
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

module.exports = Index008;
var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

require('../../../../css/theme/theme007.less');
var Index007=React.createClass({
	mixins:[CommonMixin],
	getInitialState: function(){
    return {
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
	getUserList: function(){
    // alert($(window).width()+'x'+$(window).height());
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    $.ajax({
      type:'get',
      url: global.url+'/exp/QueryNewsTypes.do?&ownUri='+ownUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          var temp = this.checkMenuType(data.ntl);
          // console.log(temp.length);
          // this.setState({navArrs:temp});

          if(temp.length == 1){
            var arr0 = [];
            for(var i=0;i<1;i++){
              arr0.push(temp[i]);
            }
            this.setState({container1:arr0});
          }else if(temp.length > 1 && temp.length < 5){
            var  arr0 = [],
                 arr1 = [];
            for(var i=0;i<1;i++){
              arr0.push(temp[i]);
            }
            for(var i=1;i<4;i++){
              arr1.push(temp[i]);
            }
            this.setState({container1:arr0});
            this.setState({container2:arr1});
          }else if(temp.length > 4){
            var arr1 = [],
                arr2 = [],
                arr3 = [];
            for(var i=0;i<1;i++){
              arr1.push(temp[i]);
            }
            for(var i=1;i<4;i++){
              arr2.push(temp[i]);
            }
            for(var i=4;i<6;i++){
              arr3.push(temp[i]);
            }
            this.setState({container1:arr1});
            this.setState({container2:arr2});
            this.setState({container3:arr3});
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
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
        // console.log(data);
        if(data.c == 1000){
          // this.setState({navArrs:data.ntl});
          //alert(0);
          this.setState({bg:data.bi,logo:data.l});

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
              shareTitle:'绿石微网站',
              shareDesc:'绿石微网站，由绿石开发提供技术支持！',
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
	componentDidMount: function(){
    this.staticWebPV(1);
    this.getUserList();
  },
  componentWillMount: function(){
    this.getBgLogo();
    this.getWxShareInfo();
  },
	render:function(){
    var navNodes1 = this.state.container1.map(function(item,i){
      return(
          <a key={new Date().getTime()+i} href={item.ac?item.ac:'javascript:void(0);'} onClick={this.menuLink.bind(this,item.type,item.ntid)}>
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
          <a key={new Date().getTime()+i} href={item.ac?item.ac:'javascript:void(0);'} onClick={this.menuLink.bind(this,item.type,item.ntid)}>
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
          <a key={new Date().getTime()+i} href={item.ac?item.ac:'javascript:void(0);'} onClick={this.menuLink.bind(this,item.type,item.ntid)}>
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
					<div className="theme7_main">
						<div className="main">
							<img src={global.img+this.state.bg} alt="" className="theme3_main_bg"/>
              <div className="logo">
                <img src={global.img+this.state.logo}/>
              </div>
						</div>
            <div className="theme7_ul">
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
						<div className="theme6_copyright"><a href="tel:010-58678723">绿石科技研发</a></div>
            <Share title={this.state.shareTitle} desc={this.state.shareDesc} 
        imgUrl={global.img+this.state.shareImg} target="index007"/>
					</div>
          <Message/>
				</div>
			)
	}
})

module.exports = Index007;
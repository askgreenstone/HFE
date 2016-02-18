var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

require('../../../../css/theme/theme015.less');
var Index015 = React.createClass({
	mixins:[CommonMixin],
  getInitialState: function(){
    return {
      navArrs:[],
      bg:'',
      logo:'',
      shareTitle:'',
      shareDesc:'',
      shareImg:''
    };
  },
  getUserList: function(){
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
          this.setState({navArrs:temp});
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
          console.log(data);
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
          console.log(global.img);
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
    componentDidMount: function(){
      this.staticWebPV(1);
      this.getUserList();
      $('body').css({'background':'#ebebeb'});
    },
    componentWillMount: function(){
      this.getBgLogo();
      console.log('bg:'+this.state.bg);
      this.getWxShareInfo();
    },
	render:function(){
     var navNodes = this.state.navArrs.map(function(item,i){
      return(
            <li key={new Date().getTime()+i}>
              <a href={item.ac?item.ac:'javascript:void(0);'} onClick={this.menuLink.bind(this,item.type,item.ntid)}>
                <img src={global.img+item.src}/>
                <div>{item.title}</div>
              </a>
            </li>
       );
    }.bind(this));
		return (
				<div>
					<div className="theme012_container">
            <img src={global.img+this.state.bg} width="100%"/>
            <div className="logo" style={{display:this.state.logo?'block':'none'}}>
              <img src={global.img+this.state.logo}/>
            </div>
            <ul className="theme012_menu_list">
              {navNodes}
            </ul>
          </div>
          <div className="theme6_copyright"><a href="tel:010-58678723">绿石科技研发</a></div>
					<Share title={this.state.shareTitle} desc={this.state.shareDesc} 
        imgUrl={global.img+this.state.shareImg} target="index012"/>
        <Message/>
				</div>
			)
	}
})
module.exports = Index015;

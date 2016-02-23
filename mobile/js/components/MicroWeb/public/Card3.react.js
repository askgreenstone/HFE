var React = require('react');
var CommonMixin = require('../../Mixin');
var wx = require('weixin-js-sdk');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

var Card3 = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {datas:[],Abstract:'',Title:'',Introduction:'',Img:''};
  },
  qrCode: function(){
    $('.qr_hidden').height(document.body.scrollHeight+'px');
    $('.qr_hidden').show(500);
  },
  hideDiv: function(){
    $('.qr_hidden').hide(500);
  },
  gotoLink: function(path){
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri');
  },
  getServerInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    var wid = $(window).width()/2;
    $.ajax({
      type:'get',
      url: global.url+'/usr/QueryMicroCard.do?ownUri='+ownUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
           this.setState({
            QR:global.img+data.QR,
            hI:global.img+data.hI,
            nm:data.nm,
            dp:data.dp,
            rk:data.rk,
            Mob:data.Mob,
            eml:data.eml,
            tel:data.tel,
            web:data.web,
            adr:data.adr,
            abs:data.abs,
            rg:data.rg,
            itd:data.itd,
            Abstract:data.abs.length>60?data.abs.substr(0,60)+'...':data.abs,
            Introduct:data.itd.length>60?data.itd.substr(0,60)+'...':data.itd,
            Mobile:data.Mob.replace(/ /g,''),
            TelNo:data.tel.replace(/ /g,''),
            abss:data.abs.length>60?true:false,
            itdd:data.itd.length>60?true:false,
            width:wid
          });
          $('.qr_hidden').height(document.body.scrollHeight);
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getShareInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    $.ajax({
      type:'get',
      url: global.url+'/usr/GetMicWebShareInfo.do?ou='+ownUri+'&st=2',
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          console.log(data.sil[0].spu)
          this.setState({
            Title:data.sil[0].sti,
            Introduction:data.sil[0].sd,
            Img:global.img+data.sil[0].spu
          });
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  absToggle: function(e){
    console.log(e.target.innerText);
    if(e.target.innerText=='全文'){
      e.target.innerText='收起';
      this.setState({
        Abstract:this.state.abs
      })
    }else{
      e.target.innerText='全文';
      this.setState({
        Abstract:this.state.abs.substr(0,60)+'...'
      })
    };
  },
  itdToggle: function(e){
    console.log(e.target.innerText);
    if(e.target.innerText=='全文'){
      e.target.innerText='收起';
      this.setState({
        Introduct:this.state.itd
      })
    }else{
      e.target.innerText='全文';
      this.setState({
        Introduct:this.state.itd.substr(0,60)+'...'
      })
    };
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    console.log(this.state.Abstract);
  },
  componentWillMount:function(){
    // this.getServerInfo();
    // this.getShareInfo();
    // alert($(window).height());
  }, 
  render: function() {
    
    
       return (
        <div>
          <div className="qr_hidden" onClick={this.hideDiv}>
            <img src="http://transfer.green-stone.cn/1A4ECA87533F602814717405E75F8696_W344_H344_S7.jpg" width="200" height="200"/>
          </div>
          <div className="user_info">
            <img className="ui_header" src="http://transfer.green-stone.cn/49D1541AFA6993C051CACF51436712B4_W1887_H1887_S701.jpg?timestamp=1456202757598" width="65" height="65"/>
            <p style={{width:this.state.width}}>
              <span>Yulong Li</span><br/>
              <span>Dentons</span><br/>
              <span>Senior Partner</span>
            </p>
            <img onClick={this.qrCode} className="ui_qrcode" src="http://transfer.green-stone.cn/1A4ECA87533F602814717405E75F8696_W344_H344_S7.jpg" width="55" height="55"/>
          </div>
          <div className="user_content">
            <div className="uc_input">
              <a href='tel://86-13501072380'>
                86 13501072380
                <img src="image/theme002/telphone1.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input">
              <a href='mailto:yulong.li@dentons.cn'>
                yulong.li@dentons.cn
                <img src="image/theme002/email.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input">
              <a href='tel://86-10-58137589'>
                86 10 58137589
                <img src="image/theme002/fax.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input">
              <a href="http://www.dentons.cn">
                http://www.dentons.cn
                <img src="image/theme002/web.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input fixed">
              <a href="javascript:void(0);" onClick={this.gotoLink.bind(this,'adress')}>
                7th Floor, Building D, Parkview Green FangCaoDi 9 Dongdaqiao Road
                <img src="image/theme002/adress.png" width="25" height="25"/>
              </a>
            </div>
            <div className="user_intro">
              <i>Profile</i>
              <p>Mr. Yulong Li is the senior partner of Dentons, Beijing Offices. He Obtains
               the bachelor of laws from China University of Political Science and Law, and 
               graduates from Renmin University (China) with the Master of Civil and Commercial
                Law. He is also the visiting scholar of Washington University of USA (2010) and 
                New York’s Ford University (2012). 
              </p>
            </div>
            <div className="user_intro">
              <i>Fields</i>
              <p>He is specialized in angel investment, VC, private equity and corporate 
              financing, has rich experiences in investment affairs and capital market.
              </p>
            </div>
            <div className="user_create" style={{width:"140px"}}>
                <a href="http://viewer.maka.im/pcviewer/FI09ICYA">Set Up My Site</a>
            </div>
          </div>
          <Share title="Yulong LI Esq." desc="Yulong Li is specialized in angel investment, VC, private equity and corporate financing, has rich experiences in investment affairs and capital market.
" imgUrl="http://transfer.green-stone.cn/49D1541AFA6993C051CACF51436712B4_W1887_H1887_S701.jpg?timestamp=1456203759749" target="card3"/>
          <Message/>
        </div>
      )
  }
});

module.exports = Card3;
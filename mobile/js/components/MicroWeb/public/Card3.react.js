//特殊需求，添加了英文版本微名片
// 李玉龙英文微名片，分享信息写死，掉数据接口关闭
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
    $('.qr_hidden').height((document.body.scrollHeight+10)+'px');
    $('.qr_hidden').show(500);
  },
  hideDiv: function(){
    $('.qr_hidden').hide(500);
  },
  gotoLink: function(path){
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri');
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    console.log(this.state.Abstract);
  },
  componentWillMount:function(){
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
              <span>大成Dentons</span><br/>
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
                <a href={global.url+"/mobile/#/index005?ownUri=e2202"}>Set Up My Site</a>
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
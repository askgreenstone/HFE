//特殊需求，添加了英文版本微名片
// 于洪彬英文微名片，分享信息写死，掉数据接口关闭
var React = require('react');
var CommonMixin = require('../../Mixin');
var wx = require('weixin-js-sdk');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

var Card4 = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {datas:[],Abstract:'No. 037 sponsor of the JRCoffee;The founder and the CEO of Ruoshui Crowdfunding;'+
                  'The chairman of the board of Beijing Jindianpai IT Co.Ltd;'
                  +'...',Title:'',Introduction:'',Img:''};
  },
  qrCode: function(){
    $('.qr_hidden').height((window.screen.height+10)+'px');
    $('.qr_hidden').show(500);
  },
  hideDiv: function(){
    $('.qr_hidden').hide(500);
  },
  gotoLink: function(path){
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri');
  },
  absToggle: function(e){
    console.log(e.target.innerText);
    if(e.target.innerText=='unfold'){
      e.target.innerText='fold';
      this.setState({
        Abstract:"No. 037 sponsor of the JRCoffee;"+
                 "The founder and the CEO of Ruoshui Crowdfunding;"+
                 "The chairman of the board of Beijing Jindianpai IT Co.Ltd;"+
                 "Graduate degree of Peking University;"+
                 "Yu Hongbin owned his business after working in Huawei company for many years ."+
                 "He and his company provides information services for more than 70% assets "+
                 "and equity exchange platform for more than 10 years.He has accumulated deep "+
                 "resources and experience in exchange industry;"+
                 "Yu Hongbin does well in the field of the property exchange,"+ 
                 "the commodity exchange, trading center architecture design,"+ 
                 "business system planning, design and development of trading systems,"+
                 "operation and maintenance of electronic trading platform;"+
                 "He is a Chinese-style crowdfunding practitioner,"+
                 "who creates commodities trading and equity exchange network platform "+
                 "after study and practice deeply in the industrial chain of financial"+ 
                 "innovation based on the exchanges;"+
                 "Yu is the co-founder of “Jinmajia ”——the first electronic business platform in China"+
                 "Equity Exchange Industry. He has invested to build the Guangzhou Commodity Exchange"+ 
                 "Jewelry Trading Center , Guangzhou Coins&Stamps trading center, Beijing Redwood"+ 
                 "Trading Center, Shenyang Rural Property Rights Trading Center.He paid more attention"+ 
                 "to the investment and cooperation in the field of commodities electronic trading "+
                 "platform."
      })
    }else{
      e.target.innerText='unfold';
      this.setState({
        Abstract:"No. 037 sponsor of the JRCoffee;The founder and the CEO of Ruoshui Crowdfunding;"+
                  "The chairman of the board of Beijing Jindianpai IT Co.Ltd;"
                  +'...'
      })
    };
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
            <img src="http://transfer.green-stone.cn/CA6EF1DD78B229D55DF2FD21A2E7F988_W160_H156_S17.png" width="200" height="200"/>
          </div>
          <div className="user_info">
            <img className="ui_header" src="http://transfer.green-stone.cn/07EDA9D91DACF87C99784D845854E956_W1242_H1242_S2386.jpg?timestamp=1456202757598" width="65" height="65"/>
            <p style={{width:this.state.width}}>
              <span>Bingo Yu</span><br/>
              <span>Beijing Jindianpai IT Co.Ltd.</span><br/>
              <span>Chairman</span>
            </p>
            <img onClick={this.qrCode} className="ui_qrcode" src="http://transfer.green-stone.cn/CA6EF1DD78B229D55DF2FD21A2E7F988_W160_H156_S17.png" width="55" height="55"/>
          </div>
          <div className="user_content">
            <div className="uc_input">
              <a href='tel://86-13311231878'>
                86 133 1123 1878
                <img src="image/theme002/telphone1.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input">
              <a href='mailto:yuhb@netpat.cn'>
                yuhb@netpat.cn
                <img src="image/theme002/email.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input">
              <a href='tel://010-8289-4539'>
                86 10 8289 4539
                <img src="image/theme002/fax.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input">
              <a href="http://www.netpat.cn/">
                http://www.netpat.cn/
                <img src="image/theme002/web.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input fixed">
              <a href="javascript:void(0);" onClick={this.gotoLink.bind(this,'adress')}>
                Ruyi Hui，JRCooffee basement，No.3 Dingzhang Hutong,Xicheng district,Beijing
                <img src="image/theme002/adress.png" width="25" height="25"/>
              </a>
            </div>
            <div className="user_intro">
              <i>Profile</i>
              <p>{this.state.Abstract}
              </p>
              <div onClick={this.absToggle}>unfold</div>
            </div>
            <div className="user_intro">
              <i>Fields</i>
              <p>Industrial Chain Finance Innovation Platform Based on the exchange mode&China crowdfunding
              </p>
            </div>
            <div className="user_create" style={{width:"140px"}}>
                <a href="http://dist.green-stone.cn/coop/wbms/">Set Up My Site</a>
            </div>
          </div>
          <Share title="Bingo Yu" desc="Industrial Chain Finance Innovation Platform Based on the exchange mode&China crowdfunding" 
          imgUrl="http://transfer.green-stone.cn/07EDA9D91DACF87C99784D845854E956_W1242_H1242_S2386.jpg?timestamp=1456203759749" target="card4"/>
          <Message/>
        </div>
      )
  }
});

module.exports = Card4;
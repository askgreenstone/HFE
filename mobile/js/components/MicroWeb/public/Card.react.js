var React = require('react');
var CommonMixin = require('../../Mixin');
var wx = require('weixin-js-sdk');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

var Card = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {datas:[],Abstract:'',Title:'',Introduction:'',Img:''};
  },
  showBox:function(ele){
    $('#'+ele).show(500);
  },
  hideBox:function(ele){
    $('#'+ele).hide(500);
  },
  gotoLink: function(path){
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri')+'&ida='+ida;
  },
  getServerInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    var wid = $(window).width()/2;
    $.ajax({
      type:'get',
      url: global.url+'/usr/QueryMicroCard.do?ownUri='+ownUri+'&ida='+ida,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
           this.setState({
            QR:global.img+data.QR,
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
            Abstract:data.abs?(data.abs.length>60?data.abs.substr(0,60)+'...':data.abs):'',
            Introduct:data.itd?(data.itd.length>60?data.itd.substr(0,60)+'...':data.itd):'',
            Mobile:data.Mob?(data.Mob.replace(/ /g,'')):'',
            TelNo:data.tel?(data.tel.replace(/ /g,'')):'',
            abss:data.abs?(data.abs.length>60?true:false):false,
            itdd:data.itd?(data.itd.length>60?true:false):false,
            width:wid,
            vcard:data.vcard
          });
          $('.qr_hidden').height(document.body.scrollHeight);
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showRefresh('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getExpertInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var exOwnUri = ownUri.replace('e','');
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    $.ajax({
      type:'get',
      url: global.url+'/exp/ExpertInfo.do?ei='+exOwnUri,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
            var expertHead = data.p||'header.jpg';
            var exCompanyLogo = data.cl||'header.jpg';
          this.getShareInfo(expertHead,exCompanyLogo);
          this.setState({
            hI:global.img+data.p||global.img+'header.jpg'
          })
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showRefresh('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getShareInfo: function(headImg,companyLogoImg){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    $.ajax({
      type:'get',
      url: global.url+'/usr/GetMicWebShareInfo.do?ou='+ownUri+'&st=1&ida='+ida,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          // console.log(data.sil[0].spu)
          if(data.sil.length>0){
            this.setState({
              Title:data.sil[0].sti,
              Introduction:data.sil[0].sd,
              Img:data.sil[0].spu
            });
          }else{
            if(ida == 1){
              this.setState({
                Title:(data.dnm?data.dnm:'我的')+'机构简介',
                Introduction:'欢迎访问'+(data.dnm?data.dnm:'我的')+'机构简介',
                Img:companyLogoImg
              });
            }else{
              this.setState({
                Title:(data.enm?(data.eg?data.enm+data.eg:data.enm+'的'):'我的')+'名片',
                Introduction:'欢迎访问我的名片，您可以直接在线咨询我',
                Img:headImg
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
  goHome: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    console.log(global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri);
    window.location.href = global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri+'&ida='+ida;
  },
  getIndexTheme: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/QueryMicWebInfo.do?ownUri='+ownUri+'&ida='+ida,
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
          this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    console.log(this.state.Abstract);
    var $body = $('body')
    document.title = '微名片';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
  },
  componentWillMount:function(){
    this.getExpertInfo();
    this.getServerInfo();
    this.getIndexTheme();
  }, 
  render: function() {
    var ShareTitile = this.state.Title;
    var ShareDesc = this.state.Introduction;
    var ShareImg = this.state.Img;
    // console.log('ShareTitile='+ShareTitile+'ShareDesc='+ShareDesc+'ShareImg='+ShareImg);
       return (
        <div>
          <div id="qr_hidden" className="qr_hidden" onClick={this.hideBox.bind(this,'qr_hidden')}>
            <img src={this.state.QR} width="200" height="200"/>
            <div className="tap_text">长按识别二维码</div>
          </div>
          <div id="vcard_hidden" className="qr_hidden" onClick={this.hideBox.bind(this,'vcard_hidden')}>
            <img src={global.img+this.state.vcard} width="200" height="200"/>
            <div className="tap_text">长按识别二维码</div>
          </div>
          <div className="user_info">
            <img className="ui_header" src={this.state.hI} width="65" height="65"/>
            <p style={{width:this.state.width}}>
              <span>{this.state.nm}</span><br/>
              <span style={{display:this.state.dp?'inline':'none'}}>{this.state.dp}</span><br/>
              <span style={{display:this.state.rk?'inline':'none'}}>{this.state.rk}</span>
            </p>
            <img onClick={this.showBox.bind(this,'qr_hidden')} className="ui_qrcode" src={this.state.QR} width="55" height="55"/>
          </div>
          <div className="user_content">
            <div className="uc_input" style={{display:this.state.Mob?'block':'none'}}>
              <a href={'tel://'+this.state.Mobile}>
                {this.state.Mob}
                <img src="image/theme002/mobile.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input" style={{display:this.state.eml?'block':'none'}}>
              <a href={'mailto:'+this.state.eml}>
                {this.state.eml}
                <img src="image/theme002/email.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input" style={{display:this.state.tel?'block':'none'}}>
              <a href={'tel://'+this.state.TelNo}>
                {this.state.tel}
                <img src="image/theme002/telphone1.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input" style={{display:this.state.web?'block':'none'}}>
              <a href={this.state.web}>
                {this.state.web}
                <img src="image/theme002/web.png" width="25" height="25"/>
              </a>
            </div>
            <div className="uc_input fixed" style={{display:this.state.adr?'block':'none'}}>
              <a href="javascript:void(0);" onClick={this.gotoLink.bind(this,'adress')}>
                {this.state.adr}
                <img src="image/theme002/adress.png" width="25" height="25"/>
              </a>
            </div>
            <div className="vcard_box" onClick={this.showBox.bind(this,'vcard_hidden')}>
              <img src={global.img+this.state.vcard} width="100" height="100"/>
              <i>点击二维码<br/>保存通讯录</i>
              <div className="clear"></div>
            </div>
            <div className="user_intro" style={{display:this.state.abs?'block':'none'}}>
              <i>简介</i>
              <p>{this.state.Abstract}
              </p>
              <div onClick={this.absToggle} style={{display:this.state.abss?'block':'none'}}>全文</div>
            </div>
            <div className="user_intro" style={{display:this.state.itd?'block':'none'}}>
              <i>专业领域</i>
              <p>{this.state.Introduct}
              </p>
              <div onClick={this.itdToggle} style={{display:this.state.itdd?'block':'none'}}>全文</div>
            </div>
            <div className="user_create">
                <a href="http://dist.green-stone.cn/coop/wbms/view/wxtemplate.html">创建我的名片</a>
            </div>
          </div>
          <Share title={ShareTitile} desc={ShareDesc} imgUrl={global.img+ShareImg} target="card"/>
          <Message/>
          <div className="ad_goHome" onClick={this.goHome}>
            <img src="image/home.png"/>
          </div>
        </div>
      )
  }
});

module.exports = Card;
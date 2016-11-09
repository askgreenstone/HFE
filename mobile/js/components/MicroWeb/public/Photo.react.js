var React = require('react');
var Waterfall = require('../../common/Waterfall.react');
var CommonMixin = require('../../Mixin');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

var Photo = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {photos:[]};
  },
  getPhotos: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    var ntid = this.getUrlParams('ntid');
    if(!ownUri||!ntid) return;
    $.ajax({
      type:'get',
      url: global.url+'/exp/QueryWXPhotoList.do?ntId='+ntid+'&ownUri='+ownUri+'&ida='+ida,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          this.setState({photos:data.pl});
          localStorage.setItem('tempNtid',ntid);
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getServerInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
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
            itd:data.itd
          });
          // $('.qr_hidden').height($('#myapp').height());
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
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
          alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    this.getPhotos();
    document.title = '我的照片';
  },
  componentWillMount:function(){
    this.getServerInfo();
    this.getIndexTheme();
  }, 
  render: function() {
    var ShareTitile = (this.state.nm?this.state.nm:'')+'律师微相册';
    var ShareDesc = (this.state.nm?this.state.nm:'')+'律师个人风采展示';
    var ShareUrl = this.state.hI?this.state.hI:'';
    return (
        <div>
          <Waterfall item={this.state.photos} />
          <Share title={ShareTitile} desc={ShareDesc} imgUrl={ShareUrl}  target="photo"/>
          <Message/>
          <div className="ad_goHome" onClick={this.goHome}>
            <img src="image/home.png"/>
          </div>
        </div>
    );
  },
});

module.exports = Photo;
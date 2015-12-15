var React = require('react');
var Waterfall = require('../../common/Waterfall.react');
var CommonMixin = require('../../Mixin');
var Share = require('../../common/Share.react');

var Photo = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {photos:[]};
  },
  getPhotos: function(){
    var ownUri = this.getUrlParams('ownUri');
    var ntid = this.getUrlParams('ntid');
    if(!ownUri||!ntid) return;
    $.ajax({
      type:'get',
      url: global.url+'/exp/QueryWXPhotoList.do?ntId='+ntid+'&ownUri='+ownUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          this.setState({photos:data.pl});
          localStorage.setItem('tempNtid',ntid);
        }
      }.bind(this),
      error: function(xhr, status, err) {
        alert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getServerInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
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
            itd:data.itd
          });
          $('.qr_hidden').height($('#myapp').height());
        }
      }.bind(this),
      error: function(xhr, status, err) {
        alert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    this.getPhotos();
    this.getServerInfo();
  },
  render: function() {
    return (
        <div>
          <Waterfall item={this.state.photos} />
          <Share title={this.state.nm+"律师微相册"} desc={this.state.nm+"律师个人风采展示"} 
          imgUrl={global.img+this.state.hI}  target="photo"/>
        </div>
    );
  },
});

module.exports = Photo;
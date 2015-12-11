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
    if(!ownUri) return;
    if(!ntid||ntid == '4'){
      ntid = 10;
    }
    $.ajax({
      type:'get',
      url: global.url+'/exp/QueryWXPhotoList.do?ntId='+ntid+'&ownUri='+ownUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          this.setState({photos:data.pl});
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
  },
  render: function() {
    return (
        <div>
          <Waterfall item={this.state.photos} />
          <Share title={"王杰律师微相册"} desc={"王杰律师个人风采展示"} 
          imgUrl={global.img+"WXweb_wangjiepor.png"} target="photo"/>
        </div>
    );
  },
});

module.exports = Photo;
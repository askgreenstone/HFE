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
    if(!ownUri) return;
    $.ajax({
      type:'get',
      url: 'http://t-dist.green-stone.cn/exp/QueryWXPhotoList.do?ptId=10&ownUri='+ownUri,
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
    this.getPhotos();
  },
  render: function() {
    return (
        <div>
          <Waterfall item={this.state.photos} />
          <Share title={"王杰律师微相册"} desc={"王杰律师个人风采展示"} 
          imgUrl={"http://transfer.green-stone.cn/WXweb_wangjiepor.png"}/>
        </div>
    );
  },
});

module.exports = Photo;
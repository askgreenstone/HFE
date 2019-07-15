var React = require('react');
var Location = require('../../common/Location.react');
var CommonMixin = require('../../Mixin');
var Message = require('../../common/Message.react');

var Adress = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {ln:[]};
  },
  getServerInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    var ida = this.getUrlParams('ida');
    var exOwnUri = ownUri.replace('e','');
    $.ajax({
      type:'get',
      url: global.url+'/exp/ExpertInfo.do?ei='+exOwnUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
           this.setState({
              ln:data.ad,
              rg:data.CityCn,
              bg:data.ad
            })
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showRefresh('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.getServerInfo();
    var $body = $('body')
    document.title = '我的地址';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
  },
  render: function() {

    return (
        <div>
        <Location currentpath={this.state.ln} target={this.state.ln} region={this.state.rg} displayname={this.state.bg}/>
        <Message/>
        </div>
    );
  },
});

module.exports = Adress;
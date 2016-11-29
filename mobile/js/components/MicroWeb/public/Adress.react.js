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
    $.ajax({
      type:'get',
      url: global.url+'/usr/QueryMicroCard.do?ownUri='+ownUri+'&ida='+ida,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
           this.setState({
              ln:data.adr,
              rg:data.rg,
              bg:data.adrh
            })
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
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
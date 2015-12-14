var React = require('react');
var Location = require('../../common/Location.react');
var CommonMixin = require('../../Mixin');

var Adress = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {ln:[]};
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
              ln:data.adr,
              rg:data.rg
            })
        }
      }.bind(this),
      error: function(xhr, status, err) {
        alert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.getServerInfo();
  },
  render: function() {

    return (
        <Location currentpath={this.state.ln} target={this.state.ln} region={this.state.rg}/>
    );
  },
});

module.exports = Adress;
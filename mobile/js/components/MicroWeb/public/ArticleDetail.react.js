var React = require('react');
var CommonMixin = require('../../Mixin');
var Share = require('Share.react');
var Message = require('../../common/Message.react');

var ArticleDetail = React.createClass({
	mixins:[CommonMixin],
  getInitialState: function(){
    return {myDatas:[],uri:''};
  },
	getServerInfo: function(){
		var newUrl = '',
				nid = this.getUrlParams('nid'),
		    ntid = this.getUrlParams('ntid'),
		    ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    this.setState(uri,ownUri);
    if(nid){
    	newUrl = global.url+'/exp/QueryNewsContent.do?nId='+nid+'&ownUri='+ownUri;
    }else{
    	newUrl = global.url+'/exp/QueryNewsContent.do?ntId='+ntid+'&ownUri='+ownUri;
    }
		$.ajax({
      type:'get',
      url: newUrl,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
        	if(data.ntit){
        		$('.article_detail h3').text(data.ntit);
        	}else{
        		$('.article_detail h3').text('未设置标题');
        	}
          //如果含有nl，则优先显示
          if(data.nl){
            this.setState({webUrl:data.nl});
          }else{
            $('.ad_format').append(data.nc);
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
	},
	componentDidMount: function(){
      $('body').css({'background':'#fff'});
	    this.getServerInfo();
	},
  render: function() {
    var tempHeight = window.screen.height;
    var isShow = '';
    var hidden = '';
    if(this.state.webUrl){
      isShow = 'block';
      hidden = 'none';
    }else{
      isShow = 'none';
      hidden = 'block';
    }
    if(this.state.uri == 'e2166'){
      return (
        <div>
          <div style={{'display':hidden}}>
            <div className="article_detail">
              <h3></h3>
            </div>
            <div className="ad_format"></div>
          </div>

          <div style={{'height':tempHeight,'display':isShow}}>
            <iframe style={{'border':'0'}} src={this.state.webUrl} width="100%" height="100%"></iframe>
          </div>
          <Share title="Yulong LI Esq." desc="Yulong Li is specialized in angel investment, VC, private equity and corporate financing, has rich experiences in investment affairs and capital market.
          " imgUrl="http://transfer.green-stone.cn/49D1541AFA6993C051CACF51436712B4_W1887_H1887_S701.jpg?timestamp=1456203759749" target="card3"/>
          <Message/>
        </div>
      );
    }else {
      return (
        <div>
          <div style={{'display':hidden}}>
            <div className="article_detail">
              <h3></h3>
            </div>
            <div className="ad_format"></div>
          </div>

          <div style={{'height':tempHeight,'display':isShow}}>
            <iframe style={{'border':'0'}} src={this.state.webUrl} width="100%" height="100%"></iframe>
          </div>
          <Message/>
        </div>
      );
    }
    
  }
});

module.exports = ArticleDetail;
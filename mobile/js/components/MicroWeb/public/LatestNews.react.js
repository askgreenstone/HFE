var React = require('react');
var CommonMixin = require('../../Mixin');

var LatestNews = React.createClass({
	mixins:[CommonMixin],
  gotoLink: function(path){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    location.href = '#'+path+'?ownUri='+ownUri+'&ida='+ida;
  },
  //微信获取最先消息授权（区别于聊天授权），获取appid
  getWXNewsMsg:function(ownUri){
        var wxPath = window.location.href,
            uri = encodeURIComponent(wxPath.toString());
        $.ajax({
            type: 'get',
            url: global.url+'/usr/ThirdJSapiSignature.do?apath=' + uri,
            success: function(data) {
                // alert('wx:' + JSON.stringify(data));
                if (data.c == 1000) {
                  var temp = '';
                  var str = window.location.href;
                  if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
                    temp = 't-web';
                  }else{
                    temp = 'web';
                  }
                  location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+data.appId+'&redirect_uri=http%3a%2f%2f'+temp+'.green-stone.cn%2fusr%2fWebOauthDispatch.do&response_type=code&scope=snsapi_userinfo&state=expNews_'+ownUri+'#wechat_redirect';
                }
            },
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }
        });
  },
  render: function() {
    var ownUri = this.getUrlParams('ownUri');
    return (
    	<div className="LatestNews" style={{display:this.props.newsShow?'block':'none'}} onClick={this.getWXNewsMsg.bind(this,ownUri)}>
    		<div className="newsBox">
    			<div className="latestNewsBox">
    				<span className="newsTitle">{this.props.newsTitle}</span>
    				<span className="newsContent">{this.props.newsContent}</span>
    			</div>		
    		</div>
    		
    	</div>
    );
  }
});

module.exports = LatestNews;



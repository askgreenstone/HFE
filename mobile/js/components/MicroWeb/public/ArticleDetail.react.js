var React = require('react');
var CommonMixin = require('../../Mixin');

var ArticleDetail = React.createClass({
	mixins:[CommonMixin],
	getServerInfo: function(){
		var newUrl = '',
				nid = this.getUrlParams('nid'),
		    ntid = this.getUrlParams('ntid'),
		    ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
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
        // console.log(data);
        if(data.c == 1000){
        	if(data.ntit){
        		$('.article_detail h3').text(data.ntit);
        	}else{
        		$('.article_detail h3').text('未设置标题');
        	}
          $('.ad_format').append(data.nc);
         }
      }.bind(this),
      error: function(xhr, status, err) {
        alert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
	},
	componentDidMount: function(){
      $('body').css({'background':'#fff'});
	    this.getServerInfo();
	},
  render: function() {
    return (
    	<div>
    		<div className="article_detail">
	    		<h3></h3>
	    	</div>
    		<div className="ad_format"></div>
    	</div>
    );
  }
});

module.exports = ArticleDetail;
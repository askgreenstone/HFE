var React = require('react');

var ArticleDetail = React.createClass({
	getUrlParams: function(p){
    var url = location.href; 
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
    var paraObj = {} ;
    for (var i=0,j=0; j=paraString[i]; i++){ 
      paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
    } 
    var returnValue = paraObj[p.toLowerCase()]; 
    if(typeof(returnValue)=="undefined"){ 
      return ""; 
    }else{ 
      return  returnValue;
    } 
  },
  componentDidMount: function(){
    
  },
	getServerInfo: function(){
		var newUrl = '',
				nid = this.getUrlParams('nid'),
		    ntid = this.getUrlParams('ntid'),
		    ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = 'e1107';
    }
    if(nid){
    	newUrl = 'http://t-dist.green-stone.cn/exp/QueryNewsContent.do?nId='+nid+'&uri='+ownUri+'&debug=1&utype=1';
    }else{
    	newUrl = 'http://t-dist.green-stone.cn/exp/QueryNewsContent.do?ntId='+ntid+'&uri='+ownUri+'&debug=1&utype=1';
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
    $('body').css('backgroundColor','#fff');
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
  },
});

module.exports = ArticleDetail;
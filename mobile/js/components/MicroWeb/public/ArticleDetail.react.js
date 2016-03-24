var React = require('react');
var CommonMixin = require('../../Mixin');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');
var Password = require('../../common/Password.react');

var ArticleDetail = React.createClass({
	mixins:[CommonMixin],
  getInitialState: function(){
    return {
      myDatas:[],
      uri:'',
      shareTitle:'',
      shareDesc:'',
      shareImg:'',
      uname:'',
      utitle:'',
      uvalue:'',
      uid:''
    };
  },
	getServerInfo: function(){
		var newUrl = '',
				nid = this.getUrlParams('nid'),
		    ntid = this.getUrlParams('ntid'),
		    ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    this.setState({uri:ownUri});
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
            this.setState({shareTitle:data.ntit});
        	}else{
        		$('.article_detail').hide();
        	}
          //如果含有nl，则优先显示
          if(data.nl){
            this.setState({webUrl:data.nl});
          }else{
            $('.ad_format').append(data.nc);
          }
          // alert(this.getCotentSrc(data.nc));
          //设置分享信息
          console.log(this.removeHTMLTag(data.nc));
          this.setState({shareDesc:this.removeHTMLTag(data.nc)});
          this.setState({shareImg:this.getCotentSrc(data.nc)});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
	},
  getCotentSrc: function(str){
    if(!str) return;
    var urls = [];
    var imgReg = /<img.*?(?:>|\/>)/gi;
    //匹配src属性
    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arr = str.match(imgReg);
    if(arr){
      for (var i = 0; i < arr.length; i++) {
        var src = arr[i].match(srcReg);
        //获取图片地址
        if(src[1]){
           urls.push(src[1]);
        }
      }
    }
    // alert(urls);
    if(urls.length>0){
      return urls[0];
    }else{
      return 'image/default3.png'
    }
  },
  checkUserLimit: function(){
    var newUrl = '',
        nid = this.getUrlParams('nid'),
        ntid = this.getUrlParams('ntid'),
        ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    this.setState({uri:ownUri});
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
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          //查询用户密码权限接口
          if(data.vt == 2){
            this.setState({
              uname:data.ntId,
              utitle:data.ntit,
              uvalue:data.vp,
              uid:data.nId
            })
          // console.log(this.state.utitle);
            this.showLimitBox(true);
          }else{
            this.getServerInfo();
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
      }.bind(this)
    });
  },
  showLimitBox: function(flag){
    console.log(this.state.utitle);
    $('#limit_password_box').attr({
      'title':this.state.utitle,
      'value':this.state.uvalue,
      'name':this.state.uname,
      'alt':this.state.uid
    });

    if(flag){
      $('#limit_password_box').show();
    }
  },
	componentDidMount: function(){
    $('body').css({'background':'#fff'}); 
    this.getServerInfo();
    // var nid = this.getUrlParams('nid');
    // if(!nid) return;
    // if(!sessionStorage.getItem('user_token_'+nid)){
    //   // console.log('aa user_token_'+ntid);
    //   this.checkUserLimit();
    //   $('.password_shadow').parent('#limit_password_box').show();
    // }else{
    //   this.getServerInfo();
    // }
	},
  componentWillMount: function(){
    // this.getServerInfo();
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
          <Share title="Yulong LI Esq." desc="Specialized in PE, VC, Funds, Corporate and Investment" 
          imgUrl="http://transfer.green-stone.cn/49D1541AFA6993C051CACF51436712B4_W1887_H1887_S701.jpg?timestamp=1456203759749" target="card3"/>
          <Message/>
        </div>
        )
    }else{
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

          <Share title={this.state.shareTitle} desc={this.state.shareDesc} 
        imgUrl={this.state.shareImg} target="articleDetail"/>
          <Message/>
          <div id="limit_password_box" title={this.state.utitle} value={this.state.uvalue} name={this.state.uname} alt={this.state.uid} type="articleDetail">
            <Password display="true"/>
          </div>
        </div>
        );
    }  
  }
});

module.exports = ArticleDetail;

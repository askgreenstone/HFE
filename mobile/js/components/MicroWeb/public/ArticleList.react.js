var React = require('react');
var CommonMixin = require('../../Mixin');
var List1 = require('../../layout/List1.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

var ArticleList = React.createClass({
	mixins:[CommonMixin],
  getInitialState: function(){
    return {
      shareTitle:'',
      shareDesc:'',
      shareImg:''
    };
  },
  getCotentSrc: function(str){
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
  onlyToSetShareInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    var ntid = this.getUrlParams('ntid');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    if(!ntid) return;
    $.ajax({
        type:'get',
        url: global.url+'/exp/QueryNewsList.do?ntId='+ntid+'&ownUri='+ownUri+'&ida='+ida,
        success: function(data) {
          // alert(JSON.stringify(data));
          console.log(data);
          // alert('ownUri:'+ownUri+'ntid:'+ntid);
          if(data.c == 1000){
            if(data.nl.length>0){
              this.setState({
                  shareTitle:data.nl[0].ntit,
                  shareDesc:this.removeHTMLTag(data.nl[0].nc),
                  shareImg:this.getCotentSrc(data.nl[0].nc)
              });
            }else{
              this.setState({
                shareTitle:'我的名片',
                shareDesc:'欢迎访问我的名片！这里有我的职业介绍和成就!',
                shareImg:global.img+'batchdeptlogo20160811_W108_H108_S15.png'
              });
            }
             // alert(this.state.shareTitle);
           }
        }.bind(this),
        error: function(xhr, status, err) {
          this.showRefresh('系统开了小差，请刷新页面');
        }.bind(this)
      });
  },
  goHome: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    console.log(global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri);
    // alert(global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri);
    window.location.href = global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri+'&ida='+ida;
  },
  getIndexTheme: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/QueryMicWebInfo.do?ownUri='+ownUri+'&ida='+ida,
      success: function(data) {
          console.log(data);
          if(data.c == 1000){
            this.setState({
              indexTheme: data.url
            })
          }
      }.bind(this),
      error: function(data) {
          // console.log(data);
          alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  componentDidMount: function(){
    var $body = $('body')
    document.title = '列表';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
    // this.onlyToSetShareInfo();
  },
  componentWillMount: function(){
    this.onlyToSetShareInfo();
    this.getIndexTheme();
  },
  render: function() {
    return (
    <div>
      <List1/>
      <Share ref="myShareTest" title={this.state.shareTitle} desc={this.state.shareDesc} imgUrl={this.state.shareImg} target="articleList"/>
      <div className="ad_goHome" onClick={this.goHome}>
        <img src="image/home.png"/>
      </div>
      <Message/>
    </div>
    );
  },
});

module.exports = ArticleList;
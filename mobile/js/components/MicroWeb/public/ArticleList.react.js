var React = require('react');
var CommonMixin = require('../../Mixin');
var List1 = require('../../layout/List1.react');
var Share = require('../../common/Share.react');

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
    if(!ntid) return;
    $.ajax({
        type:'get',
        url: global.url+'/exp/QueryNewsList.do?ntId='+ntid+'&ownUri='+ownUri,
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
                shareTitle:'我的工作室',
                shareDesc:'欢迎访问我的工作室！这里有我的职业介绍和成就!',
                shareImg:global.img+'greenStoneicon300.png'
              });
            }
             // alert(this.state.shareTitle);
           }
        }.bind(this),
        error: function(xhr, status, err) {
          this.showAlert('系统开了小差，请刷新页面');
        }.bind(this)
      });
  },
  goHome: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    console.log(global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri);
    // alert(global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri);
    window.location.href = global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri;
  },
  getIndexTheme: function(){
    var ownUri = this.getUrlParams('ownUri');
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/QueryMicWebInfo.do?ownUri='+ownUri,
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
    // this.onlyToSetShareInfo();
  },
  componentWillMount: function(){
    this.onlyToSetShareInfo();
    this.getIndexTheme();
  },
  render: function() {
  	// var tempNode = '';
  	// if(this.state.shareTitle){
  	// 	tempNode = <Share title={this.state.shareTitle} desc={this.state.shareDesc} imgUrl={this.state.shareImg} target="articleList"/>;
  	// }else{
  	// 	// tempNode = <Share title="工作室" desc="这是一个律师工作室，由绿石开发提供技术支持！" imgUrl={global.url+'greenStoneicon300.png'} target="articleList"/>;
  	// }  
  	// console.log(this.state.shareTitle+'@'+this.state.shareDesc+'@'+this.state.shareImg);
    return (
    <div>
      <List1/>
      <Share ref="myShareTest" title={this.state.shareTitle} desc={this.state.shareDesc} imgUrl={this.state.shareImg} target="articleList"/>
      <div className="ad_goHome" onClick={this.goHome}>
        <img src="image/home.png"/>
      </div>
    </div>
    );
  },
});

module.exports = ArticleList;
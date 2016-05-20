var React = require('react');
var CommonMixin = require('../../Mixin');
var List1 = require('../../layout/List1.react');
var Share = require('../../common/Share.react');

var Global_share_arr = [];
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
            Global_share_arr = data.nl;
             // alert(this.state.shareTitle);
           }
        }.bind(this),
        error: function(xhr, status, err) {
          this.showAlert('网络连接错误或服务器异常！');
        }.bind(this)
      });
  },
  componentDidMount: function(){
    // this.onlyToSetShareInfo();
    if(Global_share_arr.length>0){
      this.setState({
          shareTitle:Global_share_arr[0].ntit,
          shareDesc:this.removeHTMLTag(Global_share_arr[0].nc),
          shareImg:this.getCotentSrc(Global_share_arr[0].nc)
      });
    }else{
      this.setState({
        shareTitle:'绿石微网站',
        shareDesc:'绿石微网站，由绿石开发提供技术支持！',
        shareImg:'greenStoneicon300.png'
      });
    }
  },
   componentWillMount: function(){
    this.onlyToSetShareInfo();
  },
  render: function() {
  	// var tempNode = '';
  	// if(this.state.shareTitle){
  	// 	tempNode = <Share title={this.state.shareTitle} desc={this.state.shareDesc} imgUrl={this.state.shareImg} target="articleList"/>;
  	// }else{
  	// 	// tempNode = <Share title="微网站" desc="这是一个律师微网站，由绿石开发提供技术支持！" imgUrl={global.url+'greenStoneicon300.png'} target="articleList"/>;
  	// }  
  	// console.log(this.state.shareTitle+'@'+this.state.shareDesc+'@'+this.state.shareImg);
    return (
    <div>
      <List1/>
      <Share ref="myShareTest" title={this.state.shareTitle} desc={this.state.shareDesc} imgUrl={this.state.shareImg} target="articleList"/>
    </div>
    );
  },
});

module.exports = ArticleList;
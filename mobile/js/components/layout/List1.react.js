var React = require('react');
var CommonMixin = require('../Mixin');

var List1 = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {articles:[],curSrc:[]};
  },
  gotoDetail: function(nid){
    var ownUri = this.getUrlParams('ownUri');
    location.href = '#articleDetail?nid='+nid+'&ownUri='+ownUri;
  },
  getServerInfo: function(){
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
        if(data.c == 1000){
           var tempObj = [];
           //从内容中抓取图片，作为默认显示
           for(var i=0;i<data.nl.length;i++){
             // setTimeout(function(){
             //      tempObj.push(this.getCotentSrc(data.nl[i].nc));
             // },300);
             tempObj.push(this.getCotentSrc(data.nl[i].nc));
           }
           console.log(tempObj);
           // alert(tempObj);
           this.setState({articles:data.nl,curSrc:tempObj});
         }
      }.bind(this),
      error: function(xhr, status, err) {
        alert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getCotentSrc: function(str){
    var m,
    urls = [], 
    rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;

    while (m = rex.exec(str)) {
        urls.push(m[1]);
    }
    // console.dir(urls);
    if(urls.length>0){
      return urls[0];
    }else{
      return 'image/default.png'
    }
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    this.getServerInfo();
  },
  render: function() {
    var legend;
    if(this.props.legend){
      legend = <h3>最新文章</h3>;
    }
    var articleNodes = this.state.articles.map(function(item,i){
     if(item.ns == '1'){
      return(
            <li key={new Date().getTime()+i} onClick={this.gotoDetail.bind(this,item.nId)}>
              <img src={this.state.curSrc[i]} width="70" height="70"/>
              <span>{item.ntit.length>12?(item.ntit).substring(0,12)+'...':item.ntit}</span>
              <p>{item.na?(item.na.length>30?(item.na).substring(0,30)+'...':item.na):'暂无摘要'}</p>
            </li>
       );
      }
     }.bind(this));
    return (
      <div>
        <ul className="article_list">
          {legend}
          {articleNodes}
        </ul>
      </div>
    );
  },
});

module.exports = List1;
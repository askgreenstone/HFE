var React = require('react');
var CommonMixin = require('../Mixin');
var Message = require('../common/Message.react');
var Password = require('../common/Password.react');
var Share = require('../common/Share.react');

var List1 = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      articles:[],
      curSrc:[],
      uname:'',
      utitle:'',
      uvalue:'',
      shareTitle:'',
      shareDesc:'',
      shareImg:''
    };
  },
  gotoDetail: function(ntid,nid,url){
    // var ntid = this.getUrlParams('ntid');
    // if(ntid) return;
    if(url){
      location.href = url;
    }else{
      var ownUri = this.getUrlParams('ownUri');
      sessionStorage.setItem('user_token_'+ntid,ntid);
      location.href = '#articleDetail?nid='+nid+'&ownUri='+ownUri+'&ntid='+ntid;
    }
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
          // alert('ownUri:'+ownUri+'ntid:'+ntid);
          if(data.c == 1000){
             var tempObj = [];
             //从内容中抓取图片，作为默认显示
             for(var i=0;i<data.nl.length;i++){
               tempObj.push(this.getCotentSrc(data.nl[i].nc));
             }
             this.setState({articles:data.nl,curSrc:tempObj});
             
             if(data.nl.length > 0){
                this.setState({
                  shareTitle:data.nl[0].ntit,
                  shareDesc:this.removeHTMLTag(data.nl[0].nc),
                  shareImg:this.getCotentSrc(data.nl[0].nc)
                });
             }else{
                this.setState({
                  shareTitle:'微网站首页',
                  shareDesc:'这是一个律师微网站，由绿石开发提供技术支持！',
                  shareImg:'http://transfer.green-stone.cn/greenStoneicon300.png'
                })
             }
           }
        }.bind(this),
        error: function(xhr, status, err) {
          this.showAlert('网络连接错误或服务器异常！');
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
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
  checkUserLimit: function(){
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
          //查询用户密码权限接口
          if(data.nl.length>0 && data.nl[0].vt == 2){
            this.setState({
              uname:data.nl[0].ntId,
              utitle:data.nl[0].mn,
              uvalue:data.nl[0].vp
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
    // $('.password_shadow').parent('#limit_password_box').show();
    // console.log(this.state.utitle);
    $('#limit_password_box').attr({
      'title':this.state.utitle,
      'value':this.state.uvalue,
      'name':this.state.uname
    });

    if(flag){
      $('#limit_password_box').show();
    }
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});

    var ntid = this.getUrlParams('ntid');
    if(!ntid) return;
    if(!sessionStorage.getItem('user_token_'+ntid)){
      // console.log('aa user_token_'+ntid);
      this.checkUserLimit();
    }else{
      this.getServerInfo();
    }
  },
  render: function() {
    var legend;
    if(this.props.legend){
      legend = <h3>最新文章</h3>;
    }
    var articleNodes = this.state.articles.map(function(item,i){
     if(item.ns == '1'){
      return(
            <li key={new Date().getTime()+i} onClick={this.gotoDetail.bind(this,item.ntId,item.nId,item.refUrl)}>
              <b><img src={this.state.curSrc[i]} width="" height="100%"/></b>
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
        <Share title={this.state.shareTitle} desc={this.state.shareDesc} 
        imgUrl={this.state.shareImg} target="articleList"/>
        <Message/>
        <div id="limit_password_box" title={this.state.utitle} value={this.state.uvalue} name={this.state.uname} type="articleList">
          <Password display="true"/>
        </div>
      </div>
    );
    
  },
});

module.exports = List1;
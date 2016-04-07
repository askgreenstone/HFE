var React = require('react');
var CommonMixin = require('../Mixin');
var Message = require('../common/Message.react');
var Password = require('../common/Password.react');

var number = 1;
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
      shareImg:'',
      count:10,
      page:0,
      hasMore:true
    };
  },
  gotoDetail: function(ntid,nid,url){
    // var ntid = this.getUrlParams('ntid');
    // if(ntid) return;
    if(url){
      location.href = url;
    }else{
      var ownUri = this.getUrlParams('ownUri');
      localStorage.setItem('user_token_'+ntid,ntid);
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
           }
        }.bind(this),
        error: function(xhr, status, err) {
          this.showAlert('网络连接错误或服务器异常！');
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
  },
  getPageInfo: function(){
    console.log('number:'+number);
    var ownUri = this.getUrlParams('ownUri');
    var ntid = this.getUrlParams('ntid');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    if(!ntid) return;
    // console.log('number:'+number);
    $.ajax({
        type:'get',
        url: global.url+'/exp/QueryNewsList.do?ntId='+ntid+'&ownUri='+ownUri+'&pn='+number+'&ps='+this.state.count,
        success: function(data) {
          // alert(JSON.stringify(data));
          console.log(data);
          // alert('ownUri:'+ownUri+'ntid:'+ntid);
          if(data.c == 1000){
            console.log(number);
            if(number > Math.ceil(data.tc/this.state.count)-1|| Math.ceil(data.tc/this.state.count) == 1){
              this.setState({
                hasMore:false
              });
              // return;
            }
           //从内容中抓取图片，作为默认显示
           // var tempObj = [];
           for(var i=0;i<data.nl.length;i++){
             // tempObj.push(this.getCotentSrc(data.nl[i].nc));
             this.state.curSrc.push(this.getCotentSrc(data.nl[i].nc));
           }
           this.setState({
              articles: this.state.articles.concat(data.nl),
              curSrc: this.state.curSrc
           });
           number++;
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
            // this.getServerInfo();
            this.getPageInfo();
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
  //查询后台用户密码
  getServerPsw:function(){
    var ownUri = this.getUrlParams('ownUri');
    var ntid = this.getUrlParams('ntid');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    if(!ntid) return;
    var tempPsw = '';
    $.ajax({
      type:'get',
      async: false,
      url: global.url+'/exp/QueryNewsList.do?ntId='+ntid+'&ownUri='+ownUri,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          if(data.nl.length>0){
            tempPsw = data.nl[0].vp;
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
      }.bind(this)
    });
    return tempPsw;
  },
  componentDidMount: function(){
    // 清空分页信息记录
    number = 1;
    $('body').css({'background':'#ebebeb'});
    var ntid = this.getUrlParams('ntid');
    if(!ntid) return;
    if(!localStorage.getItem('user_token_'+ntid)){
      // console.log('aa user_token_'+ntid);
      this.checkUserLimit();
    }else{
      // this.getServerInfo();
      if(localStorage.getItem('user_psw_'+ntid) == this.getServerPsw()){
        this.getPageInfo();
      }else{
        this.checkUserLimit();
      }
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
        <p>&nbsp;</p>
        <div style={{'display':this.state.hasMore?'block':'none'}} className="myListLoader" onClick={this.getPageInfo}>查看更多</div>
        <p>&nbsp;</p>
        <Message/>
        <div id="limit_password_box" title={this.state.utitle} value={this.state.uvalue} name={this.state.uname} type="articleList">
          <Password display="true"/>
        </div>
      </div>
    );
    
  },
});

module.exports = List1;
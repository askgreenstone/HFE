var React = require('react');
var CommonMixin = require('../../Mixin');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');
Date.prototype.Format = function(fmt){ //author: meizz
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  console.log(today.getTime());
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };  
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 
var Dynamic = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      datas: [],
      Abstract: '',
      Title: '',
      Introduction: '',
      Img: '',
      expMessage: {},
      imgLists: [],
      head: '',
      nm: '',
      time: '',
      niceNo: '',
      contentNo: '',
      readNo: '',
      expTitle: '',
      expContent: '',
      usrContents: [],
      praiseFlag: false
    };
  },
  gotoLink: function(path){
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri');
  },
  gotoTimeAxis: function(){
    var ownUri = this.getUrlParams('ownUri');
    var session = this.getUrlParams('session');
    var usrUri = this.getUrlParams('usrUri');
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    var idf = this.getUrlParams('idf')?this.getUrlParams('idf'):0;
    location.href = '#/TimeAxis?ownUri='+ownUri+'&session='+session+'&usrUri='+usrUri+'&ida='+ida+'&idf='+idf;
  },
  getDate: function(time){
    var now = new Date().getTime();
    var result = (now - time)/1000/60/60/24;
    if(result >=1){
      return Math.floor(result) + '天前';
    }else if(result*24<0.25){
      return '刚刚';
    }else{
      return Math.floor(result*24) + '小时前';
    }
  },
  getDynamicComment: function(){
    var fid = this.getUrlParams('fid');
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/FeedDetail.do?fid='+fid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          this.setState({
            head: data.r.fl[0].p?data.r.fl[0].p:'header.jpg',
            nm: data.r.fl[0].nm,
            time: data.r.fl[0].ts,
            niceNo: data.r.fl[0].rl?data.r.fl[0].rl.length:0,
            contentNo: data.r.fl[0].cl?data.r.fl[0].cl.length:0,
            readNo: data.r.fl[0].readnum?data.r.fl[0].readnum:0,
            expTitle: data.r.fl[0].title,
            expContent: data.r.fl[0].content,
            imgLists: data.r.fl[0].il.slice(0,2),
            usrContents: data.r.fl[0].cl?data.r.fl[0].cl:[],
            esl: data.r.fl[0].esl,
            Title: data.r.fl[0].title,
            Introduction: data.r.fl[0].content,
            Img: data.r.fl[0].il[0]
          })
          console.log(data.r.fl[0].content);
          // var top = $('.dynamic_contaniner')[0].scrollHeight;
          // $('.dynamic_contaniner').scrollTop(top);
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
          alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  getAllImages: function(){
    var session = this.getUrlParams('session');
    var fid = this.getUrlParams('fid');
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/FeedDetail.do?fid='+fid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          this.setState({
            imgLists: data.r.fl[0].il,
            niceNo: data.r.fl[0].rl?data.r.fl[0].rl.length:0,
            usrContents: data.r.fl[0].cl?data.r.fl[0].cl:[],
            contentNo: data.r.fl[0].cl?data.r.fl[0].cl.length:0
          })
          console.log(data.r.fl[0].content);
          // var top = $('.dynamic_contaniner')[0].scrollHeight;
          // $('.dynamic_contaniner').scrollTop(top);
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
          alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  callength: function(str){
    var byteLen = 0, len = str.length;
    if( !str ) return 0;
    for( var i=0; i<len; i++){
      byteLen += str.charCodeAt(i) > 255 ? 2 : 1;
    }
    return byteLen/2;
  },
  getUsrPraise: function(){
    var session = this.getUrlParams('session');
    var fid = this.getUrlParams('fid');
    var usrUri = this.getUrlParams('usrUri');
    var arr = [];
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/FeedDetail.do?fid='+fid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          arr = data.r.fl[0].rl;
          if(arr){
            for(var i=0;i<arr.length;i++){
              if(usrUri == arr[i].uri){
                this.setState({
                  praiseFlag: true
                })
              }
            }
          }else{
            this.setState({
              praiseFlag: false
            })
          }
          
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
          alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  wirteComment: function(){
    $('.dynamic_usr_write').show();
    console.log($('.dynamic_top'));
    var top = $('.dynamic_top')[0].scrollHeight;
    $('.dynamic_top').scrollTop(top);
  },
  setComment: function(){
    var val = $('.dynamic_usr_write textarea').val();
    var session = this.getUrlParams('session');
    var fid = this.getUrlParams('fid');
    if(!val){
      alert('请输入要发送的内容！');
      return;
    }else if(this.callength(val) >= 1000){
      alert('你输入的内容过长！')
    }else{
      var data = {
        fid: fid,
        c: val,
        t: 0
      }

      // fid: long 被评论的Feed id    c: string 回复内容   t: int 0：评论，1：点赞,2:取消赞
      $.ajax({
        type: 'POST',
        url: global.url+'/usr/CommentFeed.do?session='+session,
        data: JSON.stringify(data),
        success: function(data) {
          console.log(data);
          if(data.c == 1000){
            $('.dynamic_usr_write').hide();
            $('.dynamic_usr_write textarea').val('');
            // $('.dynamic_exp_chat').css({'position':'absolute','height':'7rem','padding':'0.5rem 1rem','display':'-webkit-box'});
            // this.dynamicBindScroll();
            this.getAllImages();
            setTimeout(function(){
              var top = $('.dynamic_top')[0].scrollHeight;
              $('.dynamic_top').scrollTop(top);
            },500)
          }
        }.bind(this),
        error: function(data) {
            // console.log(data);
            alert('系统开了小差，请刷新页面');
        }.bind(this)
      })
    }
  },
  setPraise: function(){
    var flag = $('.dynamic_usr_img').hasClass('dynamic_usr_img_nice');
    var session = this.getUrlParams('session');
    var fid = this.getUrlParams('fid');
    if(flag){
      alert('已经点过赞了！')
    }else{
      
      var data = {
        fid: fid,
        t: 1
      }
      // fid: long 被评论的Feed id    c: string 回复内容   t: int 0：评论，1：点赞,2:取消赞
      $.ajax({
        type: 'POST',
        url: global.url+'/usr/CommentFeed.do?session='+session,
        data: JSON.stringify(data),
        success: function(data) {
          console.log(data);
          if(data.c == 1000){
            this.getAllImages();
            $('.dynamic_usr_img').addClass('dynamic_usr_img_nice');
          }
        }.bind(this),
        error: function(data) {
            // console.log(data);
            alert('系统开了小差，请刷新页面');
        }.bind(this)
      })
    }
  },
  transferArr: function(str){
    var arr =[]; 
    var descArr = [];
    arr = str?str.replace(/\[/,"").replace(/\]/g,"").split(","):[];
    // arr = JSON.parse(str);
    // console.log(arr);
    var eilArr = ['','公司企业','资本市场','证券期货','知识产权','金融保险','合同债务','劳动人事','矿业能源','房地产','贸易','海事海商','涉外','财税','物权','婚姻家庭','侵权','诉讼仲裁','刑事','破产','新三板','反垄断','家族财富','交通事故','医疗','人格权','其他'];
    for(var i = 0; i<arr.length; i++){
      if(arr[i] == 99){
        descArr.push('其他')
      }else{
        descArr.push(eilArr[arr[i]])
      }
    }
    if(descArr.length == 0){
      descArr = ['公司企业','资本市场','证券期货']
    }
    var lawyerArr = descArr.slice(0,3);
    // console.log(descArr);
    return lawyerArr.join(" ");
  },
  gotoConsult:function(){
    var session = this.getUrlParams('session');
    var ownUri = this.getUrlParams('ownUri');
    var usrUri = this.getUrlParams('usrUri');
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    var st = this.getUrlParams('st')?this.getUrlParams('st'):3;
    // st  3  入口为个人工作室入口
    var data = {
      t: 99,
      ml: [ownUri,usrUri],
      st: st
    }
    $.ajax({
      type: 'POST',
      url: global.url+'/usr/CreateGroup.do?session='+session,
      data: JSON.stringify({
        t: 99,
        ml: ['e1584','u10179'],
        st: 3
      }),
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          window.location.href = global.url + '/coop/askLawyers/view/chatList.html?session='+session+'&groupId='+data.gi+'&ownUri='+ownUri+'&status=chatLawyers&usrUri='+usrUri+'&ida='+ida;
        }
        // this.getDynamicComment()
      }.bind(this),
      error: function(data) {
          // console.log(data);
          alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  gotoIndex: function(){
    var ownUri = this.getUrlParams('ownUri');
    var ida = this.getUrlParams('ida');
    $.ajax({
      type: 'post',
      url: global.url+'/usr/ThirdHomePage.do?ownUri='+ownUri+'&ida=0',
      success: function(data) {
        console.log(data);
        if(data.c == 1999){
          alert('该律师还没有创建个人工作室');
        }else if(data.c == 1000){
          window.location.href = global.url+'/usr/ThirdHomePage.do?ownUri='+ownUri+'&ida=0';
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  componentDidMount: function(){
    $('body').css({'background':'#fff'});
    var that = this;
    setTimeout(function(){
      console.log('这是标题：'+that.state.expTitle);
      document.title = that.state.expTitle;
    },300)
    console.log(this.state.Abstract);
    var that = this;
    var getImageFlag = false;
    $('.dynamic_top').scroll(function(){
      // console.log($('.dynamic_top'));
      if(!getImageFlag){
        getImageFlag = true;
        that.getAllImages();
      }
      // console.log($('.dynamic_top')[0].scrollHeight);
    })
    // this.dynamicBindScroll();
  },
  componentWillMount:function(){
    document.title = '';
    var refresh = this.getUrlParams('refresh');
    var ownUri = this.getUrlParams('ownUri');
    var ida = this.getUrlParams('ida');
    var idf = this.getUrlParams('idf');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var fid = this.getUrlParams('fid');
    var session = this.getUrlParams('session');
    var usrUri = this.getUrlParams('usrUri');

    this.getDynamicComment();
    this.getUsrPraise();
  }, 
  render: function() {
    var ShareTitile = this.state.Title;
    var ShareDesc = this.state.Introduction;
    var ShareImg = this.state.Img;
    var ownUri = this.getUrlParams('ownUri');
    var fid = this.getUrlParams('fid');
    var temp,appid,ShareUrl;
    // 时间轴，动态详情页面分享需要授权
    var str = window.location.href;
    if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
        temp = 't-web';
        appid = 'wx2858997bbc723661';
      }else{
        temp = 'web';
        appid = 'wx73c8b5057bb41735';
      }
    ShareUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri=http%3a%2f%2f'+temp+'.green-stone.cn%2fusr%2fWeiXinWebOAuthDispatch.do&response_type=code&scope=snsapi_userinfo&state=expNewsDetail_'+ownUri+'_'+fid+'_0'+'#wechat_redirect';
    var imgList = this.state.imgLists.map(function(item,i){
      return(
        <img key={new Date().getTime()+i} src={global.img+item+'@400w'}/>
       );
    }.bind(this));
    var usrContent = this.state.usrContents.map(function(item,i){
      return(
        <div key={new Date().getTime()+i} className={i == 0?"dynamic_exp_top":"dynamic_exp_top dynamic_exp_top_abs"}>
          <img className="dynamic_exp_img_abs" src={item.p?(global.img+item.p):(global.img+'header.jpg')} width="40" height="40"/>
          <div className="dynamic_exp_name_abs">
            <span className="dynamic_exp_name_title">{item.nm}</span>
            <span className="dynamic_exp_date">{new Date(item.ts).Format("yyyy-MM-dd")}</span>
            <div className="dynamic_usr_word"><pre>{item.c}</pre></div>
          </div>
        </div>
       );
    }.bind(this));
    return (
      <div className="dynamic_contaniner">
        <div className="dynamic_top">
          <div className="dynamic_exp">
            <div className="dynamic_exp_content">
              <div className="dynamic_exp_title">{this.state.expTitle}</div>
              <div className="dynamic_exp_top">
                <p className="dynamic_exp_name">
                  <span className="dynamic_exp_date">{new Date(this.state.time).Format("yyyy-MM-dd")} 发布</span>
                </p>
                <p className="dynamic_exp_nice">
                  <i className="gotoTimeAxis" onClick={this.gotoTimeAxis}>更多动态</i> 
                </p>            
              </div>
              <div className="dynamic_exp_word"><pre>{this.state.expContent}</pre></div>
              <div className="dynamic_exp_imgs">
                {imgList}
              </div>
            </div>
          </div>
          <div className="dynamic_usr_news">
            <span className="dynamic_usr_latest"></span>
            <span className="dynamic_usr_read">{this.state.readNo}</span>
            <span className={this.state.praiseFlag?"dynamic_usr_img dynamic_usr_img_nice":"dynamic_usr_img"} onClick={this.setPraise}>{this.state.niceNo}</span>
            <span className="dynamic_usr_wc" onClick={this.wirteComment}>{this.state.contentNo}</span>
          </div>
          <div className="dynamic_usr_content_title">最新评论</div> 
          <div className="dynamic_usr_content">
            {usrContent}         
          </div>
          <div className="dynamic_blank_box"></div>
          
        </div>
        <div className="dynamic_usr_content dynamic_usr_write">
          <div className="dynamic_usr_box">
            <textarea placeholder="写评论..."></textarea>
            <span onClick={this.setComment}>发送</span>
          </div>
        </div>
        <div className="dynamic_bot">
          <div className="dynamic_exp_top dynamic_exp_chat">
            <img className="dynamic_exp_img" onClick={this.gotoIndex} src={global.img+this.state.head} width="50" height="50"/>
            <p className="dynamic_exp_name">
              <span className="dynamic_exp_name_name">{this.state.nm}</span><br/>
              <span className="dynamic_exp_date">擅长{this.transferArr(this.state.esl)}</span>
              <span className="dynamic_usr_consult" onClick={this.gotoConsult} ><span>在线</span><span>咨询</span></span>
            </p>
          </div>
        </div>       
        <Share title={ShareTitile} desc={ShareDesc} imgUrl={global.img+ShareImg} target="Dynamic" targetUrl={ShareUrl}/>
      </div>
    )
  }
});

module.exports = Dynamic;
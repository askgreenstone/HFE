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
      expTitle: '',
      expContent: '',
      usrContents: [],
      praiseFlag: false
    };
  },
  gotoLink: function(path){
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri');
  },
  getShareInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    $.ajax({
      type:'get',
      url: global.url+'/usr/GetMicWebShareInfo.do?ou='+ownUri+'&st=1&ida='+ida,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          // console.log(data.sil[0].spu)
          if(data.sil.length>0){
            this.setState({
              Title:data.sil[0].sti,
              Introduction:data.sil[0].sd,
              Img:data.sil[0].spu
            });
          }else{
            this.setState({
              Title:'我的工作室',
              Introduction:'欢迎访问我的工作室！这里有我的职业介绍和成就',
              Img:'greenStoneicon300.png'
            });
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  goHome: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
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
    var session = this.getUrlParams('session');
    var fid = this.getUrlParams('fid');
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/FeedDetail.do?session='+session+'&fid='+fid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          this.setState({
            head: data.r.fl[0].p?data.r.fl[0].p:'header.jpg',
            nm: data.r.fl[0].nm,
            time: data.r.fl[0].ts,
            niceNo: data.r.fl[0].rl?data.r.fl[0].rl.length:0,
            contentNo: data.r.fl[0].cl?data.r.fl[0].cl.length:0,
            expTitle: data.r.fl[0].title,
            expContent: data.r.fl[0].content,
            imgLists: data.r.fl[0].il,
            usrContents: data.r.fl[0].cl?data.r.fl[0].cl:[],
            esl: data.r.fl[0].esl
          })
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
          alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  getUsrPraise: function(){
    var session = this.getUrlParams('session');
    var fid = this.getUrlParams('fid');
    var usrUri = this.getUrlParams('usrUri');
    var arr = [];
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/FeedDetail.do?session='+session+'&fid='+fid,
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
    $('.dynamic_exp_chat').hide();
    $('.dynamic_top').unbind('scroll');
  },
  setComment: function(){
    var val = $('.dynamic_usr_write textarea').val();
    var session = this.getUrlParams('session');
    var fid = this.getUrlParams('fid');
    if(!val){
      alert('请输入要发送的内容！');
      return;
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
            $('.dynamic_exp_chat').css({'position':'absolute','height':'7rem','padding':'0.5rem 1rem','display':'-webkit-box'});
            this.dynamicBindScroll();
            this.getDynamicComment();
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
      $('.dynamic_usr_img').addClass('dynamic_usr_img_nice');
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
            this.getDynamicComment()
          }
        }.bind(this),
        error: function(data) {
            // console.log(data);
            alert('系统开了小差，请刷新页面');
        }.bind(this)
      })
    }
  },
  dynamicBindScroll: function(){
    $(document).ready(function() {
      $('.dynamic_contaniner').bind('scroll',function() {
        var top = $(this)[0].scrollTop;
        var height = $('.dynamic_contaniner')[0].scrollHeight;
        var winH = $(window).height();
        console.log(top);
        console.log(height);
        var scrollHeight = $('.dynamic_top')[0].scrollHeight;
        if(top == 0){
          $('.dynamic_exp_chat').css({'position':'absolute','display':'-webkit-box'});
        }else if(top + winH + 100 < height){
          $('.dynamic_exp_chat').css({'display':'none'});
        }else{
          $('.dynamic_exp_chat').css({'position':'relative','display':'-webkit-box'});
        }
        // console.log($('.dynamic_top')[0].scrollHeight)
      });
    });
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
    // console.log(descArr);
    return descArr.join("、");
  },
  gotoConsult:function(){
    var session = this.getUrlParams('session');
    var ownUri = this.getUrlParams('ownUri');
    var usrUri = this.getUrlParams('usrUri');
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    var data = {
      t: 99,
      ml: [ownUri,usrUri]
    }
    $.ajax({
      type: 'POST',
      url: global.url+'/usr/CreateGroup.do?session='+session,
      data: JSON.stringify(data),
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          window.location.href = global.url + '/coop/askLawyers/view/chatList.html?session='+session+'&groupId='+data.gi+'&ownUri='+ownUri+'&status=chatLawyers&usrUri='+usrUri+'&ida='+ida;
        }
        this.getDynamicComment()
      }.bind(this),
      error: function(data) {
          // console.log(data);
          alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  gotoIndex: function(){
    var ownUri = this.getUrlParams('ownUri');
    window.location.href = global.url + '/usr/ThirdHomePage.do?ownUri=' + ownUri;
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    console.log(this.state.Abstract);
    // $(document).scroll(function(){
    //   console.log($('.dynamic_top'));
    //   console.log($('.dynamic_top')[0].scrollHeight);
    // })
    this.dynamicBindScroll();
  },
  componentWillMount:function(){
    this.getShareInfo();
    this.getIndexTheme();
    this.getDynamicComment();
    this.getUsrPraise();
  }, 
  render: function() {
    var ShareTitile = this.state.Title;
    var ShareDesc = this.state.Introduction;
    var ShareImg = this.state.Img;
    var imgList = this.state.imgLists.map(function(item,i){
      return(
          <img key={new Date().getTime()+i} src={global.img+item}/>
       );
    }.bind(this));
    var usrContent = this.state.usrContents.map(function(item,i){
      return(
        <div key={new Date().getTime()+i}>
          <div className="dynamic_exp_top">
            <img className="dynamic_exp_img" src={item.p?(global.img+item.p):(global.img+'header.jpg')} width="65" height="65"/>
            <p className="dynamic_exp_name">
              <span>{item.nm}</span><br/>
              <span className="dynamic_exp_date">{this.getDate(item.ts)}</span>
            </p>
          </div>
          <div className="dynamic_usr_word">{item.c}</div>
        </div>
       );
    }.bind(this));
    return (
      <div className="dynamic_contaniner">
        <div className="dynamic_top">
          <div className="dynamic_exp">
            <div className="dynamic_exp_top">
              <img className="dynamic_exp_img" src={global.img+this.state.head} width="65" height="65"/>
              <p className="dynamic_exp_name">
                <span>{this.state.nm}</span><br/>
                <span className="dynamic_exp_date">{new Date(this.state.time).Format("MM-dd")}</span>
              </p>
              <p className="dynamic_exp_nice">
                <span>{this.state.niceNo}</span>
                <span className="dynamic_exp_com">{this.state.contentNo}</span>
              </p>            
            </div>
            <div className="dynamic_exp_content">
              <div className="dynamic_exp_title">{this.state.expTitle}</div>
              <div className="dynamic_exp_word">{this.state.expContent}</div>
              <div className="dynamic_exp_imgs">
                {imgList}
              </div>
            </div>
          </div>
          <div className="dynamic_usr_content">
            <div className="dynamic_usr_news">
              <span className="dynamic_usr_latest">最新评论</span>
              <span className={this.state.praiseFlag?'dynamic_usr_img dynamic_usr_img_nice':'dynamic_usr_img'} onClick={this.setPraise}></span>
              <span className="dynamic_usr_wc" onClick={this.wirteComment}>写评论</span>
            </div>
            {usrContent}            
          </div>
        </div>
        <div className="dynamic_bot">
          <div className="dynamic_usr_content dynamic_usr_write">
            <div className="dynamic_usr_box">
              <textarea placeholder="写评论..."></textarea>
              <span onClick={this.setComment}>发送</span>
            </div>
          </div>
          <div className="dynamic_exp_top dynamic_exp_chat">
            <img className="dynamic_exp_img" onClick={this.gotoIndex} src={global.img+this.state.head} width="65" height="65"/>
            <p className="dynamic_exp_name">
              <span>{this.state.nm}</span><br/>
              <span className="dynamic_exp_date">擅长{this.transferArr(this.state.esl)}等</span>
              <img className="dynamic_usr_consult" onClick={this.gotoConsult} src="image/LatestNews/consult.png"/>
            </p>
          </div>
        </div>       
        <Share title={ShareTitile} desc={ShareDesc} imgUrl={global.img+ShareImg} target="Dynamic"/>
      </div>
    )
  }
});

module.exports = Dynamic;
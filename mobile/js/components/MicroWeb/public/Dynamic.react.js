var React = require('react');
var CommonMixin = require('../../Mixin');
var ImgList = require('../../layout/ImgList.react')
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');
Date.prototype.Format = function(fmt){ //author: meizz
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  // console.log(today.getTime());
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
      basename: '5Zyo57q_5rOV5b6L',
      time: '',
      niceNo: '',
      contentNo: '',
      readNo: '',
      expTitle: '',
      expContent: '',
      usrContents: [],
      praiseFlag: false,
      expConsultState: false,
      expConsultWord1: '我的',
      expConsultWord2: '名片',
      newContentArray: [],
      showFlag: false,    //懒加载图片显示隐藏
      isFrom: false,        //app端不显示底部栏
      waterMarkFlag: 'onLineLaw'  //默认为在线法律，否则为其他律所logo
    };
  },
  // 查询用户是否开通在线咨询功能
  // ocm字段  0表示关闭在线咨询功能，1表示开通在线咨询功能
  getExpConsultState: function(){
    var ownUri = this.getUrlParams('ownUri');
    $.ajax({
      type: 'get',
      url: global.url+'/exp/Settings.do?ownUri=' + ownUri,
      success: function(data) {
        if (data.c == 1000) {
          if(data.ocm == 1){
            this.setState({
              expConsultState: true
            })
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    });
  },
  gotoLink: function(path){
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri');
  },
  gotoReportList: function(){
    var ownUri = this.getUrlParams('ownUri');
    var fid = this.getUrlParams('fid');
    window.localStorage.setItem('reportTitle',this.state.Title);
    location.href = '#ReportList?ownUri='+ownUri+'&fid='+fid+'&ida='+this.state.ida+'&idf='+this.state.idf;
  },
  gotoTimeAxis: function(){
    var ownUri = this.getUrlParams('ownUri');
    var session = this.getUrlParams('session');
    var usrUri = this.getUrlParams('usrUri');
    var isFrom = this.getUrlParams('isFrom');
    var isFromWhichApp = this.getUrlParams('isFromWhichApp');
    var isAndroid = this.getUrlParams('isAndroid');
    if(isAndroid == 'true'){
      location.href = '#/TimeAxis?ownUri='+ownUri+'&usrUri='+usrUri+'&ida='+this.state.ida+'&idf='+this.state.idf+'&isFrom=app&isAndroid=true'+'&isFromWhichApp='+isFromWhichApp;
    }else if(isFrom == 'app'){
      location.href = '#/TimeAxis?ownUri='+ownUri+'&usrUri='+usrUri+'&ida='+this.state.ida+'&idf='+this.state.idf+'&isFrom=app'+'&isFromWhichApp='+isFromWhichApp;
    }else{
      location.href = '#/TimeAxis?ownUri='+ownUri+'&ida='+this.state.ida+'&idf='+this.state.idf+'&isFromWhichApp='+isFromWhichApp;
    }
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
  getDynamicComment: function(flag){
    var fid = this.getUrlParams('fid');
    var usrUri = this.getUrlParams('usrUri');
    var url;
    if(flag){
      url = global.url+'/usr/FeedDetail.do?fid='+fid+'&ia=1';
    }else{
      url = global.url+'/usr/FeedDetail.do?fid='+fid;
    }
    var that = this;
    var ownUri = this.getUrlParams('ownUri');
    var ida = this.getUrlParams('ida');
    var idf = this.getUrlParams('idf');
    $.ajax({
      type: 'GET',
      url: url,
      success: function(data) {
        // console.log(data);
        if(data.c == 1031){
          this.showAlert('图文消息已删除,点击返回更多动态',function(){
            window.location.href = '#TimeAxis?ownUri='+ownUri+'&ida='+ida+'&idf='+idf;
          });

        }else if(data.c == 1000){
          if(data.r.fl[0].pl[0]){
            this.setState({
              newContentArray: data.r.fl[0].pl,
              Introduction: data.r.fl[0].pl[0].content||'动态介绍',
              Img: data.r.fl[0].pl[0].il[0]?data.r.fl[0].pl[0].il[0]:(data.r.fl[0].p?data.r.fl[0].p:'header.jpg')
            })
          }else{
            this.setState({
              newContentArray: data.r.fl,
              Introduction: data.r.fl[0].content||'动态介绍',
              Img: data.r.fl[0].il[0]?data.r.fl[0].il[0]:(data.r.fl[0].p?data.r.fl[0].p:'header.jpg')
            })
          }
          if(data.r.fl[0].rl){
            for(var i=0;i<data.r.fl[0].rl.length;i++){
              if(usrUri == data.r.fl[0].rl[i].uri){
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
          // base64转码后的文本需要做的改动：
          // 将结果中的加号”+”替换成中划线“-“;
          // 将结果中的斜杠”/”替换成下划线”_”;
          // 将结果中尾部的“=”号全部保留;
          this.setState({
            head: data.r.fl[0].p?data.r.fl[0].p:'header.jpg',
            nm: data.r.fl[0].nm,
            basename: data.r.fl[0].basename.replace(/\+/g,'-').replace(/\//g,'_'),
            time: data.r.fl[0].ts,
            niceNo: data.r.fl[0].rl?data.r.fl[0].rl.length:0,
            contentNo: data.r.fl[0].cl?data.r.fl[0].cl.length:0,
            readNo: data.r.fl[0].readnum?data.r.fl[0].readnum:0,
            expTitle: data.r.fl[0].title||'动态',
            usrContents: data.r.fl[0].cl?data.r.fl[0].cl:[],
            esl: data.r.fl[0].esl,
            Title: data.r.fl[0].title||'我的动态',
            showFlag: flag,
            idf: data.r.fl[0].idf,
            ida: data.r.fl[0].ida,
            acn: data.r.fl[0].acn,
            vcn: data.r.fl[0].vcn,
            vp: data.r.fl[0].vp
          })
          // console.log(data.r.fl[0].content);
          // var top = $('.dynamic_contaniner')[0].scrollHeight;
          // $('.dynamic_contaniner').scrollTop(top);
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
          this.showRefresh('系统开了小差，请刷新页面');
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
  wirteComment: function(){
    $('.dynamic_usr_write').show();
    // console.log($('.dynamic_top'));
    var top = $('.dynamic_top')[0].scrollHeight;
    $('.dynamic_top').scrollTop(top);
  },
  setComment: function(){
    var val = $('.dynamic_usr_write textarea').val();
    var session = this.getUrlParams('session');
    var fid = this.getUrlParams('fid');
    if(!val){
      this.showAlert('请输入要发送的内容！');
      return;
    }else if(this.callength(val) >= 1000){
      this.showAlert('你输入的内容过长！');
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
          // console.log(data);
          if(data.c == 1000){
            $('.dynamic_usr_write').hide();
            $('.dynamic_usr_write textarea').val('');
            // $('.dynamic_exp_chat').css({'position':'absolute','height':'7rem','padding':'0.5rem 1rem','display':'-webkit-box'});
            this.getDynamicComment(true);
            setTimeout(function(){
              var top = $('.dynamic_top')[0].scrollHeight;
              $('.dynamic_top').scrollTop(top);
            },500)
          }
        }.bind(this),
        error: function(data) {
            // console.log(data);
            this.showRefresh('系统开了小差，请刷新页面');
        }.bind(this)
      })
    }
  },
  setPraise: function(){
    var flag = $('.dynamic_usr_img').hasClass('dynamic_usr_img_nice');
    var session = this.getUrlParams('session');
    var fid = this.getUrlParams('fid');
    if(flag){
      this.showAlert('已经点过赞了！');
      return;
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
          // console.log(data);
          if(data.c == 1000){
            this.getDynamicComment(true);
            $('.dynamic_usr_img').addClass('dynamic_usr_img_nice');
          }
        }.bind(this),
        error: function(data) {
            // console.log(data);
            this.showRefresh('系统开了小差，请刷新页面');
        }.bind(this)
      })
    }
  },
  transferArr: function(str){
    var arr =[]; 
    var descArr = [];
    if(str == "[]"){
      arr = [];
    }else if(str){
      arr = str.replace(/\[/,"").replace(/\]/g,"").split(",");
    }else{
      arr = [];
    }
    // arr = str?str.replace(/\[/,"").replace(/\]/g,"").split(","):[];
    // arr = JSON.stringify(str);
    // console.log(arr);
    var eilArr = ['','公司企业','资本市场','证券期货','知识产权','金融保险','合同债务','劳动人事','矿业能源','房地产','贸易','海事海商','涉外','财税','物权','婚姻家庭','侵权','诉讼仲裁','刑事','破产','新三板','反垄断','家族财富','交通事故','医疗','人格权','其他'];
    if(arr.length < 1){
      descArr = []
    }else{
      for(var i = 0; i<arr.length; i++){
        if(arr[i] == 99){
          descArr.push('其他')
        }else{
          descArr.push(eilArr[arr[i]])
        }
      }
    }
    // console.log(descArr);
    var lawyerArr = descArr?descArr.slice(0,3):[];
    // console.log(lawyerArr.join(" "));
    return lawyerArr.join(" ");
  },
  gotoConsult:function(){
    var ownUri = this.getUrlParams('ownUri');
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    var st = this.getUrlParams('st')?this.getUrlParams('st'):3;
    var doubleClickFlag = true;
    var str = window.location.href;
    var temp,appid;
    if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
        temp = 't-web';
        appid = 'wx2858997bbc723661';
      }else{
        temp = 'web';
        appid = 'wx73c8b5057bb41735';
      }
    // st  3  入口为个人名片入口
    if(doubleClickFlag){
      doubleClickFlag = false;
      
      location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri=http%3a%2f%2f'+temp+'.green-stone.cn%2fusr%2fWeiXinWebOAuthForChat.do&response_type=code&scope=snsapi_userinfo&state=micwebchat_'+ownUri+'_'+ida+'_0_'+st+'#wechat_redirect';
      setTimeout(function(){
        doubleClickFlag = true;
      },3000);
    }
  },
  gotoIndex: function(){
    var ownUri = this.getUrlParams('ownUri');
    $.ajax({
      type: 'post',
      url: global.url+'/usr/ThirdHomePage.do?ownUri='+ownUri+'&ida=0',
      success: function(data) {
        // console.log(data);
        if(data.c == 1999){
          this.showAlert('还没有创建个人名片');
        }else{
          window.location.href = global.url+'/usr/ThirdHomePage.do?ownUri='+ownUri+'&ida=0';
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  componentDidMount: function(){
    $('body').css({'background':'#fff'});
    var that = this;
    setTimeout(function(){
      // console.log('这是标题：'+that.state.expTitle);
      document.title = that.state.expTitle;
    },300)
    // console.log(this.state.Abstract);
    var getImageFlag = false;
    $('.dynamic_top').scroll(function(){
      if(!getImageFlag){
        var imgs = $(this).find('img.lazy');
        // console.log(imgs);
        for (var i = imgs.length - 1; i >= 0; i--) {
          $(imgs[i]).attr('src',$(imgs[i]).attr('data-original'))
        }
        getImageFlag = true;
      }
    })
    // 音视频不能同时播放，做到互不干扰
    $('#audioPlay').on('play', function(event) {
      event.preventDefault();
      console.log($('#audioPlay')[0]);
      $('#videoPlay')[0].pause();
      /* Act on the event */
    });
    $('#videoPlay').on('play', function(event) {
      event.preventDefault();
      $('#audioPlay')[0].pause();
      /* Act on the event */
    });
    videoPlay.setAttribute('controls','controls');
    videoPlay.setAttribute('x5-video-player-type','h5');
    videoPlay.setAttribute('x5-video-player-fullscreen','true');
    videoPlay.setAttribute('webkit-playsinline','true');
    videoPlay.setAttribute('x-webkit-airplay','true');
    videoPlay.setAttribute('playsinline','true');
    videoPlay.setAttribute("x5-video-orientation", "landscape|portrait");


    // 解决ios添加video以后页面滚动问题

      var el=document.getElementById('dynamic_top');
      var scrollStartPos=0;

      // console.log($('#videoPlay').attr('src'));
      // console.log(this.isIOS());
      // 苹果手机视频滑不下来问题处理
      // if(this.isIOS() && $('#videoPlay').attr('src')){
      //   document.getElementById('dynamic_top').addEventListener("touchstart", function(event) {
      //     // console.log(event);
      //     scrollStartPos=this.scrollTop+event.touches[0].pageY;
      //     event.preventDefault();
      //   },false);

      //   document.getElementById('dynamic_top').addEventListener("touchmove", function(event) {
      //     this.scrollTop=scrollStartPos-event.touches[0].pageY;
      //     event.preventDefault();
      //   },false);
      // }
      
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
    var isFrom = this.getUrlParams('isFrom');
    this.setState({
      isFrom: isFrom
    })
    this.getDynamicComment(false);
    this.getExpConsultState();
  }, 
  render: function() {
    // 控制台打印分享信息
    // console.log(this.state.Title);
    // console.log(this.state.Introduction);
    // console.log(this.state.Img);
    var ownUri = this.getUrlParams('ownUri');
    var isFromWhichApp = this.getUrlParams('isFromWhichApp');
    var waterMarkFlag = '';
    // console.log(isFromWhichApp)
    // isFromWhichApp    在线法律传1，德和衡传2，时间涟漪传3，菁英时代传4，高端诉讼传5，大成西安传6，大成金融传7，九赫法商传8
    if(isFromWhichApp == 2){
      waterMarkFlag = 'deHeHeng'
    }else if(isFromWhichApp == 3){
      waterMarkFlag = 'timeRipper'
    }else if(isFromWhichApp == 4){
      waterMarkFlag = 'jingYingShiDai'
    }else if(isFromWhichApp == 5){
      waterMarkFlag = 'gaoduansusong'
    }else if(isFromWhichApp == 6){
      waterMarkFlag = 'dachengxian'
    }else if(isFromWhichApp == 7){
      waterMarkFlag = 'dachengjinrong'
    }else if(isFromWhichApp == 8){
      waterMarkFlag = 'jiuhefashang'
    }else{
      waterMarkFlag = 'onLineLaw'
    }
    // console.log(waterMarkFlag);
    var fid = this.getUrlParams('fid');
    var temp,appid,ShareUrl;
    ShareUrl = window.location.href;
    // console.log(ShareUrl);
    var imgWidth = $('.dynamic_exp_content').width();

    var newImgContent = this.state.newContentArray.map(function(item,i){
      return(
        <div key={new Date().getTime()+i}>
          <div className="dynamic_exp_word"><pre>{item.content}</pre></div>
          <ImgList list={item.il} showFlag={this.state.showFlag} imgWidth={imgWidth} basename={this.state.basename} waterMarkFlag={waterMarkFlag}/>
        </div>
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
        <div className="dynamic_top" id="dynamic_top">
          <div className="dynamic_exp">
            <div className="dynamic_exp_content">
              <div className="dynamic_exp_title">{this.state.expTitle}</div>
              <div className="dynamic_exp_top">
                <p className="dynamic_exp_name">
                  <span className="dynamic_exp_expName">{this.state.nm}</span>
                  <span className="dynamic_exp_date">{new Date(this.state.time).Format("yyyy-MM-dd")}</span>
                </p>
                <p className="dynamic_exp_nice" onClick={this.gotoTimeAxis}>
                  更多动态 
                </p>            
              </div>
              <div className="dynamic_audio" style={{display:this.state.acn?'flex':'none'}}>
                <image src="image/voice.png" width="10%" />
                <audio id="audioPlay" width="90%" controls="controls" height="100" src={this.state.acn?global.img+this.state.acn:"http://t-transfer.green-stone.cn/audio_20160914145701.mp3"}></audio>
              </div>
              <div className="dynamic_audio" id={this.state.vcn?'dynamic_video':'dynamic_audio'} style={{display:this.state.vcn?'block':'none'}}>
                <video id="videoPlay" width="100%" controls="controls" webkit-playsinline="true" playsinline="true" poster={this.state.vp?global.img+this.state.vp:"http://transfer.green-stone.cn/zaixianfalvxuanchuan20170829_W900_H500_S48.jpg"} src={this.state.vcn?global.img+this.state.vcn:"http://videolive.green-stone.cn/video/livee16588103.m3u8"} ></video>
              </div>
              <div className="newContent">
                {newImgContent}
              </div>
            </div>
          </div>
          <div className="dynamic_usr_news">
            <span className="dynamic_usr_latest" style={{visibility:this.state.isFrom?'hidden':'visible'}} onClick={this.gotoReportList}>举报</span>
            <span className="dynamic_usr_read">{this.state.readNo}</span>
            <span className={this.state.praiseFlag?"dynamic_usr_img dynamic_usr_img_nice":"dynamic_usr_img"}>{this.state.niceNo}</span>
            <span className="dynamic_usr_wc">{this.state.contentNo}</span>
          </div>
          <div style={{display:this.state.usrContents.length>1?'block':'none'}}>
            <div className="dynamic_usr_content_title">最新评论</div> 
            <div className="dynamic_usr_content">
              {usrContent}         
            </div>
          
          </div>
          <div className="dynamic_blank_box"></div>
          
        </div>
        <div className="dynamic_usr_content dynamic_usr_write">
          <div className="dynamic_usr_box">
            <textarea placeholder="写评论..."></textarea>
            <span onClick={this.setComment}>发送</span>
          </div>
        </div>
        <div className="dynamic_bot" style={{display:this.state.isFrom?'none':'block'}}>
          <div className="dynamic_exp_top dynamic_exp_chat">
            <img className="dynamic_exp_img" onClick={this.gotoIndex} src={global.img+this.state.head} width="50" height="50"/>
            <p className="dynamic_exp_name">
              <span className="dynamic_exp_name_name">{this.state.nm}</span><br/>
              <span className="dynamic_exp_date" style={{display:this.transferArr(this.state.esl)?'block':'none'}}>擅长{this.transferArr(this.state.esl)}</span>
              <span className="dynamic_usr_consult" style={{display:this.state.expConsultState?'block':'none'}} onClick={this.gotoConsult} ><span>在线</span><span>咨询</span></span>
              <span className="dynamic_usr_consult dynamic_exp_card" style={{display:this.state.expConsultState?'none':'block'}} onClick={this.gotoIndex} ><span>名片</span></span>
            </p>
          </div>
        </div>  
        <Message/>     
        <Share title={this.state.Title} desc={this.state.Introduction} imgUrl={global.img+this.state.Img} target="Dynamic" />
      </div>
    )
  }
});

module.exports = Dynamic;
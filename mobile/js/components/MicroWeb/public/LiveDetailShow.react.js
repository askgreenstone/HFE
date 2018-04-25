var React = require('react');

var CommonMixin = require('../../Mixin');
var prismplayer = require('../../common/prism-min.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');


var LiveDetailShow = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      FirstData: [],
      QuestionList: [],
      askQuestionFlag: true,  //是否可以进行提问data.ls为2即正在直播时可以进行提问，其余情况都不可以
      ShareTitile: '直播详情',
      ShareDesc: '直播详情页面',
      ShareImg: 'batchdeptlogo20160811_W108_H108_S15.png',
      shareData: [],
      liveListTitle: '',
      loginFlag: false,
      LoginBoxFlag: false,
      messageCodeFlag: true,      //发送短信验证码
      time: 60,
      userSession: '',
      openBaiduOfficeText: '打开'   //打开百度文档
    };
  },
  getLiveQuestion:function(ldid){
    var ldid = this.getUrlParams('ldid');
    // console.log(ldid);
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveQuestion.do?ldid='+ldid,
      success: function(data) {
        // console.log(data);
        if(data.c == 1000){
          this.setState({
            QuestionList: data.ql
          })
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  getLiveInfo: function(ldid){
    var ownUri = this.getUrlParams('ownUri');
    var ldid = this.getUrlParams('ldid');
    // 新增ip字段，区分直播公开，私有（微信端没有授权，所以只展示公开课程）乔凡：2017.04.26
    // ip=1表示公开   ip=2表示内部
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveDetailNoList.do?dou='+ownUri+'&ldid='+ldid+'&ip=1',
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          // livestatus: int 直播状态  1 未直播   2直播中  3直播结束
          this.setState({
            FirstData:data.ll,
            askQuestionFlag: data.ll[0].ls == 2?true:false,
            ShareTitile: data.ll[0].lt,
            ShareDesc: data.ll[0].sn+'带来关于'+data.ll[0].lt+'的精彩讲课',
            ShareImg: data.ll[0].sp,
            shareData: data.ll
          })
          if(data.ll[0].ls == 2){
            $('.live_detail_question_text').show();
          }
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  // 打开百度文档
  openBaiduOffice: function(bdid){
    // console.log(bdid);
    var text = this.state.openBaiduOfficeText;
    console.log(text);
    var that = this;
    if(text === '打开'){
      var docId = bdid.substring(0,bdid.indexOf('_'));
      // console.log(docId);
      var option = {
          docId: docId,
          token: 'TOKEN',
          host: 'BCEDOC',
          width: 600, //文档容器宽度
          zoom: false,              //是否显示放大缩小按钮
          zoomStepWidth:200,
          pn: 1,  //定位到第几页，可选
          ready: function (handler) {  // 设置字体大小和颜色, 背景颜色（可设置白天黑夜模式）
              handler.setFontSize(1);
              handler.setBackgroundColor('#000');
              handler.setFontColor('#fff');
          },
          flip: function (data) {    // 翻页时回调函数, 可供客户进行统计等
              // console.log(data.pn);
          },
          fontSize:'big',
          toolbarConf: {
                  page: true, //上下翻页箭头图标
                  pagenum: true, //几分之几页
                  full: false, //是否显示全屏图标,点击后全屏
                  copy: true, //是否可以复制文档内容
                  position: 'center',// 设置 toolbar中翻页和放大图标的位置(值有left/center)
          } //文档顶部工具条配置对象,必选
      };
      new Document('reader', option); 
      that.setState({
        openBaiduOfficeText: '收起'
      })
      // 解决打开百度文档页面滚动问题

      var el=document.getElementById('live_detail_introduce');
      var scrollStartPos=0;

      document.getElementById('live_detail_introduce').addEventListener("touchstart", function(event) {
        console.log(event);
        scrollStartPos=this.scrollTop+event.touches[0].pageY;
        // event.preventDefault();
      },false);

      document.getElementById('live_detail_introduce').addEventListener("touchmove", function(event) {
        this.scrollTop=scrollStartPos-event.touches[0].pageY;
        // event.preventDefault();
      },false);
    }else if(text === '收起'){
      $('#reader').hide('slow', function() {
        that.setState({
          openBaiduOfficeText: '打开'
        })
      });
    }
    
  },
  postLiveQuestions:function(){
    var text = $('.live_detail_text').val();
    if(!text){
      this.showAlert('请输入问题')
      return;
    }
    var ownUri = this.getUrlParams('ownUri');
    var ldid = this.getUrlParams('ldid');
    // console.log(this.state.ownUri);
    var data = {
      ldid: ldid,
      lsu: ownUri,
      qd: text
    }
    $.ajax({
      type: 'post',
      url: global.url+'/exp/AddLiveQuestion.do?',
      data: JSON.stringify(data),
      success: function(data) {
        // console.log(data);
        if(data.c == 1000){
          $('.live_detail_text').val('');
          this.getLiveQuestion(ldid);
        }else if(data.c == 1052){
          $('.live_detail_text').val('');
          this.showAlert('主讲人已经关闭提问功能。');
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  addLiveWatchNum: function(){
    var ldid = this.getUrlParams('ldid');
    var data = {
      ldid: ldid
    }
    $.ajax({
      type: 'post',
      url: global.url+'/exp/AddLiveWatchNum.do',
      data: JSON.stringify(data),
      success: function(data) {
        // console.log(data);
        if(data.c == 1000){
          console.log('addLiveWatchNum success!');
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  liveVideoShow: function(data){
    // console.log(data);
    var source = data.ls==3?data.va:data.la;
    var arr = [];
    if(data.ls == 3){
      if(!this.state.userSession && data.ife == 2){
        arr = []
      }else{
        arr = [
              {name:"bigPlayButton", align:"cc", x:30, y:80},
              {name:"controlBar", align:"blabs", x:0, y:50,
                  children: [
                      {name:"progress", align:"tlabs", x: 0, y:0},
                      {name:"playButton", align:"tl", x:15, y:26},
                      {name:"timeDisplay", align:"tl", x:10, y:24}
                  ]
              }
            ]
      }
      $('.live_detail_list_edit_box').hide();
    }else{
      arr = [];
      // 2017年3月30日14:41  暂时隐藏下载app入口
      // $('.live_detail_list_edit_box').show();
      this.addLiveWatchNum();
      // 解决安卓手机固定定位会悬浮在播放器上层的问题
      console.log('此时提问框被隐藏')
      $('.live_detail_question_text').hide();
    }
    $('.live_detail_play').hide();
    $('.live_detail_shadow').hide();
    var player = new prismplayer({
            id: "J_prismPlayer", // 容器id
            source: source,// 视频地址
            autoplay: true,    //自动播放：否
            width: "100%",       // 播放器宽度
            height: "100%",      // 播放器高度
            skinLayout: arr
        });
    player.play();
    var that = this;
    if(data.ls ==2){
      // alert('直播！')
      player.on("pause", function() {
        player.setPlayerSize('1px','1px');
        $('.live_detail_list_edit_box').hide();
        $('.live_detail_play_play').show().parent().show();
        that.gotoDetail(data);
      });
      // 安卓手机点击返回操作重新显示提问框
      console.log('此时提问框被重新显示')
      $('.live_detail_question_text').hide();
    }
    player.on("ended", function() {
      that.showAlert('播放结束！',function(){
        player.setPlayerSize('1px','1px');
        that.gotoDetail(data);
      });
    });
    // 增加ife字段，is-fee : int是否收费（1免费  2收费）乔凡：2017年4月26日
    // 首先判断session
    if(!this.state.userSession && data.ife == 2){
      // alert('ife是2');
      setTimeout(function(){
        var ife = 'ife';
        player.pause();
        player.setPlayerSize('1px','1px');
        that.gotoDetail(data,ife);
      },10000)
    }
    
  },
  gotoDetail: function(data,ife){
    // console.log(data);
    // console.log('跳转到其他详情直播ldid'+data.ldid);
    this.setState({
      ldid: data.ldid,
      ShareTitile: data.lt,
      ShareDesc: data.sn+'带来关于'+data.lt+'的精彩讲课',
      ShareImg: data.sp,
      ShareLdid: data.ldid,
      shareData: [data]
    })
    if(ife == 'ife'){
      this.setState({
        loginFlag: true
      })
    }else{
      this.setState({
        loginFlag: false
      })
    }
    this.getLiveInfo(data.ldid);
  },
  showLoginBox: function(){
    // console.log(this.state.LoginBoxFlag)
    this.setState({
      LoginBoxFlag: true
    })
  },
  checkUserTel: function(){
    var userTel = $('#userTel').val();
    // console.log(userTel);
    if(!userTel){
      this.showAlert('请输入电话！')
      return;
    }else if(userTel.length != 11){
      this.showAlert('电话号码位数不正确！')
      return;
    };
    $.ajax({
      type: 'get',
      url: global.url+'/comm/Verify.do?pn='+userTel,
      success: function(data) {
        // console.log(data);
        if(data.c == 1000){
          this.getMessageCode();
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  getMessageCode: function(){
    var that = this;
    // console.log(that.state.time);
    var messageTime = that.state.time;
    if(messageTime == 0 ){
      that.setState({
        messageCodeFlag: true,
        time: 60
      })
      return;
    }else{
      that.setState({
        messageCodeFlag: false
      })
      setTimeout(function(){
        that.setState({
          time: that.state.time*1-1
        })
        that.getMessageCode();
      },1000)
    }
  },
  userLogin: function(){
    var userTel = $('#userTel').val();
    var userPwd = $('#userPwd').val();
    if(!userTel){
      // alert('请输入电话！');
      this.showAlert('请输入电话！')
      return;
    }else if(userTel.length != 11){
      this.showAlert('电话号码位数不正确！')
      return;
    }else if(!userPwd){
      this.showAlert('请输入验证码！')
      return;
    };
    var data = {
      pn: userTel,
      vc: userPwd
    }

    $.ajax({
      type: 'post',
      url: global.url+'/exp/WebLogin.do?',
      data: JSON.stringify(data),
      success: function(data) {
        // console.log(data);
        if(data.c == 1001){
          this.showAlert('验证码错误！');
          return;
        }else if(data.c == 1000){
          var that = this;
          that.setState({
            LoginBoxFlag: false,
            loginFlag: false,
            userSession: data.session
          })
          that.checkUserType(data.session);
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  checkUserType: function(session){
    $.ajax({
      type: 'post',
      url: global.url+'/exp/QueryIsLiveMember.do?session='+session,
      success: function(data) {
        // console.log(data);
        // is-live-member : int 是否直播会员 1 是， 0 否
        if(data.c == 1000){
          if(data.ilm == 0){
            var that = this;
            this.showAlert('您还不是直播会员，请注册！',function(){
              that.gotoOpenMember();
            })
          }else if(data.ilm == 1){
            var ownUri = this.getUrlParams('ownUri');
            var lid = this.getUrlParams('lid');
            var ldid = this.state.ldid;
            var that = this;
            this.showAlert('登录成功！',function(){
              window.location.href =  global.url+'/mobile/wxMiddle.html?ownUri='+ownUri+'&target=LiveShow&lid='+lid+'&ldid='+ldid+'&session='+session;
              // window.location.href = 'wxMiddle.html?target=LiveDetail&ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid+'&session='+session;
            })
          }
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  gotoOpenMember: function(){
    var ownUri = this.getUrlParams('ownUri');
    var lid = this.getUrlParams('lid');
    var ldid = this.state.ldid;
    var temp;
    var appid;
    var str = window.location.href;
    // window.location.href = '#OpenMember?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid;
    if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
      temp = 't-web';
      appid = 'wx2858997bbc723661';
    }else{
      temp = 'web';
      appid = 'wx73c8b5057bb41735';
    }
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri=http%3a%2f%2f'+temp+'.green-stone.cn%2fexp%2fWeiXinWebOAuthForExp.do&response_type=code&scope=snsapi_base&state=livememberpay_'+ownUri+'_'+lid+'_'+ldid+'#wechat_redirect';
  },
  componentDidMount: function(){
    $('.live_detail_nav').on('click', 'li', function(event) {
      event.preventDefault();
      var index = $(this).index();
      // console.log(index);
      $(this).addClass('live_detail_nav_active').siblings('').removeClass('live_detail_nav_active');
      $('.live_detail').children('').eq(index).show().siblings('').hide();
    });
    var isMember = this.getUrlParams('ilm');
    if(isMember){
      this.showAlert('您已经是会员了！')
    }
  },
  componentWillMount: function(){
    var ldid = this.getUrlParams('ldid');
      this.getLiveInfo(ldid);
      this.getLiveQuestion(ldid);
  },
  render:function(){
    var ldid = this.state.ldid;
    // console.log(this.state.liveListPic);
    var now  = new Date().getTime();
    // console.log(this.state.ShareTitile);
    // console.log(this.state.ShareDesc);
    // console.log(this.state.ShareImg);
    var FirstDataShow = this.state.FirstData.map(function(item,i){
      return(
        <div className="live_list_top live_detail_top" key={new Date().getTime()+i}>
          <div id="J_prismPlayer" className="prism-player"></div>
          <img className="live_detail_bg" src={global.img+'livenolistpic20180322_W720_H482_S240.jpg'} />
          <div className="live_list_top_content live_detail_top_content">
            <div><span>{item.lt?(item.lt.length>13?item.lt.substring(0,13)+'...':item.lt):'课程介绍'}</span><span className={item.ls == 2?'live_list_live':'live_list_live_no'}>直播中</span></div>
            <div><span className="live_list_teacher">主讲：<span>{item.sn?item.sn:'无'}</span> <span style={{display:item.sn?'inline':'none'}}>律师</span></span><span>{item.livetime?(new Date(item.livetime).Format("MM/dd hh:mm")):'直播时间'}</span></div>
          </div>
          <div className="live_detail_shadow" style={{display:this.state.loginFlag?'none':(ldid == 0?'inline':'none')}}></div>
          <div className="live_detail_shadow" style={{display:this.state.loginFlag?'none':(item.ls == 2?'inline':'none')}}><span className="live_detail_play live_detail_play_play" onClick={this.liveVideoShow.bind(this,item)}>进入直播</span></div>
          <div className="live_detail_shadow" style={{display:this.state.loginFlag?'none':(item.ls == 1?'inline':'none')}}><span className="live_detail_play live_detail_play_time">直播时间：{item.livetime?(new Date(item.livetime).Format("MM/dd hh:mm")):'无'}</span></div>
          <div className="live_detail_shadow" style={{display:this.state.loginFlag?'none':(item.ls == 3?'inline':'none')}}><span className="live_detail_play live_detail_play_button" onClick={this.liveVideoShow.bind(this,item)}><img src="image/video_on.png"/></span></div>
          <div className="live_detail_shadow live_detail_shadow_logIn" style={{display:this.state.loginFlag?'block':'none'}}>
            <span className="live_detail_shadow_logIn_all">开通会员后可观看完整版</span>
            <span className="live_detail_shadow_logIn_pay">年度会员仅需1999元</span>
            <span className="live_detail_shadow_logIn_btn" onClick={this.gotoOpenMember}>开通会员</span>
            <span className="live_detail_shadow_logIn_all">已是会员请继续<i onClick={this.showLoginBox}>登录</i>观看</span>
          </div>
        </div>
       );
    }.bind(this));
    var TeacherDataShow = this.state.FirstData.map(function(item,i){
      return(
        <div key={new Date().getTime()+i}>
          <div className="live_detail_class" style={{display:item.bdid?"block":"none"}}>
            <p className="live_detail_introduce_box">课程附件</p>
            <div onClick={this.openBaiduOffice.bind(this,item.bdid)}>{item.dn}<span className="live_detail_introduce_box_span">{this.state.openBaiduOfficeText}</span></div>
            <div id="reader"></div>
          </div>
          <div className="live_detail_class">
              <p className="live_detail_introduce_box">课程详情</p>
              <div>{item.ld}</div>
            </div>
            <div className="live_detail_class">
              <p className="live_detail_introduce_box">讲师介绍</p>
              <img src={item.sp?(global.img+item.sp):(global.img+'header.jpg')}/>
              <p className="live_detail_introduce_teacher"><span className="teacher_name">{item.sn}</span><span className="teacher_job">律师</span></p>
              <div>{item.sd}</div>
            </div>
        </div>
        
       );
    }.bind(this));
    var QuestionListShow = this.state.QuestionList.map(function(item,i){
      return(
        <li key={new Date().getTime()+i}>
          <div className="live_detail_question_img">
            <img src={item.qp?(global.img+item.qp):(global.img+'header.jpg')} width="50" height="50"/>
          </div>
          <div className="live_detail_question_content">
            <span>
              <i className="live_detail_question_content_name">{item.qn}</i>
              <i className="live_detail_question_content_time">{new Date(item.ts).Format("MM-dd hh:mm")}</i><br/>
              <i className="live_detail_question_content_text">{item.qd}</i>
            </span>
          </div>
        </li>
       );
    }.bind(this));
    var ShareBox = this.state.shareData.map(function(item,i){
      return(
        <Share key={new Date().getTime()+i} title={item.lt?item.lt:this.state.liveListTitle} desc={item.lt?(item.sn+'带来关于'+item.lt+'的精彩讲课'):this.state.liveListTitle} imgUrl={item.sp?(global.img+item.sp):(global.img+this.state.liveListPic)} target="LiveDetailShow" ldid={item.ldid?item.ldid:'0'}/>
      )
    }.bind(this)); 
    console.log(this.state.askQuestionFlag);
    return(
        <div className="live_list_box">
          {FirstDataShow}
          <ul className="live_detail_nav">
            <li className="live_detail_nav_active"><span>介绍</span><span>.</span></li>
            <li><span>提问</span><span>.</span></li>
          </ul>
          <div className="live_detail">
            <div className="live_detail_introduce live_detail_show_introduce">
              {TeacherDataShow}
            </div>
            <div className="live_detail_question">
              <ul className="live_detail_question_box">
                {QuestionListShow}
              </ul>
              <div className="live_detail_question_text" style={{display:this.state.askQuestionFlag?'box':'none'}}>
                <input className="live_detail_text" placeholder="请输入文字" type="text"/>
                <span onClick={this.postLiveQuestions}>提问</span>
              </div>
            </div>
          </div>
          <div className="live_detail_login" style={{display:this.state.LoginBoxFlag?'block':'none'}}>
            <div className="login_box">
              <div className="login_box_title">用户登录</div>
              <div className="login_box_tel">
                <span>+86</span><input id="userTel" type="text" />
              </div>
              <div className="login_box_code">
                <input type="text" id="userPwd" placeholder="请输入验证码" />
                <span className="login_box_code_button" style={{display:this.state.messageCodeFlag?'block':'none'}} onClick={this.checkUserTel} >短信验证码</span>
                <span className="login_box_code_time" style={{display:this.state.messageCodeFlag?'none':'block'}}>
                  <span className="login_box_code_button">重新发送</span>
                  <span className="login_box_code_time_code">{this.state.time}</span>
                  s
                </span>
              </div>
              <div className="login_button" onClick={this.userLogin}>登录</div>
              <div className="login_add">还不是会员，<span onClick={this.gotoOpenMember}>现在加入</span></div>
            </div>
          </div>
          <div className="live_detail_list_edit_box">
            <div className="live_detail_list_edit">
              <div className="liveShow_input" onClick={this.gotoDownLoadApp}>
                打开在线法律App 互动更精彩
              </div>
              <div className="liveShow_span">接受</div>
            </div>
          </div>
          {ShareBox}
          <Message/>
        </div> 
    );
  }
});

module.exports = LiveDetailShow;
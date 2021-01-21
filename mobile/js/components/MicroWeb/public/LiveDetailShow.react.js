var React = require("react");

var CommonMixin = require("../../Mixin");
var prismplayer = require("../../common/prism-min.react");
var flash = require("../../common/flash.react");
var CryptoJS = require("../../common/CryptoJS.react");
var Share = require("../../common/Share.react");
var Message = require("../../common/Message.react");

var LiveDetailShow = React.createClass({
  mixins: [CommonMixin],
  getInitialState: function () {
    return {
      FirstData: [],
      ListData: [],
      QuestionList: [],
      ShareTitile: "直播详情",
      ShareDesc: "直播详情页面",
      ShareImg: "batchdeptlogo20160811_W108_H108_S15.png",
      shareData: [],
      liveListTitle: "",
      loginFlag: false,
      LoginBoxFlag: false,
      messageCodeFlag: true, //发送短信验证码
      time: 60,
      niceNumber: 0, //点赞人数
      readNumber: 0, //点播观看人数
      watchNumber: 0, //直播观看人数
      liveDetailMarkFlag: true, //遮罩层，打开页面默认打开
      openBaiduOfficeText: "打开" //打开百度文档
    };
  },
  getLiveQuestion: function (ldid) {
    var ldid = this.getUrlParams("ldid");
    // console.log(ldid);
    $.ajax({
      type: "get",
      url: global.url + "/exp/GetLiveQuestion.do?ldid=" + ldid,
      success: function (data) {
        // console.log(data);
        if (data.c == 1000) {
          this.setState({
            QuestionList: data.ql
          });
        }
      }.bind(this),
      error: function (data) {
        this.showRefresh("系统开了小差，请刷新页面");
      }.bind(this)
    });
  },
  //查询直拨观看人数
  getLiveDetailRtmp: function (liveTitle) {
    var data = {
      lt: liveTitle
    };
    console.log(data);
    var that = this;
    $.ajax({
      type: "POST",
      url: global.url + "/exp/GetLiveDetailRtmp.do",
      data: JSON.stringify(data),
      success: function (data) {
        //alert( 'success:' + JSON.stringify(data) );
        console.log(data);
        if (data.c == 1000) {
          that.setState({
            watchNumber: data.wn
          });
        }
      },
      error: function (err) {
        alert("网络连接错误或服务器异常！");
      }
    });
  },
  // 查询同系列下的课程
  getCourseList: function (seriesid) {
    let id = seriesid === -1 ? 0 : seriesid;
    var that = this;
    $.ajax({
      type: "GET",
      url: global.url + "/exp/GetLiveDetailBySeries.do?lsID=" + id,
      success: function (data) {
        //alert( 'success:' + JSON.stringify(data) );
        console.log(data);
        if (data.c == 1000) {
          that.setState({
            ListData: data.ll
          });
        }
      },
      error: function (err) {
        alert("网络连接错误或服务器异常！");
      }
    });
  },
  getLiveInfo: function (ldid) {
    var ownUri = this.getUrlParams("ownUri");
    // 新增ip字段，区分直播公开，私有（微信端没有授权，所以只展示公开课程）乔凡：2017.04.26
    // ip=1表示公开   ip=2表示内部
    // pn   点赞数
    // deptLiveInfo.put("dl", dr.GetString("deptLogo")); //机构logo
    // deptLiveInfo.put("dll", dr.GetString("deptLiveLogo")); //机构直播横版logo
    // deptLiveInfo.put("dlp", dr.GetString("deptLivepic")); //机构直播封面
    // deptLiveInfo.put("dqc", dr.GetString("deptQRCode")); //机构公众号二维码
    // deptLiveInfo.put("dsn", dr.GetString("deptShortName")); //机构简称
    // deptLiveInfo.put("ilo", dr.GetInt("isLiveOpen")); //是否公开直播，0 可分享到微信观看，1分享到微信显示“直播结束”
    $.ajax({
      type: "get",
      url:
        global.url +
        "/exp/GetLiveDetailNoList.do?dou=" +
        ownUri +
        "&ldid=" +
        ldid,
      // + "&ip=1",
      success: function (data) {
        console.log(data);
        if (data.c == 1000) {
          // livestatus: int 直播状态  1 未直播   2直播中  3直播结束
          // 遍历dli对象，将需要的字段放入ll中
          for (var item in data.dli) {
            data.ll[0][item] = data.dli[item];
          }
          console.log(data.ll);
          this.setState({
            FirstData: data.ll,
            ShareTitile: data.ll[0].lt,
            ShareDesc: data.ll[0].sn + "关于" + data.ll[0].lt + "的精彩直播",
            ShareImg: data.ll[0].sp,
            shareData: data.ll,
            readNumber: data.ll[0].rn,
            niceNumber: data.ll[0].pn
          });
          if (data.ll[0].ls != 1) {
            $(".live_detail_question_text").show();
          }
          this.getLiveDetailRtmp(data.ll[0].lt);
          if (data.ll[0].seriesid) {
            this.getCourseList(data.ll[0].seriesid);
          }
        }
      }.bind(this),
      error: function (data) {
        this.showRefresh("系统开了小差，请刷新页面");
      }.bind(this)
    });
  },
  // 关闭遮罩层
  closeLiveDetailMark: function () {
    this.setState({
      liveDetailMarkFlag: false
    });
  },
  // 点赞
  setPraise: function () {
    var flag = $(".live_detail_top_content_right").hasClass(
      "live_detail_top_content_right_nice"
    );
    if (flag) {
      this.showAlert("已经点过赞了！");
      return;
    } else {
      this.setState({
        niceNumber: this.state.niceNumber + 1
      });
      var ldid = this.getUrlParams("ldid");

      var data = {
        ldid: ldid
      };
      // ~/exp/AddLivePraiseNum.do   增加点赞数接口    参数 ldid     使用post方式传值
      $.ajax({
        type: "POST",
        url: global.url + "/exp/AddLivePraiseNum.do",
        data: JSON.stringify(data),
        success: function (data) {
          // console.log(data);
          if (data.c == 1000) {
            console.log(data);
            $(".live_detail_top_content_right").addClass(
              "live_detail_top_content_right_nice"
            );
          }
        }.bind(this),
        error: function (data) {
          // console.log(data);
          this.showRefresh("系统开了小差，请刷新页面");
        }.bind(this)
      });
    }
  },
  // 打开百度文档
  openBaiduOffice: function (bdid) {
    // console.log(bdid);
    if (!bdid) {
      return;
    }
    location.href = "#BaiduDocView?bdid=" + bdid;
    return;
  },
  postLiveQuestions: function () {
    var text = $(".live_detail_text").val();
    var ls = this.state.FirstData[0].ls;
    console.log(ls);
    if (!text) {
      this.showAlert("请输入问题");
      return;
    }
    var ownUri = this.getUrlParams("ownUri");
    var ldid = this.getUrlParams("ldid");
    // console.log(this.state.ownUri);
    // 增加参数   ls   2表示直播提问3表示点播提问
    var data = {
      ldid: ldid,
      lsu: ownUri,
      qd: text,
      ls: ls
    };
    $.ajax({
      type: "post",
      url: global.url + "/exp/AddLiveQuestion.do?",
      data: JSON.stringify(data),
      success: function (data) {
        // console.log(data);
        if (data.c == 1000) {
          $(".live_detail_text").val("");
          this.getLiveQuestion(ldid);
        } else if (data.c == 1052) {
          $(".live_detail_text").val("");
          this.showAlert("主讲人已经关闭提问功能。");
        }
      }.bind(this),
      error: function (data) {
        this.showRefresh("系统开了小差，请刷新页面");
      }.bind(this)
    });
  },
  addLiveWatchNum: function (livestatus) {
    var ldid = this.getUrlParams("ldid");
    var data = {
      ldid: ldid,
      ls: livestatus
    };
    $.ajax({
      type: "post",
      url: global.url + "/exp/AddLiveWatchNum.do",
      data: JSON.stringify(data),
      success: function (data) {
        // console.log(data);
        if (data.c == 1000) {
          console.log("addLiveWatchNum success! && livestatus =" + livestatus);
        }
      }.bind(this),
      error: function (data) {
        this.showRefresh("系统开了小差，请刷新页面");
      }.bind(this)
    });
  },
  liveVideoShow: function (data) {
    console.log(data);
    console.log(prismplayer);
    console.log(flash);
    console.log(this.isAndroid());
    var system = {
      win: false,
      mac: false,
      xll: false
    };
    //检测平台
    var p = navigator.platform;
    console.log(p);
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = p == "X11" || p.indexOf("Linux") == 0;

    if (system.win || system.mac || system.xll) {
      //PC端
      console.log("现在是电脑");
      var source = data.ls == 3 ? data.va : data.la;
      var arr = [];
      if (data.ls == 3) {
        if (!session && data.ife == 2) {
          arr = [];
        } else {
          arr = [
            { name: "bigPlayButton", align: "cc", x: 30, y: 80 },
            { name: "H5Loading", align: "cc" },
            { name: "errorDisplay", align: "tlabs", x: 0, y: 0 },
            { name: "infoDisplay", align: "cc" },
            {
              name: "controlBar",
              align: "blabs",
              x: 0,
              y: 10,
              children: [
                { name: "progress", align: "tlabs", x: 0, y: -10 },
                { name: "playButton", align: "tl", x: 15, y: 26 },
                { name: "timeDisplay", align: "tl", x: 10, y: 24 },
                { name: "streamButton", align: "tr", x: 10, y: 23 },
                { name: "speedButton", align: "tr", x: 10, y: 23 },
                { name: "volume", align: "tr", x: 20, y: 25 }
              ]
            }
          ];
          // isLive = false;
        }
        $(".live_detail_question_text").hide();
      } else {
        arr = [];
        // 解决安卓手机固定定位会悬浮在播放器上层的问题
        console.log("此时提问框被隐藏");
        $(".live_detail_question_text").hide();
      }
      $(".live_detail_play").hide();
      $(".live_detail_shadow").hide();
      this.addLiveWatchNum(data.ls);
      // 获取屏幕宽高
      var height = window.innerHeight + "px";
      var width = window.innerWidth + "px";
      var player = new flash({
        id: "J_prismPlayer", // 容器id
        source: source, // 视频地址
        autoplay: true, //自动播放：否
        width: width, // 播放器宽度
        height: height, // 播放器高度
        skinLayout: arr //播放器组件（开始，暂停，音量，时间，全屏）
        // isLive: isLive,       //是否为直播状态
        // qualitySort: 'desc'     //desc表示按倒序排序（即：从大到小排序）asc表示按正序排序（即：从大到小排序）。
      });
      player.play();
    } else {
      //移动端
      // console.log(data);
      var source = data.ls == 3 ? data.va : data.la;
      // 设置微信title（苹果手机）
      var $body = $("body");
      document.title = data.lt;
      // hack在微信等webview中无法修改document.title的情况
      var $iframe = $('<iframe src="/favicon.ico"></iframe>')
        .on("load", function () {
          setTimeout(function () {
            $iframe.off("load").remove();
          }, 0);
        })
        .appendTo($body);
      var arr = [];
      // var isLive = true;
      // 点播视频
      // 判断手机系统是ios还是安卓
      var session = this.getUrlParams("session");
      if (data.ls == 3) {
        if (!session && data.ife == 2) {
          arr = [];
        } else {
          arr = [
            { name: "bigPlayButton", align: "cc", x: 30, y: 80 },
            { name: "H5Loading", align: "cc" },
            { name: "errorDisplay", align: "tlabs", x: 0, y: 0 },
            { name: "infoDisplay", align: "cc" },
            {
              name: "controlBar",
              align: "blabs",
              x: 0,
              y: 10,
              children: [
                { name: "progress", align: "tlabs", x: 0, y: -10 },
                { name: "playButton", align: "tl", x: 15, y: 26 },
                { name: "timeDisplay", align: "tl", x: 10, y: 24 },
                { name: "streamButton", align: "tr", x: 10, y: 23 },
                { name: "speedButton", align: "tr", x: 10, y: 23 },
                { name: "volume", align: "tr", x: 20, y: 25 }
              ]
            }
          ];
          // isLive = false;
        }
        $(".live_detail_question_text").hide();
      } else {
        arr = [];
        // 解决安卓手机固定定位会悬浮在播放器上层的问题
        console.log("此时提问框被隐藏");
        $(".live_detail_question_text").hide();
      }
      $(".live_detail_play").hide();
      $(".live_detail_shadow").hide();
      this.addLiveWatchNum(data.ls);

      // 获取屏幕宽高
      var height = this.isIOS()
        ? screen.height - 50 + "px"
        : screen.height - 100 + "px";
      var width = screen.width + "px";
      console.log(arr);
      var player = new prismplayer({
        id: "J_prismPlayer", // 容器id
        source: source, // 视频地址
        autoplay: false, //自动播放：否
        width: width, // 播放器宽度
        height: height, // 播放器高度
        skinLayout: arr, //播放器组件（开始，暂停，音量，时间，全屏）
        // isLive: isLive,       //是否为直播状态
        qualitySort: "desc" //desc表示按倒序排序（即：从大到小排序）asc表示按正序排序（即：从大到小排序）。
      });
      player.play();
      var that = this;
      if (data.ls == 2) {
        // alert('直播！')
        // ios不进行任何操作，安卓暂停
        if (that.isAndroid()) {
          player.on("pause", function () {
            player.setPlayerSize("1px", "1px");
            $(".live_detail_play_play").show().parent().show();
            if (!session && data.ife == 2) {
              that.gotoDetail(data, ife);
            } else {
              that.gotoDetail(data);
            }
            // 安卓手机点击返回操作重新显示提问框
            console.log("此时提问框被重新显示");
            $(".live_detail_question_text").show();
          });
        }
      }

      // 修复iOS手机横屏效果
      if (that.isIOS()) {
        var height = screen.height + "px";
        var height2 = screen.height - 50 + "px";
        var width = screen.width + "px";
        var width2 = screen.width - 50 + "px";
        window.addEventListener("orientationchange", function (event) {
          if (window.orientation == 90 || window.orientation == -90) {
            player.setPlayerSize(height, width2);
          }
          if (window.orientation == 180 || window.orientation == 0) {
            player.setPlayerSize(width, height2);
          }
        });
      }

      player.on("ended", function () {
        that.showAlert("播放结束！", function () {
          player.setPlayerSize("1px", "1px");
          that.gotoDetail(data);
        });
      });
      // 增加ife字段，is-fee : int是否收费（1免费  2收费）乔凡：2017年4月26日
      // 首先判断session
      if (!session && data.ife == 2) {
        // alert('ife是2');
        setTimeout(function () {
          var ife = "ife";
          player.pause();
          player.setPlayerSize("1px", "1px");
          that.gotoDetail(data, ife);
        }, 180000);
      }
    }
  },
  gotoDetail: function (data, ife) {
    // console.log(data);
    // console.log('跳转到其他详情直播ldid'+data.ldid);
    this.setState({
      ldid: data.ldid,
      ShareTitile: data.lt,
      ShareDesc: data.sn + "关于" + data.lt + "的精彩直播",
      ShareImg: data.sp,
      ShareLdid: data.ldid,
      shareData: [data]
    });
    if (ife == "ife") {
      this.setState({
        loginFlag: true
      });
    } else {
      this.setState({
        loginFlag: false
      });
    }
    this.getLiveInfo(data.ldid);
  },
  showLoginBox: function () {
    // console.log(this.state.LoginBoxFlag)
    this.setState({
      LoginBoxFlag: true
    });
  },
  checkUserTel: function () {
    var userTel = $("#userTel").val();
    // console.log(userTel);
    if (!userTel) {
      this.showAlert("请输入电话！");
      return;
    } else if (userTel.length != 11) {
      this.showAlert("电话号码位数不正确！");
      return;
    }
    var token = encodeURIComponent(
      CryptoJS.HmacSHA1(
        "gstonesms" + userTel + "gstone-bu5-rEIqop89NZiJwkqX6Bi1ZW2wEi92",
        "gstonesms"
      ).toString(CryptoJS.enc.Base64)
    );
    console.log(token);
    $.ajax({
      type: "get",
      url: global.url + "/comm/Verify.do?pn=" + userTel + "&token=" + token,
      success: function (data) {
        // console.log(data);
        if (data.c == 1000) {
          this.getMessageCode();
        }
      }.bind(this),
      error: function (data) {
        this.showRefresh("系统开了小差，请刷新页面");
      }.bind(this)
    });
  },
  getMessageCode: function () {
    var that = this;
    // console.log(that.state.time);
    var messageTime = that.state.time;
    if (messageTime == 0) {
      that.setState({
        messageCodeFlag: true,
        time: 60
      });
      return;
    } else {
      that.setState({
        messageCodeFlag: false
      });
      setTimeout(function () {
        that.setState({
          time: that.state.time * 1 - 1
        });
        that.getMessageCode();
      }, 1000);
    }
  },
  userLogin: function () {
    var userTel = $("#userTel").val();
    var userPwd = $("#userPwd").val();
    if (!userTel) {
      // alert('请输入电话！');
      this.showAlert("请输入电话！");
      return;
    } else if (userTel.length != 11) {
      this.showAlert("电话号码位数不正确！");
      return;
    } else if (!userPwd) {
      this.showAlert("请输入验证码！");
      return;
    }
    var data = {
      pn: userTel,
      vc: userPwd
    };

    $.ajax({
      type: "post",
      url: global.url + "/exp/WebLogin.do?",
      data: JSON.stringify(data),
      success: function (data) {
        // console.log(data);
        if (data.c == 1001) {
          this.showAlert("验证码错误！");
          return;
        } else if (data.c == 1000) {
          var that = this;
          that.setState({
            LoginBoxFlag: false,
            loginFlag: false
          });
          that.checkUserType(data.session);
        }
      }.bind(this),
      error: function (data) {
        this.showRefresh("系统开了小差，请刷新页面");
      }.bind(this)
    });
  },
  checkUserType: function (session) {
    $.ajax({
      type: "post",
      url: global.url + "/exp/QueryIsLiveMember.do?session=" + session,
      success: function (data) {
        // console.log(data);
        // is-live-member : int 是否直播会员 1 是， 0 否
        if (data.c == 1000) {
          if (data.ilm == 0) {
            var that = this;
            this.showAlert("您还不是直播会员，请注册！", function () {
              that.gotoOpenMember();
            });
          } else if (data.ilm == 1) {
            var ownUri = this.getUrlParams("ownUri");
            var lid = this.getUrlParams("lid");
            var ldid = this.state.ldid;
            var that = this;
            this.showAlert("登录成功！", function () {
              window.location.href =
                global.url +
                "/mobile/wxMiddle.html?ownUri=" +
                ownUri +
                "&target=LiveDetailShow&ldid=" +
                ldid +
                "&session=" +
                session;
              // window.location.href = 'wxMiddle.html?target=LiveDetail&ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid+'&session='+session;
            });
          }
        }
      }.bind(this),
      error: function (data) {
        this.showRefresh("系统开了小差，请刷新页面");
      }.bind(this)
    });
  },
  gotoOpenMember: function () {
    var ownUri = this.getUrlParams("ownUri");
    var lid = this.getUrlParams("lid");
    var ldid = this.state.ldid;
    var temp;
    var appid;
    var str = window.location.href;
    // window.location.href = '#OpenMember?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid;
    if (str.indexOf("localhost") > -1 || str.indexOf("t-dist") > -1) {
      temp = "t-web";
      appid = "wx2858997bbc723661";
    } else {
      temp = "web";
      appid = "wx73c8b5057bb41735";
    }
    window.location.href =
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
      appid +
      "&redirect_uri=http%3a%2f%2f" +
      temp +
      ".green-stone.cn%2fexp%2fWeiXinWebOAuthForExp.do&response_type=code&scope=snsapi_base&state=livememberpay_" +
      ownUri +
      "_" +
      lid +
      "_" +
      ldid +
      "#wechat_redirect";
  },
  componentDidMount: function () {
    $(".live_detail_nav_box").on("click", "li", function (event) {
      event.preventDefault();
      var index = $(this).index();
      // console.log(index);
      $(this)
        .addClass("live_detail_nav_active")
        .siblings("")
        .removeClass("live_detail_nav_active");
      $(".live_detail").children("").eq(index).show().siblings("").hide();
    });
    var isMember = this.getUrlParams("ilm");
    if (isMember) {
      this.showAlert("您已经是会员了！");
    }
  },
  componentWillMount: function () {
    var ldid = this.getUrlParams("ldid");
    this.getLiveInfo(ldid);
    this.getLiveQuestion(ldid);
  },
  render: function () {
    var ldid = this.state.ldid;
    // console.log('直拨观看人数'+this.state.watchNumber);
    // console.log('直拨观看人数'+this.state.readNumber);
    // console.log(this.state.liveListPic);
    var now = new Date().getTime();
    // console.log(this.state.ShareTitile);
    // console.log(this.state.ShareDesc);
    // console.log(this.state.ShareImg);
    // 所有点播视频不能观看
    // <div className="live_detail_shadow" style={{display:this.state.loginFlag?'none':(item.ls == 3?'inline':'none')}}><span className="live_detail_play live_detail_play_button" onClick={this.liveVideoShow.bind(this,item)}><img src="image/video_on.png"/></span></div>
    // <img className="live_detail_bg" src={global.img+'livenolistpic20180322_W720_H482_S240.jpg'} />
    console.log(this.state.FirstData);
    var FirstDataShow = this.state.FirstData.map(
      function (item, i) {
        return (
          <div className="live_list_top live_detail_top" key={i}>
            <div id="J_prismPlayer" className="prism-player"></div>
            <div className="live_detail_bg_box">
              <img
                className="live_detail_bg"
                src={
                  item.dlp
                    ? global.img + item.dlp
                    : global.img +
                      "gaoduansusonglivepic20180530_W750_H398_S44.jpg"
                }
              />
              <div className="live_detail_title">{item.lt || "无"}</div>
              <div className="live_detail_sp">
                <img
                  src={
                    item.sp ? global.img + item.sp : global.img + "header.jpg"
                  }
                />
              </div>
              <div className="live_detail_sn">
                <span className={item.ls == 1 ? "live_detail_sn_teacher" : ""}>
                  主讲人：{item.sn || "无"}
                </span>
                <br />
                <span
                  style={{ display: item.ls == 1 ? "none" : "inline" }}
                  className="live_detail_sn_time"
                >
                  时间：
                  {item.livetime
                    ? new Date(item.livetime).Format("MM/dd hh:mm")
                    : "无"}
                </span>
              </div>
              <div className="live_detail_dll">
                <img
                  src={
                    item.dll
                      ? global.img + item.dll
                      : global.img + "dachengzhibologo_W170_H80_S4.png"
                  }
                />
              </div>
              <div className="live_detail_ls">
                <span className="live_detail_ls_state">
                  {item.ls == 2
                    ? "正在直播"
                    : item.ls == 1
                    ? "直播未开始"
                    : item.ls === 3 && item.ip === 1 && item.isReview === 1
                    ? "观看回放"
                    : "直播已结束"}
                </span>
                <br />
                <span
                  style={{
                    display: item.dqc
                      ? item.ls == 3 && item.ilo != 0
                        ? "inline"
                        : "none"
                      : "none"
                  }}
                  className="live_detail_ls_time"
                >
                  精彩课程关注{item.dsn}
                </span>
                <br />
                <span
                  style={{ display: item.ls == 1 ? "inline" : "none" }}
                  className="live_detail_ls_time"
                >
                  时间：
                  {item.livetime
                    ? new Date(item.livetime).Format("MM/dd hh:mm")
                    : "无"}
                </span>
              </div>
            </div>
            <div className="live_list_top_content live_detail_top_content">
              <div className="live_detail_top_content_left">
                <span className="live_detail_top_content_title">
                  {item.lt || "课程标题"}
                </span>
                <br />
                <span className="live_detail_top_content_isFree">
                  {item.ife == 1 ? "公开" : "收费"}
                </span>
                <span
                  className="live_detail_top_content_watchNum"
                  style={{ display: "none" }}
                >
                  已观看人数：
                  <span>{this.state.readNumber + this.state.watchNumber}</span>
                </span>
              </div>
              <div
                className="live_detail_top_content_right"
                onClick={this.setPraise}
              >
                <span>
                  <span>{this.state.niceNumber}</span>人点赞
                </span>
              </div>
            </div>
            <div
              className="live_detail_shadow"
              style={{
                display: this.state.loginFlag
                  ? "none"
                  : ldid == 0
                  ? "inline"
                  : "none"
              }}
            ></div>
            <div
              className="live_detail_shadow"
              style={{
                display: this.state.loginFlag
                  ? "none"
                  : item.ls == 2
                  ? "inline"
                  : "none"
              }}
            >
              <span
                className="live_detail_play live_detail_play_play"
                onClick={this.liveVideoShow.bind(this, item)}
              >
                进入直播
              </span>
            </div>
            <div
              className="live_detail_shadow"
              style={{
                display: this.state.loginFlag
                  ? "none"
                  : item.ls == 0
                  ? "inline"
                  : "none"
              }}
            >
              <span className="live_detail_play live_detail_play_time">
                直播时间：
                {item.livetime
                  ? new Date(item.livetime).Format("MM/dd hh:mm")
                  : "无"}
              </span>
            </div>
            <div
              className="live_detail_shadow"
              style={{
                display: this.state.loginFlag
                  ? "none"
                  : item.ls == 3 && item.ip === 1 && item.isReview === 1
                  ? "inline"
                  : "none"
              }}
            >
              <span
                className="live_detail_play live_detail_play_button"
                onClick={this.liveVideoShow.bind(this, item)}
              >
                <img src="image/liveDetail/play.png" />
              </span>
            </div>
            <div
              className="live_detail_shadow live_detail_shadow_logIn"
              style={{ display: this.state.loginFlag ? "block" : "none" }}
            >
              <span className="live_detail_shadow_logIn_member">
                仅限学员观看
              </span>
              <span
                className="live_detail_shadow_logIn_memberlogin"
                onClick={this.showLoginBox}
              >
                学员登录
              </span>
            </div>
          </div>
        );
      }.bind(this)
    );
    var LiveDetailMark = this.state.FirstData.map(
      function (item, i) {
        return (
          <div
            className="live_detail_mark_box"
            key={i}
            style={{
              display: item.dqc
                ? this.state.liveDetailMarkFlag
                  ? "block"
                  : "none"
                : "none"
            }}
          >
            <div className="live_detail_mark">
              <div className="live_detail_mark_head">
                关注{item.dsn || "高端诉讼"}
              </div>
              <span
                className="live_detail_mark_close"
                onClick={this.closeLiveDetailMark}
              >
                <img src="image/liveDetail/close.png" />
              </span>
              <div className="live_detail_mark_body">
                <image
                  src={
                    item.dqc
                      ? global.img + item.dqc
                      : global.img +
                        "gaoduansusongQrcode20180530_W480_H480_S120.png"
                  }
                />{" "}
              </div>
            </div>
          </div>
        );
      }.bind(this)
    );
    var TeacherDataShow = this.state.FirstData.map(
      function (item, i) {
        return (
          <div key={i}>
            <div
              className="live_detail_class"
              style={{ display: item.bdid ? "block" : "none" }}
            >
              <p className="live_detail_introduce_box">课程附件</p>
              <div
                className="live_detail_openbaiduoffice"
                onClick={this.openBaiduOffice.bind(this, item.bdid)}
              >
                {item.dn}
                <span className="live_detail_introduce_box_span">
                  {this.state.openBaiduOfficeText}
                </span>
              </div>
              <div id="reader"></div>
            </div>
            <div className="live_detail_class">
              <p className="live_detail_introduce_box">课程详情</p>
              <div className="live_detail_introduce_sd">
                <pre>{item.ld}</pre>
              </div>
            </div>
            <div className="live_detail_class">
              <p className="live_detail_introduce_box">讲师介绍</p>
              <img
                src={item.sp ? global.img + item.sp : global.img + "header.jpg"}
              />
              <p className="live_detail_introduce_teacher">主讲人：{item.sn}</p>
              <div className="live_detail_introduce_sd">
                <pre>{item.sd}</pre>
              </div>
            </div>
          </div>
        );
      }.bind(this)
    );
    var QuestionListShow = this.state.QuestionList.map(
      function (item, i) {
        return (
          <li key={i}>
            <div className="live_detail_question_img">
              <img
                src={item.qp ? global.img + item.qp : global.img + "header.jpg"}
                width="50"
                height="50"
              />
            </div>
            <div className="live_detail_question_content">
              <span>
                <i className="live_detail_question_content_name">{item.qn}</i>
                <i className="live_detail_question_content_time">
                  {new Date(item.ts).Format("MM-dd hh:mm")}
                </i>
                <br />
                <i className="live_detail_question_content_text">{item.qd}</i>
              </span>
            </div>
          </li>
        );
      }.bind(this)
    );
    var ShareBox = this.state.shareData.map(
      function (item, i) {
        return (
          <Share
            key={i}
            title={item.lt ? item.lt : this.state.liveListTitle}
            desc={
              item.lt
                ? item.sn + "关于" + item.lt + "的精彩直播"
                : this.state.liveListTitle
            }
            imgUrl={
              item.sp
                ? global.img + item.sp
                : global.img + this.state.liveListPic
            }
            target="LiveDetailShow"
            ldid={item.ldid ? item.ldid : "0"}
          />
        );
      }.bind(this)
    );
    var LiveDetailNav = this.state.FirstData.map(function (item, i) {
      return (
        <ul className="live_detail_nav" key={i}>
          <li>
            <span>系列课</span>
            <span></span>
          </li>
          <li className="live_detail_nav_active">
            <span>课程介绍</span>
            <span></span>
          </li>
          <li>
            <span>{item.ls == 2 ? "直播提问" : "评论留言"}</span>
            <span></span>
          </li>
        </ul>
      );
    });
    var ListDataShow = this.state.ListData.map(
      function (item, i) {
        return (
          <li
            data-id={item.ldid}
            className={
              item.ldid == this.state.FirstData[0].ldid
                ? item.ls == 3
                  ? "live_detail_list_online_active"
                  : "live_detail_list_video_active"
                : item.ls == 3
                ? "live_detail_list_online_off"
                : ""
            }
            key={new Date().getTime() + i}
            onClick={this.gotoDetail.bind(this, item)}
          >
            <div className="live_detail_list_img">
              <i></i>
              <div></div>
            </div>
            <div className="live_detail_list_content">
              <div className="live_list_title">
                {item.lt.length > 20
                  ? item.lt.substring(0, 20) + "..."
                  : item.lt}
                <br />
                <i>{item.ls == 3 ? "视频" : "直播"}</i>
              </div>
              <div className="live_list_content">
                {item.ls == 3
                  ? item.ldur
                  : new Date(item.livetime).Format("yyyy-MM-dd hh:mm")}
              </div>
            </div>
          </li>
        );
      }.bind(this)
    );
    console.log(this.state.FirstData);
    return (
      <div className="live_list_box">
        {LiveDetailMark}
        <div className="live_detail_top_box">{FirstDataShow}</div>
        <div className="live_detail_nav_box">{LiveDetailNav}</div>
        <div className="live_detail">
          <div className="live_detail_list_content_box">
            <ul className="live_detail_list">{ListDataShow}</ul>
          </div>
          <div
            id="live_detail_introduce"
            className="live_detail_introduce live_detail_show_introduce"
          >
            {TeacherDataShow}
          </div>
          <div className="live_detail_question">
            <ul className="live_detail_question_box">{QuestionListShow}</ul>
            <div className="live_detail_question_text">
              <div className="live_detail_question_text_box">
                <input
                  className="live_detail_text"
                  placeholder="请输入文字"
                  type="text"
                />
              </div>
              <div
                className="live_detail_question_text_que"
                onClick={this.postLiveQuestions}
              >
                提问
              </div>
            </div>
          </div>
        </div>
        <div
          className="live_detail_login"
          style={{ display: this.state.LoginBoxFlag ? "block" : "none" }}
        >
          <div className="login_box">
            <div className="login_box_title">用户登录</div>
            <div className="login_box_tel">
              <span>+86</span>
              <input id="userTel" type="text" />
            </div>
            <div className="login_box_code">
              <input type="text" id="userPwd" placeholder="请输入验证码" />
              <span
                className="login_box_code_button"
                style={{
                  display: this.state.messageCodeFlag ? "block" : "none"
                }}
                onClick={this.checkUserTel}
              >
                短信验证码
              </span>
              <span
                className="login_box_code_time"
                style={{
                  display: this.state.messageCodeFlag ? "none" : "block"
                }}
              >
                <span className="login_box_code_button">重新发送</span>
                <span className="login_box_code_time_code">
                  {this.state.time}
                </span>
                s
              </span>
            </div>
            <div className="login_button" onClick={this.userLogin}>
              登录
            </div>
            <div className="login_add">
              还不是会员，<span onClick={this.gotoOpenMember}>现在加入</span>
            </div>
          </div>
        </div>

        {ShareBox}
        <Message />
      </div>
    );
  }
});

module.exports = LiveDetailShow;

var session;
var payParams;
var pageImg = [];
var username = '';
var userpass = '';
var appKey = '';
var scroll_offset = 0;
var qid, gi;
var targetUri = '';
var name = '';
var globalTs = '';
var sendMsgTs = new Date().getTime();
var globalMsgList = [];
var expType = '';
var st;


$(function() {
    var conn = null;
    conn = new Easemob.im.Connection();

    conn.listen({
        onOpened: function() {
            console.log("打开连接！");
            conn.setPresence();
        },
        onTextMessage: function(message) {
            console.log(message);
            if (message.to !== gi) {
                return;
            }
            var tempClass = message.ext.f.indexOf('e') > -1 ? 'chat_list_exp' : 'chat_list_usr';
            var tempHeader = message.ext.up ? (Common.globalTransferUrl() + message.ext.up) : (pageImg[1].wxpor?pageImg[1].wxpor:Common.globalTransferUrl()+'header.jpg');
            var theOne = '';
            var timeStep = (message.ext.ts - sendMsgTs> 15000)?'block':'none';
            var extra = message.ext.extra?message.ext.extra:'';
            console.log(message.ext.ts - sendMsgTs);
            console.log(message.ext.mt, message.ext.on);
            // $('.chat_list').append('<li style="display:'+timeStep+'" class="js_chat_ts"><i>'+new Date(message.ext.ts).Format('yyyy-MM-dd hh:mm:ss')+'</i></li>'+theOne);
            if(judgeType(message.ext.mt, message.ext.on) == 'img') {
                theOne = '<li class="' + tempClass + '"><div class="chat_list_head"><img src="' + tempHeader + '@80w"><i>' + message.ext.nm + '</i></div><div class="chat_list_content"><span style="text-align:center;display:inline-block"><img height="150" onclick="gotoSingle(\''+Common.globalTransferUrl()+message.ext.on+'\')"  src="' +Common.globalTransferUrl()+ message.ext.on + '@350w"/></span></div></li>';
            }else if(judgeType(message.ext.mt, message.ext.on) == 'txt'){
                theOne = '<li class="' + tempClass + '"><div class="chat_list_head"><img src="' + tempHeader + '@80w"><i>' + message.ext.nm + '</i></div><div class="chat_list_content"><span style="display:inline-block" onclick="viewDoc(\'' + message.ext.on + '\')">文档：<a href="javascript:void(0);" style="text-decoration:underline">' + message.ext.fn + '</a></span></div></li>';
            }else if(message.ext.mt == 8 || message.ext.mt == 9 || message.ext.mt == 99){
                theOne = '<li class="' + tempClass + '"><div class="chat_list_head"><img src="' + tempHeader + '@80w"><i>' + message.ext.nm + '</i></div><div class="chat_list_content"><span style="display:inline-block">收费名片<br/>收款方：'+message.ext.nm+'<br/>收费项目：'+message.data+'<br/>收费金额：'+formartDecimal(message.ext.p)+' 元<br/>备注信息：'+extra+'<br/><a onClick="weixinpay(\''+message.ext.mi+'\')" style="text-decoration:underline" href="javascript:void(0);">点击此处，立即支付</a></span></div></li>';
            }else{
                theOne = '<li class="' + tempClass + '"><div class="chat_list_head"><img src="' + tempHeader + '@80w"><i>' + message.ext.nm + '</i></div><div class="chat_list_content"><span>' + message.data + '</span></div></li>';
            }
            console.log(theOne);

            //console.log(isRepeat(message.ext.mi,globalMsgList));
            //过滤重复消息
            if(!isRepeat(message.ext.mi,globalMsgList)){
              $('.chat_list').append('<li style="display:'+timeStep+'" class="js_chat_ts"><i>' + new Date(message.ext.ts).Format('yyyy-MM-dd hh:mm:ss') + '</i></li>' + theOne);
            }else{
              console.log('消息重复！');
            }

            

            wrapper.refresh();

            wrapper.scrollToElement('.chat_list li:last-child',100);

            console.log("收到文本消息！");

            sendMsgTs = message.ext.ts;
        },
        //当连接关闭时的回调方法
        onClosed: function() {
            conn.clear();
            conn.onClosed();
        },
        onError: function(message) {
            console.log(message);
            conn.clear();
            conn.onClosed();
            getUserToken();
            console.log('重新连接！');
        }
    })

    //下拉刷新
    refresher.init({
        id: "wrapper",
        pullDownAction: refresh
    });
    var generatedCount = 0;
    function refresh() {
        $.ajax({
            type: 'get',
            url: Common.globalDistUrl() + 'usr/GroupMsgList.do?session=' + session + '&gi=' + gi + '&t=0&c=15&ts=' + globalTs,
            success: function(data) {
                console.log(data);
                if(data.s.length == 0) {
                  wrapper.refresh();
                  return;
                }
                globalTs = data.s.length>0?data.s[data.s.length-1].ts:'';
                if (data.c == 1000) {
                    var newArrs = [];
                    $('#msgCount').text(data.s.length);
                    for (var i = 0; i < data.s.length; i++) {
                        newArrs.push({
                            type: data.s[i].f.indexOf('u') > -1 ? true : false, //类型：专家或者用户
                            img: data.s[i].f.indexOf('u') > -1 ? (pageImg[1].wxpor ? pageImg[1].wxpor : Common.globalTransferUrl()+'header.jpg') : Common.globalTransferUrl() + pageImg[0].p,
                            name: data.s[i].p.ext.nm,
                            time: new Date(data.s[i].ts).Format('yyyy-MM-dd hh:mm:ss'),
                            ts: data.s[i].ts,
                            content: data.s[i].p.msg.msg,
                            pic: judgeType(data.s[i].p.ext.mt, data.s[i].p.ext.on) == 'img' ? (Common.globalTransferUrl() + data.s[i].p.ext.on) : '',
                            doc: judgeType(data.s[i].p.ext.mt, data.s[i].p.ext.on) == 'txt' ? fixSrc(data.s[i].p.ext.on) : '',
                            unknown: judgeType(data.s[i].p.ext.mt, data.s[i].p.ext.on) == 'unknown' ? '您收到的消息格式暂不支持，无法显示' : '',
                            docName: data.s[i].p.ext.on,
                            fn: data.s[i].p.ext.fn,
                            pay: data.s[i].p.ext.p ? data.s[i].p.ext.p : '',
                            mi: data.s[i].p.ext.mi ? data.s[i].p.ext.mi : '',
                            sn: data.s[i].p.ext.sn ? data.s[i].p.ext.sn : '',
                            extra: data.s[i].p.ext.extra ? data.s[i].p.ext.extra : ''
                        });
                    }

                    newArrs.sort(function(obj1, obj2) {
                        return obj1['ts'] > obj2['ts'] ? 1 : -1;
                    });

                    // console.log(newArrs);
                    var comments = '';
                    var commentsPic = '';
                    var commentsDoc = '';
                    // var lastTime = '';
                    // $('.chat_list').empty();
                    for (var i = 0; i < newArrs.length; i++) {
                        // lastTime = newArrs[newArrs.length-1].ts;
                        var temp = newArrs[i].type ? 'chat_list_usr' : 'chat_list_exp';
                        var isPic = newArrs[i].pic ? 'inline-block' : 'none';
                        var isDoc = newArrs[i].doc ? 'inline-block' : 'none';
                        var isPay = newArrs[i].pay ? 'inline-block' : 'none';
                        var isMsg = newArrs[i].pic || newArrs[i].doc || newArrs[i].pay ? 'none' : 'inline-block';
                        comments += '<li  class="js_chat_ts"><i>' + new Date(newArrs[i].ts).Format('yyyy-MM-dd hh:mm:ss') + '</i></li><li class="' + temp + '"><div class="chat_list_head"><img src="' + newArrs[i].img + '"><i>' + newArrs[i].name + '</i></div><div class="chat_list_content"><span style="display:' + isPay + '">收费名片<br/>收款方：'+newArrs[i].name+'<br/>收费项目：'+newArrs[i].content+'<br/>收费金额：'+formartDecimal(newArrs[i].pay)+' 元<br/>备注信息：'+newArrs[i].extra+'<br/><a onClick="weixinpay(\''+newArrs[i].mi+'\')" style="text-decoration:underline" href="javascript:void(0);">点击此处，立即支付</a></span><span style="text-align:center;display:' + isPic + '"><img height="150" onclick="gotoSingle(\''+newArrs[i].pic+'\')"  src="' + newArrs[i].pic + '@350w"/></span><span style="display:' + isDoc + '" onclick="viewDoc(\'' + newArrs[i].docName + '\')">文档：<a href="javascript:void(0);" style="text-decoration:underline">' + newArrs[i].fn + '</a></span><span style="display:' + isMsg + '">' + newArrs[i].content + '</span></div></li>';
                    }

                    $(comments).insertBefore('.chat_list li:eq(0)');

                    wrapper.refresh();
                }
            },
            error: function(xhr, status, err) {
                alert('系统开了小差，请刷新页面');
                console.log('get GroupInfo error!');
            }
        });

    }

    function getUserToken() {
        $.ajax({
            type: 'get',
            // async: false,
            url: Common.globalDistUrl() + 'usr/EasemobUserInfo.do?session=' + session,
            success: function(data) {
                console.log(data);
                if (data.c == 1000) {
                    username = data.un;
                    userpass = data.up;
                    appKey = data.appKey;

                    conn.open({
                        user: username,
                        pwd: userpass,
                        appKey: appKey
                    });
                }
            },
            error: function(xhr, status, err) {
                // alert('系统开了小差，请刷新页面');
            }
        });
    }

    //小数点后保留两位数
    function formartDecimal(x){
      var f_x = parseFloat(x);
      if (isNaN(f_x)) {
          //alert('function:changeTwoDecimal->parameter error');
          return false;
      }
      var f_x = Math.round(x * 100) / 100;
      var s_x = f_x.toString();
      var pos_decimal = s_x.indexOf('.');
      if (pos_decimal < 0) {
          pos_decimal = s_x.length;
          s_x += '.';
      }
      while (s_x.length <= pos_decimal + 2) {
          s_x += '0';
      }
      return s_x;
    }

    

    $("#chat_btn").on('click', function() {
        // sendText();
        var userInput = $('.chat_inp').val(),
            gi = Common.getUrlParam('groupId'),
            userUri = Common.getUrlParam('usrUri');
        // console.log(userInput);
        if (!userInput) {
            alert('发送消息不能为空！');
            return;
        }
        console.log(session);
        console.log(gi);
        console.log(userUri);
        console.log(pageImg);
        if (!session || !gi || !userUri|| !pageImg) return;
        var tempObj = {
                target: [gi],
                msg: {
                    type: 'txt',
                    msg: userInput
                },
                ext: {
                    mi: uuidCompact(),
                    nm: pageImg[1].n,
                    isFromServer: 1,
                    f: userUri
                }
            }
            // console.log(tempObj);
        $.ajax({
            type: 'post',
            url: Common.globalDistUrl() + 'usr/SendMsg.do?session=' + session,
            data: JSON.stringify(tempObj),
            success: function(data) {
                console.log(data);
                if (data.c == 1000) {
                    $('.chat_inp').val('');
                    // console.log($('.chat_list')[0].scrollHeight);
                    if (pageImg) {
                        // setTimeout(function() {
                        //     getMsgList(gi, session, pageImg);
                        // }, 300);
                        // $('.chat_list').animate({
                        //     scrollTop: $('.chat_list')[0].scrollHeight
                        // }, 800);
                    }
                }
            },
            error: function(xhr, status, err) {
                alert('系统开了小差，请刷新页面');
            }
        });
    })

    function getGroupInfo() {
        if (!session || !gi) return;
        $.ajax({
            type: 'get',
            url: Common.globalDistUrl() + 'usr/GroupInfo.do?session=' + session + '&gi=' + gi,
            success: function(data) {
                console.log(data);
                if (data.c == 1000) {
                    getMsgList(gi, session, data.mb);
                    pageImg = data.mb;
                    for (var i = 0; i < data.mb.length; i++) {
                        if (data.mb[i].i.indexOf('e') > -1) {
                            targetUri = data.mb[i].i;
                            name = data.mb[i].n;
                            expType = data.mb[i].expt;
                            // console.log(targetUri);
                        }
                    }
                }
            },
            error: function(xhr, status, err) {
                alert('系统开了小差，请刷新页面');
                console.log('get GroupInfo error!');
            }
        });
    }

    function getMsgList(gi, sess, mb) {
        var ts = new Date().getTime();
        $.ajax({
            type: 'get',
            url: Common.globalDistUrl() + 'usr/GroupMsgList.do?session=' + session + '&gi=' + gi + '&t=0&c=15&ts=' + ts,
            success: function(data) {
                console.log(data);
                globalTs = data.s.length>0?data.s[data.s.length-1].ts:'';
                if (data.c == 1000) {
                    var newArrs = [];
                    $('#msgCount').text(data.s.length);
                    for (var i = 0; i < data.s.length; i++) {
                        newArrs.push({
                            type: data.s[i].f.indexOf('u') > -1 ? true : false, //类型：专家或者用户
                            img: data.s[i].f.indexOf('u') > -1 ? (mb[1].wxpor ? mb[1].wxpor : Common.globalTransferUrl()+'header.jpg') : Common.globalTransferUrl() + mb[0].p,
                            name: data.s[i].p.ext.nm,
                            time: new Date(data.s[i].ts).Format('yyyy-MM-dd hh:mm:ss'),
                            ts: data.s[i].ts,
                            content: data.s[i].p.msg.msg,
                            pic: judgeType(data.s[i].p.ext.mt, data.s[i].p.ext.on) == 'img' ? (Common.globalTransferUrl() + data.s[i].p.ext.on) : '',
                            doc: judgeType(data.s[i].p.ext.mt, data.s[i].p.ext.on) == 'txt' ? fixSrc(data.s[i].p.ext.on) : '',
                            unknown: judgeType(data.s[i].p.ext.mt, data.s[i].p.ext.on) == 'unknown' ? '您收到的消息格式暂不支持，无法显示' : '',
                            docName: data.s[i].p.ext.on,
                            fn: data.s[i].p.ext.fn,
                            pay: data.s[i].p.ext.p ? data.s[i].p.ext.p : '',
                            mi: data.s[i].p.ext.mi ? data.s[i].p.ext.mi : '',
                            sn: data.s[i].p.ext.sn ? data.s[i].p.ext.sn : '',
                            extra: data.s[i].p.ext.extra ? data.s[i].p.ext.extra : ''
                        });
                    }

                    newArrs.sort(function(obj1, obj2) {
                        return obj1['ts'] > obj2['ts'] ? 1 : -1;
                    });

                    // 存储msglist，用于去重
                    globalMsgList = newArrs;

                    // console.log(newArrs);
                    var comments = '';
                    var commentsPic = '';
                    var commentsDoc = '';
                    // var lastTime = '';
                    $('.chat_list').empty();
                    for (var i = 0; i < newArrs.length; i++) {
                        // lastTime = newArrs[newArrs.length-1].ts;
                        var temp = newArrs[i].type ? 'chat_list_usr' : 'chat_list_exp';
                        var isPic = newArrs[i].pic ? 'inline-block' : 'none';
                        var isDoc = newArrs[i].doc ? 'inline-block' : 'none';
                        var isPay = newArrs[i].pay ? 'inline-block' : 'none';
                        var isMsg = newArrs[i].pic || newArrs[i].doc || newArrs[i].pay ? 'none' : 'inline-block';
                        comments += '<li  class="js_chat_ts"><i>' + new Date(newArrs[i].ts).Format('yyyy-MM-dd hh:mm:ss') + '</i></li><li class="' + temp + '"><div class="chat_list_head"><img src="' + newArrs[i].img + '"><i>' + newArrs[i].name + '</i></div><div class="chat_list_content"><span style="display:' + isPay + '">收费名片<br/>收款方：'+newArrs[i].name+'<br/>收费项目：'+newArrs[i].content+'<br/>收费金额：'+formartDecimal(newArrs[i].pay)+' 元<br/>备注信息：'+newArrs[i].extra+'<br/><a onClick="weixinpay(\''+newArrs[i].mi+'\')" style="text-decoration:underline" href="javascript:void(0);">点击此处，立即支付</a></span><span style="text-align:center;display:' + isPic + '"><img height="150" onclick="gotoSingle(\''+newArrs[i].pic+'\')" src="' + newArrs[i].pic + '"/></span><span style="display:' + isDoc + '" onclick="viewDoc(\'' + newArrs[i].docName + '\')">文档：<a href="javascript:void(0);" style="text-decoration:underline">' + newArrs[i].fn + '</a></span><span style="display:' + isMsg + '">' + newArrs[i].content + '</span></div></li>';
                    }

                    $('.chat_list').append(comments);

                    wrapper.refresh();
                    wrapper.scrollToElement('.chat_list li:last-child',100);

                    console.log(wrapper);
                }
            },
            error: function(xhr, status, err) {
                alert('系统开了小差，请刷新页面');
                console.log('get GroupInfo error!');
            }
        });
    }

    $('#close_question').on('click', function() {
        if (!session || !qid || !targetUri) return;
        window.location.href = 'evaluate.html?session=' + session + '&qid=' + qid + '&tu=' + targetUri+'&userUri=' + userUri;
    })

    // 点击返回首页
    $('.chat_goHome').on('click',function(){
      var ownUri = Common.getUrlParam('ownUri');
      var ida = Common.getUrlParam('ida')?Common.getUrlParam('ida'):0;
      console.log(Common.globalDistUrl() + 'usr/ThirdHomePage.do?ownUri=' + ownUri+'&ida='+ida);
      $.ajax({
        type : 'POST',
        url : Common.globalDistUrl() + 'usr/ThirdHomePage.do?ownUri=' + ownUri,
        success : function(data){
          console.log(data);
          if(data.c == 1999){
            alert(name+'律师还没有创建工作室！')
          }else{
            window.location.href = Common.globalDistUrl() + 'usr/ThirdHomePage.do?ownUri=' + ownUri+'&ida='+ida;
          }
        },
        error : function(){
          alert('网络连接错误或服务器异常！')
        } 
      })
      // window.location.href = Common.globalDistUrl() + 'usr/ThirdHomePage.do?ownUri=' + ownUri+'&ida='+ida;
    }) 

    function judgeType(msgtype, ossname) {
      // msgtype  1  表示文件和图片   msgtype  12  表示音频文件
        if (msgtype == 1 || msgtype == 12) {
            if (ossname) {
                if (ossname.indexOf('.jpg') > -1 || ossname.indexOf('.jpeg') > -1 || ossname.indexOf('.png') > -1) {
                    return 'img'
                } else if (ossname.indexOf('.doc') > -1 || ossname.indexOf('.docx') > -1 || ossname.indexOf('.xls') > -1 || ossname.indexOf('.xlsx') > -1 || ossname.indexOf('.ppt') > -1 || ossname.indexOf('.ppt') > -1 || ossname.indexOf('.pptx') > -1 || ossname.indexOf('.pdf') > -1) {
                    return 'txt'
                } else {
                    return 'unknown'
                }
            }
        }
    }

    function uuidCompact() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //时间格式化
    Date.prototype.Format = function(fmt) { //author: meizz   
        var o = {
            "M+": this.getMonth() + 1, //月份   
            "d+": this.getDate(), //日   
            "h+": this.getHours(), //小时   
            "m+": this.getMinutes(), //分   
            "s+": this.getSeconds(), //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    function isRepeat(theone,all){
      for(var i=0;i<all.length;i++){
        if(all[i].mi == theone){
          return true;
        }
      }
      return false;
    }

    function init() {
        session = Common.getUrlParam('session');
        qid = Common.getUrlParam('qid');
        gi = Common.getUrlParam('groupId');
        userUri = Common.getUrlParam('userUri');
        st = Common.getUrlParam('st');
        // console.log(session);
        wxSignature();
        getUserToken();
        getGroupInfo();
        var status = Common.getUrlParam('status');
        if(status == 'chat'){
          $('.chat_box').show();
          $('.evaluate_box').hide();
          $('.chat_goHome').hide();
        }else if(status == 'close'){
          $('.chat_box').hide();
          $('.evaluate_box').show();
          $('.chat_goHome').hide();
          getUserContent();
        }else if(status == 'chatLawyers'){
          $('.chat_box').show();
          $('.evaluate_box').hide();
          $('.chat_goHome').show();
          $('#close_question').hide();
        }
  }
    init();

});


function getUserContent(){
  var userUri = Common.getUrlParam('userUri');
  $.ajax({
    type: 'GET',
    url: Common.globalDistUrl() + 'usr/GetLastEvaluate.do?session='+session+'&qi='+qid+'&uri='+userUri,
    success: function(data){
      console.log(data);
      if(data.co){
        $('.evaluate_box .evaluate_con').html(data.co);
      }else{
        $('.evaluate_box .evaluate_con').html('暂无评论');
      }
    },
    error: function(){
      alert('网络连接错误或服务器异常！')
    }
  })
}
// 跳转到收费名片调起支付
function weixinpay(mi){
  var sess = Common.getUrlParam('session');
  var url = '';
  var str = window.location.href;
  if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
    url = 'http://t-mshare.green-stone.cn'
  }else{
    url = 'http://mshare.green-stone.cn'
  }
  window.location.href = url + '/htm/react/card.html?session='+sess+'&mi='+mi+'&expType='+expType+'&locate='+encodeURI(str);
}


function gotoSingle(src){
      console.log(src);
      var photoLists = [];
      photoLists.push(src);
      wx.ready(function() {
          wx.checkJsApi({
              jsApiList: ['previewImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
              success: function(res) {
                // alert(JSON.stringify(res));
                  // 以键值对的形式返回，可用的api值true，不可用为false
                  // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
              }
          });
          wx.previewImage({
              current: src,// 当前显示图片的http链接
              urls: photoLists
          });
      });
    }

  function wxSignature() {
      console.log('wxSignature');
      var uri = encodeURIComponent(window.location.href);
      $.ajax({
          type: 'get',
          url: Common.globalDistUrl()+'usr/ThirdJSapiSignature.do?apath=' + uri,
          success: function(data) {
              // alert('location:' + JSON.stringify(data));
              if (data.c == 1000) {
                  wx.config({
                      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                      appId: data.appId, // 必填，公众号的唯一标识
                      timestamp: data.timestamp, // 必填，生成签名的时间戳
                      nonceStr: data.noncestr, // 必填，生成签名的随机串
                      signature: data.signature, // 必填，签名，见附录1
                      jsApiList: ['checkJsApi','previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                  });

                  wx.error(function(res) {
                      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                      console.log(res.errMsg);
                  });

              } else if(data.c == 1040){
                  console.log("避开微信认证");
              }  else {
                  alert('wx preview code:' + data.c + ',error:' + data.d);
              }
          },
          error: function(xhr, status, err) {
              alert('系统开了小差，请刷新页面');
          }
      });
    }

function fixSrc(src) {
    // console.log(src);
    var temp = src.split('.')[0];
    return temp;
}

function viewDoc(name) {
    console.log('name:' + name);
    var tempObj = {
        ossFN: name,
        newFN: fixSrc(name) + '.html'
    }

    $.ajax({
        type: 'post',
        url: Common.globalDistUrl() + 'data/CommConvert.do?session=' + session,
        data: JSON.stringify(tempObj),
        success: function(data) {
            console.log(data);
            if (data.c == 1000) {
                // console.log(Common.globalTransferUrl()+fixSrc(docname)+'.html');
                window.location.href = 'empty.html?name=' + fixSrc(name);
            }else if(data.c == 1999){
              alert('打开文档失败');
            }
        },
        error: function(xhr, status, err) {
            alert('系统开了小差，请刷新页面');
        }
    });
}







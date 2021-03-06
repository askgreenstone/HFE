var session;
var payParams;
var pageImg = [];
var username = '';
var userpass = '';
var appKey = '';
var scroll_offset = 0;
var qid, gi;
var targetUri = '';
var lawyerName = '';
var globalTs = '';
var sendMsgTs = new Date().getTime();
var globalMsgList = [];
var expType = '';
var st;
var doubleClickFlag = true;


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
                theOne = '<li class="' + tempClass + '"><div class="chat_list_head"><img src="' + tempHeader + '"><i>' + message.ext.nm + '</i></div><div class="chat_list_content"><span style="text-align:center;display:inline-block"><img height="150" onclick="gotoSingle(\''+Common.globalTransferUrl()+message.ext.on+'\')"  src="' +Common.globalTransferUrl()+ message.ext.on + '@350w"/></span></div></li>';
            }else if(message.ext.bdid){
                theOne = '<li class="' + tempClass + '"><div class="chat_list_head"><img src="' + tempHeader + '"><i>' + message.ext.nm + '</i></div><div class="chat_list_content"><span style="display:inline-block" onclick="viewBaiduDoc(\'' + message.ext.bdid + '\')">文档：<a href="javascript:void(0);" style="text-decoration:underline">' + message.ext.fn + '</a></span></div></li>';
            }else if(judgeType(message.ext.mt, message.ext.on) == 'txt'){
                theOne = '<li class="' + tempClass + '"><div class="chat_list_head"><img src="' + tempHeader + '"><i>' + message.ext.nm + '</i></div><div class="chat_list_content"><span style="display:inline-block" onclick="viewDoc(\'' + message.ext.on + '\')">文档：<a href="javascript:void(0);" style="text-decoration:underline">' + message.ext.fn + '</a></span></div></li>';
            }else if(message.ext.mt == 8 || message.ext.mt == 9 || message.ext.mt == 99){
                theOne = '<li class="' + tempClass + '"><div class="chat_list_head"><img src="' + tempHeader + '"><i>' + message.ext.nm + '</i></div><div class="chat_list_content"><span style="display:inline-block">收费名片<br/>收款方：'+message.ext.nm+'<br/>收费项目：'+message.data+'<br/>收费金额：'+formartDecimal(message.ext.p)+' 元<br/>备注信息：'+extra+'<br/><a onClick="weixinpay(\''+message.ext.mi+'\')" style="text-decoration:underline" href="javascript:void(0);">点击此处，立即支付</a></span></div></li>';
            }else{
                theOne = '<li class="' + tempClass + '"><div class="chat_list_head"><img src="' + tempHeader + '"><i>' + message.ext.nm + '</i></div><div class="chat_list_content"><span>' + message.data + '</span></div></li>';
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
                            bdid: data.s[i].p.ext.bdid,
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
                        var isBaiduDoc = newArrs[i].bdid ? 'inline-block' : 'none';
                        var isPay = newArrs[i].pay ? 'inline-block' : 'none';
                        var isMsg = newArrs[i].pic || newArrs[i].doc || newArrs[i].pay || newArrs[i].bdid ? 'none' : 'inline-block';
                        comments += '<li  class="js_chat_ts"><i>' + new Date(newArrs[i].ts).Format('yyyy-MM-dd hh:mm:ss') + '</i></li><li class="' + temp + '"><div class="chat_list_head"><img src="' + newArrs[i].img + '"><i>' + newArrs[i].name + '</i></div><div class="chat_list_content"><span style="display:' + isPay + '">收费名片<br/>收款方：'+newArrs[i].name+'<br/>收费项目：'+newArrs[i].content+'<br/>收费金额：'+formartDecimal(newArrs[i].pay)+' 元<br/>备注信息：'+newArrs[i].extra+'<br/><a onClick="weixinpay(\''+newArrs[i].mi+'\')" style="text-decoration:underline" href="javascript:void(0);">点击此处，立即支付</a></span><span style="text-align:center;display:' + isPic + '"><img height="150" onclick="gotoSingle(\''+newArrs[i].pic+'\')"  src="' + newArrs[i].pic + '@350w"/></span><span style="display:' + isDoc + '" onclick="viewDoc(\'' + newArrs[i].docName + '\')">文档：<a href="javascript:void(0);" style="text-decoration:underline">' + newArrs[i].fn + '</a></span><span style="display:' + isDoc + '" onclick="viewBaiduDoc(\'' + newArrs[i].bdid + '\')">文档：<a href="javascript:void(0);" style="text-decoration:underline">' + newArrs[i].fn + '</a></span><span style="display:' + isMsg + '">' + newArrs[i].content + '</span></div></li>';
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

    //多次点击控制
    function controlTimes(){
      if(doubleClickFlag){
          gotoConsult();
          doubleClickFlag = false;
      }
      setTimeout(function(){
          doubleClickFlag = true;
      },1000);
    }


    // 发送聊天
    $('#chat_btn').bind('click', controlTimes);


    function gotoConsult() {
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
    }

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
                            lawyerName = data.en;
                            expType = data.mb[i].expt;
                            console.log(lawyerName);
                            getFeedTimeLine(data.mb[i].i);
                            console.log(targetUri);
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
                            bdid: data.s[i].p.ext.bdid,
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
                        var isBaiduDoc = newArrs[i].bdid ? 'inline-block' : 'none';
                        var isPay = newArrs[i].pay ? 'inline-block' : 'none';
                        var isMsg = newArrs[i].pic || newArrs[i].doc || newArrs[i].pay || newArrs[i].bdid ? 'none' : 'inline-block';
                        comments += '<li  class="js_chat_ts"><i>' + new Date(newArrs[i].ts).Format('yyyy-MM-dd hh:mm:ss') + '</i></li><li class="' + temp + '"><div class="chat_list_head"><img src="' + newArrs[i].img + '"><i>' + newArrs[i].name + '</i></div><div class="chat_list_content"><span style="display:' + isPay + '">收费名片<br/>收款方：'+newArrs[i].name+'<br/>收费项目：'+newArrs[i].content+'<br/>收费金额：'+formartDecimal(newArrs[i].pay)+' 元<br/>备注信息：'+newArrs[i].extra+'<br/><a onClick="weixinpay(\''+newArrs[i].mi+'\')" style="text-decoration:underline" href="javascript:void(0);">点击此处，立即支付</a></span><span style="text-align:center;display:' + isPic + '"><img height="150" onclick="gotoSingle(\''+newArrs[i].pic+'\')" src="' + newArrs[i].pic + '"/></span><span style="display:' + isDoc + '" onclick="viewDoc(\'' + newArrs[i].docName + '\')">文档：<a href="javascript:void(0);" style="text-decoration:underline">' + newArrs[i].fn + '</a></span><span style="display:' + isBaiduDoc + '" onclick="viewBaiduDoc(\'' + newArrs[i].bdid + '\')">文档：<a href="javascript:void(0);" style="text-decoration:underline">' + newArrs[i].fn + '</a></span><span style="display:' + isMsg + '">' + newArrs[i].content + '</span></div></li>';
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

    // 关闭问题
    $('#close_question').on('click', function() {
        if (!session || !qid || !targetUri) return;
        window.location.href = 'evaluate.html?session=' + session + '&qid=' + qid + '&tu=' + targetUri+'&userUri=' + userUri+'&st='+st;
    })

    // 点击返回首页
    $('.chat_goHome').on('click',function(){
      var ownUri = Common.getUrlParam('ownUri')?Common.getUrlParam('ownUri'):targetUri;
      var ida = Common.getUrlParam('ida')?Common.getUrlParam('ida'):0;
      var st = Common.getUrlParam('st')?Common.getUrlParam('st'):'3';
      console.log(Common.globalDistUrl() + 'usr/ThirdHomePage.do?ownUri=' + ownUri+'&ida=0');
      $.ajax({
        type : 'POST',
        url : Common.globalDistUrl() + 'usr/ThirdHomePage.do?ownUri=' + ownUri+'&ida=0',
        success : function(data){
          console.log(data);
          if(data.c == 1999){
            $('.chatList_index_no').show();
            if(ida == 1){
                $('.chatList_index_no').text(lawyerName+'未创建主页！');
            }else{
                $('.chatList_index_no').text(lawyerName+'律师未创建主页！');
            }
            // alert(lawyerName+'律师还没有创建工作室！')
          }else{
            window.location.href = Common.globalDistUrl() + 'usr/ThirdHomePage.do?ownUri=' + ownUri+'&ida=0'+'&st='+st;
          }
        },
        error : function(){
          alert('网络连接错误或服务器异常！')
        } 
      })
      // window.location.href = Common.globalDistUrl() + 'usr/ThirdHomePage.do?ownUri=' + ownUri+'&ida='+ida;
    }) 

    
    // 点击去往动态详情页面
    $('.chatList_lawyer').on('click',function(){
      var session = Common.getUrlParam('session');
      var usrUri = Common.getUrlParam('usrUri');
      var ida = Common.getUrlParam('ida')?Common.getUrlParam('ida'):0;
      var idf = Common.getUrlParam('idf')?Common.getUrlParam('idf'):0;
      var fid = $('.chatList_lawyer').attr('fid');
      location.href =  Common.globalDistUrl()+'usr/FeedDetailRedirct.do?ownUri='+targetUri+'&fid='+fid+'&session='+session+'&usrUri='+usrUri+'&ida='+ida+'&idf='+idf;
    });
    // 点击去往时间轴页面
    $('.chatList_index_close_dynamic').on('click',function(){
      var session = Common.getUrlParam('session');
      var usrUri = Common.getUrlParam('usrUri');
      var ida = Common.getUrlParam('ida')?Common.getUrlParam('ida'):0;
      var idf = Common.getUrlParam('idf')?Common.getUrlParam('idf'):0;
      var fid = $('.chatList_lawyer').attr('fid');
      location.href =  Common.globalDistUrl()+'mobile/#/TimeAxis?ownUri='+targetUri+'&session='+session+'&usrUri='+usrUri+'&ida='+ida+'&idf='+idf;
    });
    
    

    function judgeType(msgtype, ossname) {
      // msgtype  1  表示文件和图片   msgtype  12  表示音频文件
        if (msgtype == 1 || msgtype == 12) {
            if (ossname) {
                if (ossname.indexOf('.jpg') > -1 || ossname.indexOf('.jpeg') > -1 || ossname.indexOf('.png') > -1) {
                    return 'img'
                } else if (ossname.indexOf('.doc') > -1 || ossname.indexOf('.docx') > -1 || ossname.indexOf('.xls') > -1 || ossname.indexOf('.xlsx') > -1 || ossname.indexOf('.ppt') > -1 || ossname.indexOf('.pptx') > -1 || ossname.indexOf('.pdf') > -1) {
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
        userUri = Common.getUrlParam('usrUri');
        st = Common.getUrlParam('st')?Common.getUrlParam('st'):'3';
        // console.log(session);
        wxSignature();
        getUserToken();
        getGroupInfo();
        var status = Common.getUrlParam('status');
        if(status == 'chat'){
          $('.chat_box').show();
          $('#close_question').show();
          $('.evaluate_box').hide();
        }else if(status == 'close'){
          $('.chat_box').hide();
          $('#close_question').hide();
          $('.evaluate_box').show();
          getUserContent();
        }else if(status == 'chatLawyers'){
          $('.chat_box').show();
          $('.evaluate_box').hide();
          $('#close_question').hide();
        }
        var timer = null;
        $('.chat_inp').on('focus', function() {
            clearInterval(timer);
            var index = 0;
            timer = setInterval(function() {
                if(index>5) {
                    $('body').scrollTop(1000000);
                    clearInterval(timer);
                }
                index++;
            }, 50)
        })
  }
    init();

});


function getUserContent(){
  var userUri = Common.getUrlParam('usrUri');
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

// 乔凡：新增百度文档预览2017年7月10日
function viewBaiduDoc(bdid){
    console.log(bdid);
    window.location.href = 'baiduDoc.html?bdid=' + bdid;
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
function getFeedTimeLine(ownUri) {
    $.ajax({
        type: 'get',
        url: Common.globalDistUrl() + 'usr/FeedTimeline.do?ownUri=' + ownUri+'&c=1&idf=0&p=0',
        success: function(data) {
            console.log(data);
            if (data.c == 1000) {
                if(data.r.fl[0]){
                    $('.chatList_lawyer_img').attr('src',data.r.fl[0].p?(Common.globalTransferUrl()+data.r.fl[0].p):(Common.globalTransferUrl()+'header.jpg'));
                    $('.chatList_lawyer').attr('fid',data.r.fl[0].fid);
                    $('.chatList_lawyer_title').text(data.r.fl[0].title);
                    $('.chatList_lawyer_desc').text(data.r.fl[0].content?(data.r.fl[0].content.length>20?(data.r.fl[0].content.substr(0,20)+'...'):data.r.fl[0].content):(data.r.fl[0].cil[0].content.length>20?data.r.fl[0].cil[0].content.substr(0,20)+'...':data.r.fl[0].cil[0].content));
                    $('.chatList_lawyer_time').text(new Date(data.r.fl[0].ts).Format('yyyy-MM-dd'));
                    $('.chatList_lawyer_nice').text(data.r.fl[0].rnum);
                    $('.chatList_lawyer_tip').text(data.r.fl[0].cnum);
                    $('.chatList_lawyer_read').text(data.r.fl[0].readnum);
                }else{
                    $('.chatList_lawyer').hide();
                    $('.chatList_index_content_box').hide();
                   console.log(data);
                }
                console.log(lawyerName);
                $('.chatList_lawyer_name span').text(lawyerName);
            }
        },
        error: function(xhr, status, err) {
            alert('系统开了小差，请刷新页面');
        }
    });
}
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







var session;
var payParams;
var pageImg = [];
var username = '';
var userpass = '';
var appKey = '';
var scroll_offset = 0;
var qid;
var targetUri='';

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
            var tempClass = message.ext.f.indexOf('e')>-1?'chat_list_exp':'chat_list_usr';
            var tempHeader = message.ext.up?(Common.globalTransferUrl()+message.ext.up):pageImg[1].wxpor;
            var theOne = '<li class="'+tempClass+'"><div class="chat_list_head"><img src="'+tempHeader+'"><i>'+message.ext.nm+'</i></div><div class="chat_list_content"><span>'+message.data+'</span></div></li>';
            // var timeStep = (new Date().getTime() - message.ext.ts < 30000)?'block':'none';
            // $('.chat_list').append('<li style="display:'+timeStep+'" class="js_chat_ts"><i>'+new Date(message.ext.ts).Format('yyyy-MM-dd hh:mm:ss')+'</i></li>'+theOne);
            $('.chat_list').append('<li class="js_chat_ts"><i>'+new Date(message.ext.ts).Format('yyyy-MM-dd hh:mm:ss')+'</i></li>'+theOne);

            $('.chat_list').animate({
              scrollTop:$('.chat_list')[0].scrollHeight
            },800);
            console.log("收到文本消息！");
        },
        //当连接关闭时的回调方法
        onClosed: function() {
            conn.clear();
            conn.onClosed();
        },
        onError: function(message) {
          console.log(message);
        }
    })

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

    $("#chat_btn").on('click', function() {
        // sendText();
        var userInput = $('.chat_inp').val(),
            gi = Common.getUrlParam('groupId'),
            userUri = Common.getUrlParam('groupId');
        // console.log(userInput);
        if (!userInput) {
            alert('发送消息不能为空！');
            return;
        }
        if (!session || !gi ||!userUri) return;
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
                    f:userUri
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
                        $('.chat_list').animate({
                          scrollTop:$('.chat_list')[0].scrollHeight
                        },800);
                    }
                }
            },
            error: function(xhr, status, err) {
                alert('系统开了小差，请刷新页面');
            }
        });
    })

    function getGroupInfo() {
        var sess = Common.getUrlParam('session'),
            gi = Common.getUrlParam('groupId');
        if (!sess || !gi) return;
        $.ajax({
            type: 'get',
            url: Common.globalDistUrl() + 'usr/GroupInfo.do?session=' + sess + '&gi=' + gi,
            success: function(data) {
                console.log(data);
                if (data.c == 1000) {
                    getMsgList(gi, sess, data.mb);
                    pageImg = data.mb;
                    for (var i = 0; i < data.mb.length; i++) {
                        if (data.mb[i].i.indexOf('e') > -1) {
                            targetUri = data.mb[i].i;
                            // console.log(targetUri);
                        }
                    }
                }
            },
            error: function(xhr, status, err) {
                alert('系统开了小差，请刷新页面');
            }
        });
    }

    function getMsgList(gi, sess, mb) {
        var ts = new Date().getTime();
        $.ajax({
            type: 'get',
            url: Common.globalDistUrl() + 'usr/GroupMsgList.do?session=' + sess + '&gi=' + gi + '&o=0&t=0&c=1000&ts=' + ts,
            success: function(data) {
                // console.log(data);
                if (data.c == 1000) {
                    var newArrs = [];
                    $('#msgCount').text(data.s.length);
                    for (var i = 0; i < data.s.length; i++) {
                        newArrs.push({
                            type: data.s[i].f.indexOf('u') > -1 ? true : false, //类型：专家或者用户
                            img: data.s[i].f.indexOf('u') > -1 ? (mb[1].wxpor ? mb[1].wxpor : 'image/header.jpg') : Common.globalTransferUrl() + mb[0].p,
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
                    // newArrs.sort(function(obj1, obj2) {
                    //     return obj1['ts'] > obj2['ts'] ? -1 : 1;
                    // });

                    // console.log(newArrs);
                    var comments = '';
                    // var lastTime = '';
                    $('.chat_list').empty();
                    for (var i = 0; i < newArrs.length; i++) {
                        // lastTime = newArrs[newArrs.length-1].ts;
                        var temp = newArrs[i].type ? 'chat_list_usr' : 'chat_list_exp';
                        comments += '<li style="display:none;" class="js_chat_ts"><i>'+new Date(newArrs[i].ts).Format('yyyy-MM-dd hh:mm:ss')+'</i></li><li class="' + temp + '"><div class="chat_list_head"><img src="' + newArrs[i].img + '"><i>' + newArrs[i].name + '</i></div><div class="chat_list_content"><span>' + newArrs[i].content + '</span></div></li>';
                    }

                    $('.chat_list').append(comments);
                    
                    $('.chat_list').animate({
                      scrollTop:$('.chat_list')[0].scrollHeight
                    },800);
                }
            },
            error: function(xhr, status, err) {
                alert('系统开了小差，请刷新页面');
                // console.error(this.props.url, status, err.toString());
            }
        });
    }

    $('#close_question').on('click',function(){
        if(!session || !qid || !targetUri) return;
        window.location.href = 'evaluate.html?session='+session+'&qid='+qid+'&tu='+targetUri;
    })

    function judgeType(msgtype, ossname) {
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

    function fixSrc(src) {
        // console.log(src);
        var temp = src.split('.')[0];
        return temp;
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


    function init() {
        session = Common.getUrlParam('session');
        qid = Common.getUrlParam('qid');
        // console.log(session);
        getUserToken();
        getGroupInfo();
    }

    init();

});



// conn.init({
//     //收到文本消息时的回调方法
//     onTextMessage: function(message) {
//         //console.log(message);
//         //alert("发送消息成功");    
//         var from = message.from; //消息的发送者
//         var mestype = message.type; //消息发送的类型是群组消息还是个人消息
//         var messageContent = message.data; //文本消息体
//         if (mestype == 'groupchat') {
//             //进行群组消息页面处理  
//         } else {
//             //进行个人消息页面处理  
//         }
//     }
// });

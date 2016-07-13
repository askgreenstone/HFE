var session;
var payParams;
$(document).ready(function() {
    init();
});


function init() {
    session = Common.getUrlParam('session');
    console.log(session);
    getGroupInfo();
}

$('#chat_btn').bind('click', function(event) {
    console.log('sending~');
    websocket.send('wangjt test!');
});

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
                        // that.setState({expt:data.mb[i].f});
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
            console.log(data);
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
                newArrs.sort(function(obj1, obj2) {
                    return obj1['ts'] > obj2['ts'] ? -1 : 1;
                });
                // that.setState({msgList:newArrs}); 
            }
        },
        error: function(xhr, status, err) {
            alert('系统开了小差，请刷新页面');
            // console.error(this.props.url, status, err.toString());
        }
    });
}

function judgeType(msgtype,ossname){
  if(msgtype == 1 || msgtype == 12){
    if(ossname){
      if(ossname.indexOf('.jpg')>-1 || ossname.indexOf('.jpeg')>-1 || ossname.indexOf('.png')>-1){
        return 'img'
      }else if(ossname.indexOf('.doc')>-1 || ossname.indexOf('.docx')>-1 || ossname.indexOf('.xls')>-1 || ossname.indexOf('.xlsx')>-1 || ossname.indexOf('.ppt')>-1 || ossname.indexOf('.ppt')>-1 || ossname.indexOf('.pptx')>-1 || ossname.indexOf('.pdf')>-1){
        return 'txt'
      }else{
        return 'unknown'
      }
    }
  }
}

function fixSrc(src){
  console.log(src);
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
Date.prototype.Format = function(fmt)   
{ //author: meizz   
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

var session;
$(document).ready(function() {
  init();
});


function init(){
  session = Common.getUrlParam('session');
  console.log(session);
  getQuestionList();
}



function getQuestionList(){
	$.ajax({
    type: 'GET',
    url: Common.globalDistUrl() + 'usr/MyQuestionList.do?session='+session,
    success: function(data) {
        //alert( 'success:' + JSON.stringify(data) );
        console.log(data);
        var html = '';

        if (data.c == 1000) {
          for(var i=0;i<data.ql.length;i++){
            // ic  状态码  0未解决 1已关闭
            // s 状态码 0未抢答  1已抢答
            // ip 状态码  0未支付   1已支付
          	if(data.ql[i].ic == 0){
          		str = '<span class="que_list_unsolved">未解决</span>';
          	}else{
          		str = '<span class="que_list_close">已关闭</span>';
          	}
            if(data.ql[i].ip == 0){
              status = '<span class="que_list_unsolved">未支付</span>';
            }else if(data.ql[i].s == 0){
          		status = '<span class="que_list_unsolved">未抢答</span>';
          	}else{
          		status = '<span class="que_list_close">已抢答</span>';
          	}
          	html+='<li id="'+data.ql[i].qi+'" data-gi="'+data.ql[i].gi+'" data-s="'+data.ql[i].s+'" data-ic="'+data.ql[i].ic+'" data-ip="'+data.ql[i].ip+'" data-b="'+data.ql[i].b+'" >'
								+'<span class="que_list_money">￥'+data.ql[i].b+'元</span>'
								+'<span>'+data.ql[i].co+'</span>'
								+'<br/>'
								+status
								+'<span class="que_list_time">'+ getDate(data.ql[i].ts) +'</span>'
								+str
								+'</li>'
          }
          // console.log(html);
          $('.que_list').html(html);
        }
    },
    error: function(err) {
      alert('网络连接错误或服务器异常！');
    }
  });
}


// 点击li跳转问题详情页
$('.que_list').on('click','li',function(){
	console.log($(this).attr('id'));
	var qid = $(this).attr('id');
	var groupId = $(this).attr('data-gi');
	var userUri = Common.getUrlParam('userUri');
	var status = $(this).attr('data-s');
  var ic = $(this).attr('data-ic');
  var ip = $(this).attr('data-ip');
  var bound = $(this).attr('data-b');
	if(!session || !qid || !userUri || !groupId) return;
  if(ip == 0){
    onTrade(groupId,bound);
  }else if(status == 0){
		alert('该问题尚未被专家抢答！');
		getQuestionList();
	}else if(ic == 0){
		window.location.href = 'chatList.html?session='+session+'&qid='+qid+'&userUri='+userUri+'&groupId='+groupId+'&status=chat';
	}else if(ic == 1){
    window.location.href = 'chatList.html?session='+session+'&qid='+qid+'&userUri='+userUri+'&groupId='+groupId+'&status=close';
  }
})


function onTrade(questionId,bound){
  var payInfo = {
        'd': '发布悬赏', //描述
        'dt': 0, //int 目标类型，0 系统 1 用户 2 专家
        'f': bound, //float 交易金额
        'p': 2, //int 支付方式，0 账户余额 1 支付宝 2 微信支付
        't': 27, //int 交易类型。悬赏提问
        'from': 3, //int 客户端来源 3 web
        'gi': questionId   //问题ID，标志参数
      };
  $.ajax({
        type: 'POST',
        url: Common.globalDistUrl() + 'usr/Trade.do?session=' + session,
        data: JSON.stringify(payInfo),
        dataType: 'json',
        success: function(data) {
            //alert( 'success:' + JSON.stringify(data) );
            console.log(data);
            if (data.c == 1000) {
                payParams = {
                    'appId': data.appId,
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.packageStr,
                    'signType': 'MD5',
                    'paySign': data.paySign
                }
                callPay();
            } else {
                alert('Trade error:' + data.d);
            }

        },
        error: function(err) {
            alert('error:' + JSON.stringify(err));
        }
      });
}

function onBridgeReady() {
    //alert('onBridgeReady run');
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', payParams,
        function(res) {

            //if (res.err_msg == "get_brand_wcpay_request：ok") {} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
            WeixinJSBridge.log(res.err_msg);
            // alert(res.err_code+res.err_desc+res.err_msg);
            if (res.err_msg.indexOf('ok') > -1) {
              // alert('tit:'+icObj.it+',month:'+icObj.lt+',ic:'+ic);
                // alert('支付成功！')
                window.location.href = 'questionList.html?session=' + session+'&userUri='+userUri;
                // location.href = '/htm/react/success.html';
            } else if (res.err_msg.indexOf('cancel') > -1) {
                //alert('取消支付！');
            } else if (res.err_msg.indexOf('fail') > -1) {
                alert('支付失败！');
            }
        }
    );
}

function callPay() {
    //alert('callPay run');
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else {
        onBridgeReady();
    }
}


// 点击咨询新问题跳转发布问题页
$('#pub_btn').click(function(){
	var userUri = Common.getUrlParam('userUri');
	window.location.href = 'publishQuestions.html?session='+session+'&userUri='+userUri;
})


function getDate(time){
	var now = new Date().getTime();
	var result = (now - time)/1000/60/60/24;
	if(result >=1){
		return Math.floor(result) + '天前';
	}else if(result*24<0.25){
		return '刚刚';
	}else{
    return Math.floor(result*24) + '小时前';
  }
}





var session;
var payParams;
$(document).ready(function() {
  init();
});


function init(){
  session = Common.getUrlParam('session');
  console.log(session);
}



// 选中金额
$('.pub_money_box li').bind('click', function(){
  $(this).addClass('active').siblings().removeClass('active');
})
//调起支付
$('#pub_btn').bind('click', function() {
    var text = $('.pub_area').val();
    var bound = $('.pub_money_box li.active').text();
    if(!text){
      alert('请填写您要咨询的问题！');
      return; 
    }
    var data = {
       'c': text, //问题描述
       'b': bound //int 金额
    }
    $.ajax({
      type: 'POST',
      url: Common.globalDistUrl() + 'usr/Commit.do?session=' + session,
      data: JSON.stringify(data),
      dataType: 'json',
      success:function(data){
        console.log(data);
        if(data.c == 1000){
          if(bound == 0){
            window.location.href = 'questionList.html?session=' + session;
          }else{
            onTrade(data.qi,bound);
          }  
        }
      },
      error:function(){
        alert('网络连接错误或服务器异常！')
      }
    })
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
                window.location.href = 'questionList.html?session=' + session;
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

//获取url中的参数
function getUrlParams(p) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {};
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[p.toLowerCase()];
    if (typeof(returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}
var session;
$(document).ready(function() {
  init();
});


function init(){
  session = Common.getUrlParam('session');
  console.log(session);
}



// 选中金额
$('.pub_money_box').bind('click', function(){
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
    console.log(Common.globalDistUrl() + 'usr/Commit.do?session=' + session);
    if(bound == 0){
      $.ajax({
        type: 'POST',
        url: Common.globalDistUrl() + 'usr/Commit.do?session=' + session,
        data: {
          c: text,
          b: 0
        },
        success:function(data){
          console.log(data);
          // window.location.href = '.html?session=' + session
        },
        error:function(){questionList
          alert('网络连接错误或服务器异常！')
        }
      })
    }else{
      var payInfo = {
            'd': '发布悬赏', //描述
            'dt': 0, //int 目标类型，0 系统 1 用户 2 专家
            'f': bound, //float 交易金额
            'p': 2, //int 支付方式，0 账户余额 1 支付宝 2 微信支付
            't': 26, //int 交易类型。增加23年 24，25
            'from': 3, //int 客户端来源 3 web
          }
      $.ajax({
        type: 'POST',
        url: Common.globalDistUrl + '/usr/Trade.do?session=' + session,
        data: JSON.stringify(payInfo),
        dataType: 'json',
        success: function(data) {
            //alert( 'success:' + JSON.stringify(data) );
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
})

function onBridgeReady() {
    //alert('onBridgeReady run');
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', payParams,
        function(res) {

            //if (res.err_msg == "get_brand_wcpay_request：ok") {} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
            WeixinJSBridge.log(res.err_msg);
            //alert(res.err_code+res.err_desc+res.err_msg);
            if (res.err_msg.indexOf('ok') > -1) {
              // alert('tit:'+icObj.it+',month:'+icObj.lt+',ic:'+ic);
                var tempTit = ic?icObj.it:curPayInfo.it,
                    tempMon = ic?icObj.lt:curPayInfo.lt;
                //清除脏数据
                localStorage.setItem('discountItem', '');
                  // alert('tit:'+tempTit+',month:'+tempMon);
                location.href = '/htm/react/success.html?payTitle='+encodeURI(tempTit)+'&payMonth='+encodeURI(tempMon);
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
//常用公用方法封装
var CommonMixin = {
  //本地兼容：检测是测试环境还是正式环境
  checkDevOrPro: function(){
    var str = window.location.href;
    if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
      return 'e399';
      //临时添加
      // return 'e2103';
    }else{
      return 'e442';
    }
  },
  //发送微信错误
  sendWxMsg: function(appid,error){
      $.ajax({
        type: 'post',
        url: global.url+'/comm/SendWeixinWarnSms.do',
        data:JSON.stringify({'ai':appid,'em':error}),
        success: function(data) {
            // alert('ThirdRedirect:' + JSON.stringify(data));
            if (data.c == 1000) {

            } else {
                this.showAlert('code:' + data.c + ',error:' + data.d);
            }
        },
        error: function(xhr, status, err) {
            this.showRefresh('系统开了小差，请刷新页面');
            console.error(this.props.url, status, err.toString());
        }
    });
  },
  //获取url参数
  getUrlParams: function(p) {
      var url = location.href;
      var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
      var paraObj = {};
      for (var i = 0, j = 0; j = paraString[i]; i++) {
          paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
      }
      var returnValue = paraObj[p.toLowerCase()];
      if (typeof(returnValue) == "undefined") {
          return "";
      } else {
          return returnValue;
      }
  },
  //分享链接异常处理
  fixWxUrl: function(url){
    // var a='http://dist.green-stone.cn/mobile/?from=singlemessage&isappinstalled=0#/index002?ownUri=e442&_k=v8x6jb';
    var newUrl = '';
    if(url.indexOf('?from=singlemessage&isappinstalled=0#')>-1){
      newUrl = url.replace('?from=singlemessage&isappinstalled=0#','#');
    }else{
      newUrl = url;
    }
    console.log('newUrl:'+newUrl+',url:'+url);
    return newUrl;
  },
  //检测android客户端
  isAndroid: function(){
    var u = navigator.userAgent, 
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    return isAndroid;
  },
  //检测ios客户端
  isIOS: function(){
    var u = navigator.userAgent, 
        app = navigator.appVersion;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isiOS;
  },
  // 检测wechat客户端
  isWechat: function() {  
    var ua = navigator.userAgent.toLowerCase();
    return /micromessenger/i.test(ua) || typeof navigator.wxuserAgent !== 'undefined';
  },
  showAlert: function(content,callback){
    //调用：this.showAlert('提交成功！');
    $('.base_shadow').show();
    $('.base_alert').show().siblings().hide();
    $('.base_alert span').text(content);
    $('.base_shadow').click(function(event) {
      console.log(event.target.id);
      $('.base_shadow').hide();
      if(event.target.id == 'base_alert_confirm'){
        if(typeof (callback) == 'function'){
          callback()
        }
      };
    });
  },
  showRefresh: function(content){
    //调用：this.showRefresh('系统开了小差，请刷新页面');
    $('.base_shadow').show();
    $('.base_reFresh').show().siblings().hide();
    $('.base_reFresh span').text(content);
  },
  showConfirm: function(content,callback1,callback2){
    //调用：this.showConfirm('操作成功！');
    $('.base_shadow').show();
    $('.base_confirm').show().siblings().hide();
    $('.base_confirm span').text(content);
    $('.base_shadow').click(function(event) {
      console.log(event.target.id);
      $('.base_shadow').hide();
      if(event.target.id == 'base_confirm_confirm'){
        if(typeof (callback1) == 'function'){
          callback1()
        }
      };
      if(event.target.id == 'base_confirm_cancle'){
        if(typeof (callback2) == 'function'){
          callback2()
        }
      };
      
    });
    
  },
  showNotice: function(content){
    $('.notice_box').show();
    $('.notice_box span')[0].innerHTML=content;
  },
  hideNotice: function(){
    $('.notice_box').hide();
  },
  //统计接口
  staticWebPV: function(vt){
    //vt:1,网站 ｜ vt:2,电话呼入
    var ownUri = this.getUrlParams('ownUri');
    var ida = this.getUrlParams('ida');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    var st = this.getUrlParams('st')?this.getUrlParams('st'):'3';
    $.ajax({
      type:'get',
      url: global.url+'/exp/SaveWXWebPV.do?ownUri='+ownUri+'&vt='+vt+'&ida='+ida+'&st='+st,
      success: function(data) {
        // alert(JSON.stringify(data));
        // console.log(data);
        if(data.c == 1000){
          console.log('统计接口运行中！');
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showRefresh('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // 去除HTML标签
  removeHTMLTag: function(str) {
    if(!str) return;
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return str;
  },
  createUUID: function(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("").toUpperCase();
    return uuid;
  },
  getEcardTel: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    var ecardTel = '';
    $.ajax({
      type:'get',
      async:false,
      url: global.url+'/usr/QueryMicroCard.do?ownUri='+ownUri+'&ida='+ida,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          ecardTel = data.tel;
        }
      },
      error: function(xhr, status, err) {
        this.showRefresh('系统开了小差，请刷新页面');
        // console.error(this.props.url, status, err.toString());
      }
    });
    return ecardTel;
  },
  //菜单分类预处理，返回处理后数组
  checkMenuType: function(jsons){
    var tempType = [];
    var tel = this.getEcardTel();
    // console.log(tel);
    console.log(jsons);
    for(var i=0;i<jsons.length;i++){
      //特定菜单mt:1-电话，2-线上咨询，3-地图导航，4-微名片，5-微相册，6-个人微博
      //介绍页或者列表mt:7，最新动态8
      if(jsons[i].mt==1){
        // console.log("tel://"+(jsons[i].ac?jsons[i].ac:tel));
        tempType.push({
          title:jsons[i].tn,
          english:jsons[i].etn,
          ntid:jsons[i].ntId,
          src:jsons[i].lg,
          ac:'tel://'+(jsons[i].ac?jsons[i].ac:tel),
          type:'telphone',
          localtion:'',
          limit:jsons[i].vt,//vt:1 未加密 vt:2 加密
          psw:jsons[i].vp //vp为空字符串则无密码
        });
      }else if(jsons[i].mt==2){
        tempType.push({
          title:jsons[i].tn,
          english:jsons[i].etn,
          ntid:jsons[i].ntId,
          src:jsons[i].lg,
          ac:'',
          type:'consult',
          localtion:'',
          limit:jsons[i].vt,
          psw:jsons[i].vp
        });
      }else if(jsons[i].mt==3){
        tempType.push({
          title:jsons[i].tn,
          english:jsons[i].etn,
          ntid:jsons[i].ntId,
          src:jsons[i].lg,
          ac:'',
          type:'adress',
          localtion:jsons[i].ac,
          limit:jsons[i].vt,
          psw:jsons[i].vp
        });
      }else if(jsons[i].mt==4){
        tempType.push({
          title:jsons[i].tn,
          english:jsons[i].etn,
          ntid:jsons[i].ntId,
          src:jsons[i].lg,
          ac:'',
          type:'card',
          localtion:'',
          limit:jsons[i].vt,
          psw:jsons[i].vp
        });
      }else if(jsons[i].mt==5){
        tempType.push({
          title:jsons[i].tn,
          english:jsons[i].etn,
          ntid:jsons[i].ntId,
          src:jsons[i].lg,
          ac:'',
          type:'photo',
          localtion:'',
          limit:jsons[i].vt,
          psw:jsons[i].vp
        });
      }else if(jsons[i].mt==6){
        tempType.push({
          title:jsons[i].tn,
          english:jsons[i].etn,
          ntid:jsons[i].ntId,
          src:jsons[i].lg,
          ac:jsons[i].ac,
          type:'',
          localtion:'',
          limit:jsons[i].vt,
          psw:jsons[i].vp
        });
      }else if(jsons[i].mt==7){
        if(jsons[i].nc == 1){
          tempType.push({
            title:jsons[i].tn,
            english:jsons[i].etn,
            ntid:jsons[i].ntId,
            src:jsons[i].lg,
            ac:'',
            type:'articleDetail',
            localtion:'',
            limit:jsons[i].vt,
            psw:jsons[i].vp
          });
        }else if(jsons[i].nc == 2){
          tempType.push({
            title:jsons[i].tn,
            english:jsons[i].etn,
            ntid:jsons[i].ntId,
            src:jsons[i].lg,
            ac:'',
            type:'articleList',
            localtion:'',
            limit:jsons[i].vt,
            psw:jsons[i].vp
          });
        }
      }else if(jsons[i].mt==8){
        tempType.push({
          title:jsons[i].tn,
          english:jsons[i].etn,
          ntid:jsons[i].ntId,
          src:jsons[i].lg,
          ac:'',
          type:'TimeAxis',
          localtion:'',
          limit:jsons[i].vt,
          psw:jsons[i].vp
        });
      }else if(jsons[i].mt==9){
        tempType.push({
          title:jsons[i].tn,
          english:jsons[i].etn,
          ntid:jsons[i].ntId,
          src:jsons[i].lg,
          ac:'',
          type:'searchLawyers',
          localtion:'',
          limit:jsons[i].vt,
          psw:jsons[i].vp
        });
      }
    }
    console.log(tempType);
    return tempType;
  },
  //微信授权，获取appid
  getWXMsg:function(ownUri,ida,st){
    var wxPath = window.location.href,
        uri = encodeURIComponent(wxPath.toString()),
        doubleClickFlag = true;
    if(doubleClickFlag){
      doubleClickFlag = false;
      $.ajax({
        type: 'get',
        url: global.url+'/usr/ThirdJSapiSignature.do?apath=' + uri,
        success: function(data) {
            // alert('wx:' + JSON.stringify(data));
            if (data.c == 1000) {
              var temp = '';
              var str = window.location.href;
              if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
                temp = 't-web';
              }else{
                temp = 'web';
              }
              // micwebchat后接四个参数，下划线链接  _ownUri_ida_groupId_sourceTtpe
              location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+data.appId+'&redirect_uri=http%3a%2f%2f'+temp+'.green-stone.cn%2fusr%2fWeiXinWebOAuthForChat.do&response_type=code&scope=snsapi_userinfo&state=micwebchat_'+ownUri+'_'+ida+'_0_'+st+'#wechat_redirect';
            }
        },
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }
      });
      setTimeout(function(){
        doubleClickFlag = true;
      },3000);
    }
    
  },
  // 查询用户是否开通在线咨询功能
  // ocm字段  0表示关闭在线咨询功能，1表示开通在线咨询功能
  getExpConsult: function(ownUri,ida,st){
    var that = this;
    $.ajax({
      type: 'get',
      url: global.url+'/exp/Settings.do?ownUri=' + ownUri,
      success: function(data) {
        if (data.c == 1000) {
          if(data.ocm == 1){
            that.getWXMsg(ownUri,ida,st);
          }else{
            that.showAlert('该用户暂时关闭在线咨询功能');
          }
        }
      },
      error: function(xhr, status, err) {
        that.showRefresh('系统开了小差，请刷新页面');
      }
    });
  },
  //菜单跳转公用方法
  menuLink: function(type,ntid,limit,psw,title){
    // console.log(event);
    event.stopPropagation();
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      // console.log(ownUri);
    }
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    var idf = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    console.log('ida='+ida+'...idf='+idf);
    var st = 1;
    if(ida == 1){
      st = 2
    }
    // 乔凡：在线咨询增加控制状态，调接口查询是否接受在线咨询
    if(!type) return;
    if(type=='telphone'){
      this.staticWebPV(2);
    }else if(type == 'searchLawyers'){
      // WeixinJSBridge.call('closeWindow');
      // 专业团队菜单（乔凡：机构特有菜单，跳转到找律师界面）
      var ownUri = this.getUrlParams('ownUri');
      location.href = '#/Lawyers?ownUri='+ownUri+'&ida='+ida+'&st=2';
     }else if(type == 'TimeAxis'){
      var str = window.location.href;
      var temp,appid;
      // 时间轴页面需要授权
      // 乔凡：2016年12月23日取消授权操作
      // if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
      //     temp = 't-web';
      //     appid = 'wx2858997bbc723661';
      //   }else{
      //     temp = 'web';
      //     appid = 'wx73c8b5057bb41735';
      //   }
      // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri=http%3a%2f%2f'+temp+'.green-stone.cn%2fusr%2fWeiXinWebOAuthDispatch.do&response_type=code&scope=snsapi_userinfo&state=expNews_'+ownUri+'_0_'+idf+'#wechat_redirect';
      window.location.href = '#TimeAxis?ownUri='+ownUri+'&ida='+ida+'&idf='+idf;
     }else if(type == 'consult'){
      // WeixinJSBridge.call('closeWindow'); 
      this.getExpConsult(ownUri,ida,st);
     }else if(type == 'photo'||type == 'articleDetail'||type == 'articleList'){
      console.log(limit);
      //如果用户已经正常输入密码，则未退出页面过程中不需要重复输入
      if(localStorage.getItem('user_token_'+ntid) && localStorage.getItem('user_psw_'+ntid) == psw){
        location.href = '#'+type+'?ownUri='+ownUri+'&ntid='+ntid+'&ida='+ida;
      }else{
        // limit:1 未加密 limit:2 加密
        if(limit == 2){
          $('#limit_password_box').show();
          $('#limit_password_box').attr({
            'title':title,
            'value':psw,
            'name':ntid,
            'type':type
          });
        }else{
          location.href = '#'+type+'?ownUri='+ownUri+'&ntid='+ntid+'&ida='+ida;
        }
        localStorage.setItem('user_token_'+ntid,ntid);
        localStorage.setItem('user_psw_'+ntid,psw);
      }
    }else{
      location.href = '#'+type+'?ownUri='+ownUri+'&ntid='+ntid+'&ida='+ida;
    }
  }
};

module.exports = CommonMixin;

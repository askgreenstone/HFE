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
                alert('code:' + data.c + ',error:' + data.d);
            }
        },
        error: function(xhr, status, err) {
            this.showAlert('网络连接错误或服务器异常！');
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
  showAlert: function(content){
    //调用：this.showAlert('网络连接错误或服务器异常！');
    $('.base_shadow').show();
    $('.base_alert').show().siblings().hide();
    $('.base_alert span').text(content);
  },
  showTip: function(content){
    //调用：this.showTip('操作成功！');
    $('.base_shadow').show();
    $('.base_tip').show().siblings().hide();
    $('.base_tip span').text(content);
    setTimeout(function(){
      $('.base_shadow').hide();
    },800);
  },
  //统计接口
  staticWebPV: function(vt){
    //vt:1,网站 ｜ vt:2,电话呼入
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    $.ajax({
      type:'get',
      url: global.url+'/exp/SaveWXWebPV.do?ownUri='+ownUri+'&vt='+vt,
      success: function(data) {
        // alert(JSON.stringify(data));
        // console.log(data);
        if(data.c == 1000){
          console.log('统计接口运行中！');
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
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
  getEcardTel: function(){
    var ownUri = this.getUrlParams('ownUri');
    var ecardTel = '';
    $.ajax({
      type:'get',
      async:false,
      url: global.url+'/usr/QueryMicroCard.do?ownUri='+ownUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          ecardTel = data.tel;
        }
      },
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
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
    for(var i=0;i<jsons.length;i++){
      //特定菜单mt:1-电话，2-线上咨询，3-地图导航，4-微名片，5-微相册，6-个人微博
      //介绍页或者列表mt:7
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
      }
    }
    console.log(tempType);
    return tempType;
  },
  //菜单跳转公用方法
  menuLink: function(type,ntid,limit,psw,title){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      // console.log(ownUri);
    }
    if(!type) return;
    if(type=='telphone'){
      this.staticWebPV(2);
    }else if(type == 'consult'){
      WeixinJSBridge.call('closeWindow'); 
    }else if(type == 'photo'||type == 'articleDetail'||type == 'articleList'){
      console.log(limit);
      // limit:1 未加密 limit:2 加密
      if(limit == 2){
        console.log(2222);
        $('#limit_password_box').show();
        $('#limit_password_box').attr('title',title);
        $('#limit_password_box').attr('value',psw);
        $('#limit_password_box').attr('name',ntid);
        $('#limit_password_box').attr('type',type);
      }else{
        location.href = '#'+type+'?ownUri='+ownUri+'&ntid='+ntid;
      }
    }else{
      location.href = '#'+type+'?ownUri='+ownUri+'&ntid='+ntid;
    }
  }
};

module.exports = CommonMixin;

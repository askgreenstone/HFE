Zepto(function($){
    var session = Common.getUrlParam('session');
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

    var getLocalTime = function(now) {  
      console.log(now);
      if(!now)  return;
      var time1 = new Date(now).Format("yyyy-MM-dd hh:mm:ss");  
      return time1;      
    } 
    var getAuthenState = function(){
    $.ajax({
      type : 'post',
      url : Common.globalDistUrl() + 'exp/ExpertInfo.do?session='+ session,
      data: {},
      dataType:'json',
      contentType:'application/json',
      success : function(data) {
        console.log(data);
        if(data.c == 1000){
           if(data.sts == 2){
             // alert('已认证')
            // window.location.href = '#/active?session='+vm.sess;
          }else{
             // alert('未认证')
            // window.location.href = '#/actmode?session='+vm.sess;
          }
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
  })
  }
  $.ajax({
      type : 'post',
      url : Common.globalDistUrl() + 'exp/QueryMicWebActivate.do?session='+ session,
      data: {},
      dataType:'json',
      contentType:'application/json',
      success : function(data) {
        console.log(data);
        if(data.c == 1000){
           if(data.as == 1 || data.as == 2){
            // alert('已激活')
              window.location.href = 'custom.html?session='+session;
          }else if(data.as == 3 || data.as == 4 ){
             // alert('已失效')
             $("#actexpired_time").text(getLocalTime(data.at))
            // window.location.href = 'actexpired.html?session='+session;
          }else if(data.as == 0){
            getAuthenState();
          }
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
  })
  
})
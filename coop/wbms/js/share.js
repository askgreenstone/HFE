var session = Common.getUrlParam('session'),
    globalUrl = Common.globalJltUrl(),
    shareId = '',
    tempData = '';
console.log(session);
console.log(globalUrl);


//globalUrl  待处理
//头像二维码 待处理

//页面加载通过session判断是否编辑过
window.onload = function(){
	$.ajax({
	  type : 'get',
	  url : 'http://t-dist.green-stone.cn/' + 'exp/GetMicWebShareInfo.do',
	  params: {
      session:session,
      st:2
	  },
	  data: {},
	  success : function(data) {
	    console.log(data);
	    if(data.c == 1000){
	      console.log('fqfqfqfwq');
	      $("#title").val(data.sil[0].sti);
	      $("#desc").val(data.sil[0].spu);
	      //分享图片
	      shareId = data.sil[0].si;
	    }else {
	    	console.log('fqfqfqfwq');
	    	$("#title").val('XX律师微网站');
	    	$("#desc").val('XX律师专注于资本市场、基金、投融资、并购、公司法务等等');
	    	//分享图片
	    	shareId = data.sil[0].si;
	    }
	  },
	  error : function(){
	    alert('网络连接错误或服务器异常！');
	  }
	})
}

//验证文本框、文本域
function validateInput(){
	if(!$("#title").val()){
	  alert('分享标题不能为空！');
	  return false;
	}else if($("#title").val().length>15){
	  alert('分享标题不能超过15个字！');
	  return false;
	}


	if(!$("#desc").val()){
	  alert('分享摘要不能为空！');
	  return false;
	}else if($("#desc").val().length>40){
	  alert('分享摘要不能超过40个字！');
	  return false;
	}else{
	  return true;
	}
} 
          

//设置分享
var setWxShare = function(){
  if(!validateInput()) return;

  if(shareId){//更新
    tempData = {
      si:shareId,
      st:2,
      sti:$("#title").val(),
      sd:$("#desc").val(),
      //分享图片spu:user.preview
    }
  }else{//插入
    vm.tempData = {
        st:2,
        sti:$("#title").val(),
        sd:$("#desc").val(),
        //分享图片spu:user.preview
    }
  }
	$.ajax({
	  type : 'POST',
	  url : 'http://t-dist.green-stone.cn/' + 'exp/ThirdSetShareInfo.do',
	  params: {
      session:session
	  },
	  data: tempData，
	  success : function(data) {
			console.log(data);
			if(data.c == 1000){
			  window.location.href = 'custom.html?session='+session;
			}
	  },
	  error : function(){
	    alert('网络连接错误或服务器异常！');
	  }
	})
 
}

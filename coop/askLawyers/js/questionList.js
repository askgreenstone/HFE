var session;
var page = 0;
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
          	if(data.ql[i].ic == 0){
          		str = '<span class="que_list_unsolved">未解决</span>';
          	}else{
          		str = '<span class="que_list_close">已关闭</span>';
          	}
          	if(data.ql[i].s == 0){
          		status = '<span class="que_list_unsolved">未抢答</span>';
          	}else{
          		status = '<span class="que_list_close">已抢答</span>';
          	}
          	html+='<li id="'+data.ql[i].qi+'" data-gi="'+data.ql[i].gi+'" data-s="'+data.ql[i].s+'" data-ic="'+data.ql[i].ic+'" >'
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
	if(!session || !qid || !userUri || !groupId) return;
	if(status == 0){
		alert('该问题尚未被专家抢答！');
		getQuestionList();
	}else if(ic == 0){
		window.location.href = 'chatList.html?session='+session+'&qid='+qid+'&userUri='+userUri+'&groupId='+groupId+'&status=chat';
	}else if(ic == 1){
    window.location.href = 'chatList.html?session='+session+'&qid='+qid+'&userUri='+userUri+'&groupId='+groupId+'&status=close';
  }
})



// 点击咨询新问题跳转发布问题页
$('#pub_btn').click(function(){
	var userUri = Common.getUrlParam('userUri');
	window.location.href = 'publishQuestions.html?session='+session+'&userUri='+userUri;
})


function getDate(time){
	var now = new Date().getTime();
	var result = (now - time)/1000/60/60/24;
	if(result > 1){
		return Math.floor(result) + '天前';
	}else{
		return Math.floor(result*24) + '小时前';
	}
}





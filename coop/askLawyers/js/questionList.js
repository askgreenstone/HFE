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
        var html = $('.que_list').html();

        if (data.c == 1000) {
          for(var i=0;i<data.ql.length;i++){
          	if(data.ql[i].ic == 0){
          		str = '<span class="que_list_unsolved">未解决</span>';
          	}else{
          		str = '<span class="que_list_close">已关闭</span>';
          	}
          	html+='<li id="'+data.ql[i].qi+'" >'
								+'<span class="que_list_money">￥'+data.ql[i].b+'元</span>'
								+'<span>'+data.ql[i].co+'</span>'
								+'<br/>'
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
	var userUri = Common.getUrlParam('userUri')
	window.location.href = 'chatList.html?session='+session+'&qid='+qid+'&userUri='+userUri;
})



// 点击咨询新问题跳转发布问题页
$('#pub_btn').click(function(){
	window.location.href = 'publishQuestions.html?session='+session;
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





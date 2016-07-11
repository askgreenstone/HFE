var session;
var page = 0;
$(document).ready(function() {
  init();
});


function init(){
  session = Common.getUrlParam('session');
  console.log(session);
  getQuestionList(page);
  loadMore();
}



function getQuestionList(p){
	$.ajax({
    type: 'GET',
    url: Common.globalDistUrl() + 'exp/QuestList.do?session='+session+'&t=0&c=10&p='+p+'&r=1',
    success: function(data) {
        //alert( 'success:' + JSON.stringify(data) );
        console.log(data);
        var html = $('.que_list').html();
        var unsolved = 'que_list_unsolved';
        var close = 'que_list_close';

        if (data.c == 1000) {
          for(var i=0;i<data.s.length;i++){
          	if(data.s[i].s == 0){
          		str = '<span class="que_list_unsolved">未解决</span>';
          	}else{
          		str = '<span class="que_list_close">已关闭</span>';
          	}
          	html+='<li>'
								+'<span class="que_list_money">￥'+data.s[i].b+'元</span>'
								+'<span>'+data.s[i].c+'</span>'
								+'<br/>'
								+'<span class="que_list_time">'+ getDate(data.s[i].ts) +'</span>'
								+str
								+'</li>'
          }
          console.log(html);
          $('.que_list').html(html);
          page++;
        }
    },
    error: function(err) {
      alert('网络连接错误或服务器异常！');
    }
  });
}


function loadMore(){
	// document.onScroll = function(){
		$(".question_list").scroll(function(e){
			var containerH = $(".question_list").height();
			var h = 0;
			var list = $(".question_list li")
			for (var i = 0; i < list.length; i++) {
				h += $(list[i]).height()+10
			}
			// console.log(h);
			// console.log(containerH);
			var top = $(".question_list")[0].scrollTop;
			// console.log(top);
			// console.log(h-containerH);
			if(h-containerH == top){
				getQuestionList(page);
			}
		})
	// }
}

function getDate(time){
	var now = new Date().getTime();
	var result = (now - time)/1000/60/60/24;
	if(result > 1){
		return Math.floor(result) + '天前';
	}else{
		return Math.floor(result*24) + '小时前';
	}
}

var session;
var flag = false;
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
        var qid = Common.getUrlParam('qid');        
        if (data.c == 1000) {
          for(var i=0;i<data.ql.length;i++){
            if(data.ql[i].qi == qid){
              if(data.ql[i].ic == 0){
                str = '<span class="que_list_unsolved">未解决</span>';
              }else{
                str = '<span class="que_list_close">已关闭</span>';
              }
              html+='<li id="'+data.ql[i].qi+'">'
                  +'<span class="que_list_money">￥'+data.ql[i].b+'元</span>'
                  +'<span>'+data.ql[i].co+'</span>'
                  +'<br/>'
                  +'<span class="que_list_time">'+ getDate(data.ql[i].ts) +'</span>'
                  +str
                  +'</li>'
              }
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


function getDate(time){
  var now = new Date().getTime();
  var result = (now - time)/1000/60/60/24;
  if(result > 1){
    return Math.floor(result) + '天前';
  }else{
    return Math.floor(result*24) + '小时前';
  }
}




// 点赞
$('.eva_nice').bind('click',function(){
  if($(this).hasClass('eva_nice_light')){
    $(this).removeClass('eva_nice_light');
    flag = false;
    console.log(flag);
  }else{
    $(this).addClass('eva_nice_light');
    flag = true;
    console.log(flag);
  }
})



// 提交评价
$('.eva_btn').bind('click',function(){
  var text = $('.pub_area').val();
  if(!text){
    alert('请输入评价！');
    return;
  }else{
    console.log(text);
    console.log(flag);
  }
})


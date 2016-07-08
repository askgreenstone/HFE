var session;
var flag = false;
$(document).ready(function() {
  init();
});


function init(){
  session = Common.getUrlParam('session');
  console.log(session);
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


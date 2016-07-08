var session;
$(document).ready(function() {
  init();
});


function init(){
  session = Common.getUrlParam('session');
  console.log(session);
}

$('.detail_close').bind('click',function(){
  window.location.href = 'evaluate.html?session=' + session;
})







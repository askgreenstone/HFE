// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($){
	var sess = Common.getUrlParam('session');
  var api =new Api();
  $('#custom_begin').click(function(event) {
  	window.location.href = 'template.html?session='+sess;
  });
  $('#custom_logout').click(function(event) {
    window.location.href = '../index.html';
  });
  $('#custom_preview').click(function(event) {
      $.ajax({
        type : 'GET',
        url : Common.globalDistUrl() + 'exp/CreateMicWebQrCode.do?session='+ sess,
        success : function(data) {
          console.log(data);
          window.location.href = data.url;
        },
        error : function(){
          alert('网络连接错误或服务器异常！');
        }
      })
  });
  $('#custom_reset').click(function(event) {
    window.location.href = 'template.html?session='+sess+'&ts='+new Date().getTime();
  });

  $('#downloadApp').click(function(event) {
    window.location.href = 'http://www.lvshikaimen.com/lvshiappdown.html?ts='+new Date().getTime();
  });

  function getMicroState(){
    $.ajax({
      type : 'GET',
      url : Common.globalDistUrl() + 'exp/MicWebSetUpStatus.do?session='+ sess,
      success : function(data) {
        console.log(data);
        //判断主题制定状态：0未设置，1已设置，2已完成
        if(data.s == 0){
          $('#custom_preview').hide();
          $('#custom_reset').hide();
        }else{
          $('#custom_begin').hide();
        }
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })
  }

  getMicroState();
})
// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($){
  var api =new Api();
  $('#custom_begin').click(function(event) {
    var sess = Common.getUrlParam('session');
  	window.location.href = 'template.html?session='+sess;
  });
  $('#custom_logout').click(function(event) {
    window.location.href = 'template.html';
  });
})
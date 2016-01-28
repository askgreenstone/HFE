// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($) {
    var api = new Api();
    var sess = Common.getUrlParam('session');
    $('#template_next').click(function(event) {
	  	window.location.href = 'themebg.html?session='+sess;
	  });
    function getAllModel() {
    	$.ajax({
			    type : 'POST',
			    url : 'http://t-dist.green-stone.cn/exp/ChooseMicWebModel.do?session='+ sess,
			    success : function(data) {
			      console.log(data);
			    },
			    error : function(error){
			      alert('网络连接错误或服务器异常！');
			    }
			  })
    }
    getAllModel();
})

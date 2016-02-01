// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

jQuery(function($) {
    var api = new Api();
    var box;
    var sess = Common.getUrlParam('session');

    function getAllModel() {
    	Common.getLoading(true);
    	$.ajax({
			    type : 'POST',
			    url : Common.globalDistUrl()+'exp/GetMicWebModel.do?session='+ sess,
			    success : function(data) {
			    	Common.getLoading(false);
			      console.log(data);
			      var tempArrs = [];
			      // alert(JSON.stringify(data));
			      var comment = '';
			      for(var i=0;i<data.ml.length;i++){
			      	comment+='<li name="'+data.ml[i].tu+'@'+data.ml[i].wmi+'@'+data.ml[i].ar+'" class="swiper-slide"><img src="'+Common.globalTransferUrl()+data.ml[i].wmp+'"/></li>';
			      }
			      $('#template_theme').append(comment);
			      //初始化swiper
				      var mySwiper = new Swiper('.swiper-container', {
					        // direction: 'vertical',
					        loop: true,
					        effect : 'cube',
					        // 如果需要前进后退按钮
					        nextButton: '.swiper-button-next',
					        prevButton: '.swiper-button-prev',
					        onSlideChangeEnd:function(swiper){
									   console.log(swiper.activeIndex);
									   getActiveLi();
									}
					    })
				    },
			    error : function(error){
			    	Common.getLoading(false);
			      alert('网络连接错误或服务器异常！');
			    }
			  })
    	}

    	
    	function getActiveLi(){
    		var test = '';
    		$('#template_theme li').each(function(index, el) {
    			// if($(this).attr('data-swiper-slide-index')==x){
    			// 	test = $(this).attr('name');
    			// };
    			if($(this).attr('class').indexOf('swiper-slide-active')>0){
    				test = $(this).attr('name');
    			}
    		});
    		//存储模版信息index003@2@7-10
    		// console.log(test);
    		localStorage.setItem('globalTemplateInfo',test);
    	}

    	$('#template_next').click(function(event) {
		  	if(!localStorage.getItem('globalTemplateInfo')) return;
		  	Common.getLoading(true);
		  	var modelInfo = localStorage.getItem('globalTemplateInfo');
		  	var obj = {
		  		wmi:parseInt(modelInfo.split('@')[1]),
		  		wmu:modelInfo.split('@')[0],
		  		fm:1 //移动端需要清除模版信息
		  	};
		  	$.ajax({
			    type : 'POST',
			    dataType:'json',
			    contentType:'application/json',
			    url : Common.globalDistUrl()+'exp/ChooseMicWebModel.do?session='+ sess,
			    data: JSON.stringify(obj),
			    success : function(data) {
			    	Common.getLoading(false);
			      console.log(data);
         		window.location.href = 'themebg.html?session='+sess+'&ratio='+modelInfo.split('@')[2];
			    },
			    error : function(error){
			    	Common.getLoading(false);
			      alert('网络连接错误或服务器异常！');
			    }
			  })
		  });

	    //判断客户端类型
	   //  function judgeClient(){
	   //  	var u = navigator.userAgent, app = navigator.appVersion;
				// var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
				// var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
				// if(isiOS){
				// 	$('#template_title').text('滑动选择模版');
				// 	return true;
				// }else{
				// 	$('#template_title').text('点击选择模版');
				// 	return false;
				// }
	   //  }

		  //横屏检测
			window.addEventListener('orientationchange', function(event){
			    if ( window.orientation == 180 || window.orientation==0 ) {
			        window.location.reload();
			        // $('.box').css('display','block');
			        initPic();
			    }
			    if( window.orientation == 90 || window.orientation == -90 ) {
			        $('canvas').css('display','none');
			        setTimeout(function(){
			          alert('横屏体验较差，请竖屏查看');
			        },500);
			    }
			}); 

			function initAll(){
				getAllModel();
			}
			

			initAll();
})

// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

jQuery(function($) {
    var api = new Api();
    var box;

    function getAllModel() {
    	Common.getLoading(true);
    	$.ajax({
			    type : 'GET',
			    url : Common.globalDistUrl()+'exp/GetMicWebModel.do?im=1',
			    success : function(data) {
			    	Common.getLoading(false);
			      console.log(data);
			      var tempArrs = [];
			      // alert(JSON.stringify(data));
			      var comment = '';
			      for(var i=0;i<data.ml.length;i++){
			      	comment+='<li name="'+data.ml[i].tu+'@'+data.ml[i].wmi+'@'+data.ml[i].ar+'" class="swiper-slide"><img src="'+Common.globalTransferUrl()+data.ml[i].wmp+'@230"/></li>';
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
					    //主题背景回显，牵扯到其他回显，暂时不用管
					    // if(data.stu){
					    // 	// queryThemeIndex(data.stu);
					    // 	mySwiper.slideTo(queryThemeIndex(data.stu), 0, false);
					    // }
					    
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

    	//根据主题确定索引
    	function queryThemeIndex(theme){
    		console.log(theme);
    		var tempIndex = 0;
    		$('#template_theme li').each(function(index, el) {
    			// console.log($(this).attr('name'));
    			// if($(this).attr('name').indexOf(theme)>0){
    			// 	tempIndex = $(this).attr('data-swiper-slide-index');
    			// }
    			var temp = $(this).attr('name').split('@')[0];
    			if(temp == theme){
    				// console.log($(this));
    				tempIndex = parseInt($(this).attr('data-swiper-slide-index'))+1;
    			}
    		});
    		// console.log('tempIndex:'+tempIndex);
    		return tempIndex;
    	}

    	$('#template_next').click(function(event) {
		  	if(!localStorage.getItem('globalTemplateInfo')) return;
		  	var openId = Common.getUrlParam('openId');
		  	Common.getLoading(true);
		  	var modelInfo = localStorage.getItem('globalTemplateInfo');
		  	var obj = {
		  		wmi:parseInt(modelInfo.split('@')[1]),
		  		wmu:modelInfo.split('@')[0],
		  		fm:1 //移动端需要清除模版信息
		  	};
		  	console.log(obj);
		  	$.ajax({
			    type : 'POST',
			    dataType:'json',
			    contentType:'application/json',
			    url : Common.globalDistUrl()+'exp/ChooseMicWebModel.do',
			    data: JSON.stringify(obj),
			    success : function(data) {
			    	Common.getLoading(false);
			      console.log(data);
         		window.location.href = 'wxregister.html?mwID='+ data.mwID + '&openId=' +openId ;
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
	   $('#template_login').click(function(){
	   	window.location.href = '../index.html'
	   })


			function initAll(){
				getAllModel();
			}
			

			initAll();
})

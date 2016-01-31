// var aa =new Api();
// aa.verify('15203573437',function(data){
// 	console.log(data);
// });

Zepto(function($) {
    var api = new Api();
    var box;
    var sess = Common.getUrlParam('session');

    function getAllModel() {
    	$.ajax({
			    type : 'POST',
			    url : Common.globalDistUrl()+'exp/GetMicWebModel.do?session='+ sess,
			    success : function(data) {
			      console.log(data);
			      var tempArrs = [];
			      // alert(JSON.stringify(data));
			      for(var i=0;i<data.ml.length;i++){
			      	tempArrs.push({
			      		src:data.ml[i].wmp,
			      		id:data.ml[i].tu+'@'+data.ml[i].wmi+'@'+data.ml[i].ar
			      	});
			      }
		      	box = $(".box").ig3js({
			    		manifest: tempArrs,
			        imagePath: Common.globalTransferUrl(),
			      	// manifest: [{src:'1.png',id:'1'},{src:'2.png',id:'2'}],
			       //  imagePath: '../image/themes/',
			        alphaBackground: true,
			        // ambientLight:'#fff',
			        // light:'#fff;',
			        dx:300,
			        planeSize:350,
			        onNavigateComplete: function(obj){
			        //console.log("navigation complete");
			           // console.log(obj.name);
			           // alert(obj.name);
			           //存储模版信息index003@2@7-10
			           localStorage.setItem('globalTemplateInfo',obj.name);
			        }
			    	});
			    	initPic();
			    },
			    error : function(error){
			      alert('网络连接错误或服务器异常！');
			    }
			  })
    	}

    	$('#template_next').click(function(event) {
		  	if(!localStorage.getItem('globalTemplateInfo')) return;
		  	var modelInfo = localStorage.getItem('globalTemplateInfo');
		  	var obj = {
		  		wmi:parseInt(modelInfo.split('@')[1]),
		  		wmu:modelInfo.split('@')[0]
		  	}
		  	Common.getLoading(true);
		  	$.ajax({
			    type : 'POST',
			    dataType:'json',
			    contentType:'application/json',
			    url : Common.globalDistUrl()+'exp/ChooseMicWebModel.do?session='+ sess,
			    data: JSON.stringify(obj),
			    success : function(data) {
			      console.log(data);
			      setTimeout(function(){
                    Common.getLoading();
                  },300);
			      window.location.href = 'themebg.html?session='+sess+'&ratio='+modelInfo.split('@')[2];
			    },
			    error : function(error){
			      alert('网络连接错误或服务器异常！');
			    }
			  })
		  });

	    //判断客户端类型
	    function judgeClient(){
	    	var u = navigator.userAgent, app = navigator.appVersion;
				var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
				var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
				if(isiOS){
					$('#template_title').text('滑动选择模版');
					return true;
				}else{
					$('#template_title').text('点击选择模版');
					return false;
				}
	    }
	    
	    
	    //初始化
	    function initPic(){
	    	// judgeClient();
	    	if(judgeClient()){
	    		//android 500,ios 690
	    		if(window.screen.width == 320){
	    			var switchHeight = '480px';
	    		}else{
	    			var switchHeight = '690px';
	    		}
	    	}else{
	    		var switchHeight = '500px';
	    	}
	    	// alert(window.screen.width);
	    	var ctop,cmargin,cwidth,cheight,ctemp;
	    	//适配屏幕宽度
	    	if(window.screen.width < 320 || window.screen.width == 320){
	    		ctop='-12%';
	    		cmargin='-140px';
	    		cwidth='280px';
	    		cheight='750px';
	    	}else if(window.screen.width > 320 && window.screen.width < 375 || window.screen.width == 375){
	    		ctop='-12%';
	    		cmargin='-165px';
	    		cwidth='330px';
	    		cheight='905px';
	    	}
	    	else if(window.screen.width > 375 && window.screen.width < 414 || window.screen.width == 414){
	    		ctop='-16%';
	    		cmargin='-180px';
	    		cwidth='360px';
	    		cheight='1060px';
	    	}else if(window.screen.width > 414 && window.screen.width < 1080||window.screen.width == 1080){
	    		ctop='12%';
	    		cmargin='-179px';
	    		cwidth='358px';
	    		cheight='950px';
	    		ctemp = '750px';
	    	}else if(window.screen.width > 1080 && window.screen.width < 1152||window.screen.width == 1152){
	    		ctop='-12%';
	    		cmargin='-179px';
	    		cwidth='358px';
	    		cheight='750px';
	    		ctemp = '750px';
	    	}

		    $('canvas').parent().css({
		    	position: 'absolute',
		    	left: '50%',
	    		top: ctop,
	    		marginLeft: cmargin,
	    		height: switchHeight,
    			overflowY: 'hidden'
	    	});
		    $('canvas').css({
		    	width:cwidth,
		    	height:cheight,
		    	marginTop:ctemp
		    });
	    }

	    //判断滑动方向
	    function swipeDirection(x1, x2, y1, y2) {
         var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
         return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
     	}

     	//滑动手势判断
     	var x1,y1,x2,y2,swipeX,swipeY ;
			$(document).on('touchstart',function(event){
			    x1 = event.targetTouches[0].screenX ;
			    y1 = event.targetTouches[0].screenY ;
			    swipeX = true;
			    swipeY = true ;
			})
			$(document).on('touchmove',function(event){
		      x2 = event.targetTouches[0].screenX ;
		      y2 = event.targetTouches[0].screenY ;
		  })
		  $(document).on('touchend',function(event){
		  	if(swipeX && Math.abs(x2-x1)-Math.abs(y2-y1)>0)  //左右滑动
		      {
		          event.stopPropagation();//组织冒泡
		          event.preventDefault();//阻止浏览器默认事件
		          swipeY = false ;
		          //左右滑动
		          var flag = swipeDirection(x1, x2, y1, y2);
		          console.log(flag);
		          if(flag == 'Left'){
		          	box.navigate.next();
        				return false;
		          }else if(flag == 'Right'){
		          	box.navigate.prev();
        				return false;
		          }
		      }
		      else if(swipeY && Math.abs(x2-x1)-Math.abs(y2-y1)<0){  //上下滑动
		          swipeX = false ;
		          //上下滑动，使用浏览器默认的上下滑动
		      }
		  });

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

var session = Common.getUrlParam('session'),
    globalUrl = Common.getGlobalUrl();
console.log(session);
console.log(globalUrl);


//globalUrl  待处理
//头像二维码 待处理

window.onload = function(){
	$.ajax({
	  type : 'get',
	  url : 'http://t-dist.green-stone.cn' + '/exp/GetMicWebShareInfo.do',
	  params: {
      session:session,
      st:2
	  },
	  data: {},
	  success : function(data) {
	    console.log(data);
	    if(data.c == 1000){
	      console.log('fqfqfqfwq')
	    }
	  },
	  error : function(){
	    alert('网络连接错误或服务器异常！');
	  }
	})
}
// 	  $http({
// 	        method: 'GET',
// 	        url: GlobalUrl+'/exp/GetMicWebShareInfo.do',
// 	        params: {
// 	            session:vm.sess,
// 	            st:2
// 	        },
// 	        data: {
// 	        }
// 	    }).
// 	    success(function(data, status, headers, config) {
// 	        console.log(data);
// 	        if(data.c == 1000){
// 	          if(data.sil.length>0){
// 	            vm.user = {
// 	              title:data.sil[0].sti,
// 	              desc:data.sil[0].sd,
// 	              preview:data.sil[0].spu
// 	            }
// 	            vm.shareId = data.sil[0].si;
// 	          }else{
// 	            vm.user = {
// 	              title:'XX律师微网站',
// 	              desc:'XX律师专注于资本市场、基金、投融资、并购、公司法务等等',
// 	              preview:'greenStoneicon300.png'
// 	            }
// 	          }
// 	        }
// 	    }).
// 	    error(function(data, status, headers, config) {
// 	        // console.log(data);
// 	        alert('网络连接错误或服务器异常！');
// 	    });

// }

// //分享首页st：1，微名片st：2
//         vm.setWxShare = function(){
//           if(!vm.validateInput()) return;

//           if(vm.shareId){//更新
//             vm.tempData = {
//                 si:vm.shareId,
//                 st:2,
//                 sti:vm.user.title,
//                 sd:vm.user.desc,
//                 spu:vm.user.preview
//             }
//           }else{//插入
//             vm.tempData = {
//                 st:2,
//                 sti:vm.user.title,
//                 sd:vm.user.desc,
//                 spu:vm.user.preview
//             }
//           }
//           $http({
//                 method: 'POST',
//                 url: GlobalUrl+'/exp/ThirdSetShareInfo.do',
//                 params: {
//                     session:vm.sess
//                 },
//                 data: vm.tempData
//             }).
//             success(function(data, status, headers, config) {
//                 console.log(data);
//                 if(data.c == 1000){
//                   vm.menuLink('card3');
//                 }
//             }).
//             error(function(data, status, headers, config) {
//                 // console.log(data);
//                 alert('网络连接错误或服务器异常！');
//             });
//         }

        

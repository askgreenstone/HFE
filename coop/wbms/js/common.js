var Common = {
	//获取url参数值
	getUrlParam : function(p) {
    var url = location.href; 
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
    var paraObj = {} ;
    for (var i=0,j=0; j=paraString[i]; i++){ 
      paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
    } 
    var returnValue = paraObj[p.toLowerCase()]; 
    if(typeof(returnValue)=="undefined"){ 
      return ""; 
    }else{ 
      return  returnValue;
    } 
  },
  //获取transfer url
  globalTransferUrl : function(){
    return 'http://t-transfer.green-stone.cn/';
  	// if(window.location.href.indexOf('localhost')>-1 || window.location.href.indexOf('t-dist')>-1){
  	//     return 'http://t-transfer.green-stone.cn/';
  	// }else{
  	//     return 'http://transfer.green-stone.cn/';
  	// }
  },
  //获取dist url
  globalDistUrl : function(){
    return 'http://t-dist.green-stone.cn/';
    // if(window.location.href.indexOf('localhost')>-1 || window.location.href.indexOf('t-dist')>-1){
    //     return 'http://t-dist.green-stone.cn/';
    // }else{
    //     return 'http://jlt.green-stone.cn/';
    // }
  }
}
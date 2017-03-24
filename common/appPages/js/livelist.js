
jQuery(function($){
  Date.prototype.Format = function(fmt){ //author: meizz   
    var o = {   
      "M+" : this.getMonth()+1,                 //月份   
      "d+" : this.getDate(),                    //日   
      "h+" : this.getHours(),                   //小时   
      "m+" : this.getMinutes(),                 //分   
      "s+" : this.getSeconds(),                 //秒   
      "q+" : Math.floor((this.getMonth()+3)/3), //季度   
      "S"  : this.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
      if(new RegExp("("+ k +")").test(fmt))   
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;   
  }  


  //初始化数据
  var ownUri;
  function initAll() {
    ownUri = Common.getUrlParam('ownUri');
    getLiveList();
  }
  initAll();



  // 获取直播列表信息
  function getLiveList(){
    $.ajax({
      type: 'get',
      url: Common.globalDistUrl()+'/exp/GetLiveListInfo.do?do='+ownUri,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){

          // 渲染第一条数据
          var FirstData = data.ll.slice(0,1);
          var live_list_top_str = '';
          live_list_top_str +='<div data-id="'+FirstData[0].lid+'"><img src="'+Common.globalTransferUrl()+FirstData[0].lp+'"/>'
                            +'<div class="live_list_top_content">'
                            +'<div><span>'+FirstData[0].ln+'</span><span style="display:none" class="live_list_live">直播中</span></div>'
                            +'<div><span class="live_list_teacher">主讲：<span>'+FirstData[0].sn+'</span> <span>律师</span></span>'
                            +'<span>'+new Date(FirstData[0].lt).Format("MM/dd hh:mm")+'</span></div></div></div>'
          // console.log(live_list_top_str);
          $('.live_list_top').html(live_list_top_str);
          


          // 渲染其他数据
          var ListData = data.ll.slice(1);
          var Live_list_str = '';
          for (var i = 0; i < ListData.length; i++) {
            Live_list_str +='<li data-id="'+ListData[i].lid+'"><div class="live_list_bot_img"><img src="'+Common.globalTransferUrl()+ListData[i].lp+'"/></div>'
                          +'<div class="live_list_bot_content"><div class="live_list_title">'+ListData[i].ln+'</div>'
                          +'<div class="live_list_content">主讲：<span>'+ListData[i].sn+'</span> <span>律师</span></div>'
                          +'<div class="live_list_content"></div></div></li>'
          }
          // console.log(Live_list_str);
          $('.Live_list').html(Live_list_str);


        }
      },
      error: function(data) {
          // console.log(data);
        this.showRefresh('系统开了小差，请刷新页面');
      }
    })
  }


  // 点击第一条数据跳转到对应详情页面
  $('.live_list_top').on('click', function(event) {
    event.preventDefault();
    var lid = $(this).find('div').attr('data-id');
    window.location.href = 'LiveDetail.html?ownUri='+ownUri+'&lid='+lid;
  });

  // 点击某一条数据跳转到对应详情页面
  $('.Live_list').on('click','li', function(event) {
    event.preventDefault();
    var lid = $(this).attr('data-id');
    window.location.href = 'LiveDetail.html?ownUri='+ownUri+'&lid='+lid;
  });

})
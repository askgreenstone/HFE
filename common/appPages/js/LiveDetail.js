
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
  var lid;
  var ldid;
  var liveListPic;
  var speakerUri;
  var FirstData;
  var ListData;
  var askQuestionFlag;
  function initAll() {
    ownUri = Common.getUrlParam('ownUri');
    lid = Common.getUrlParam('lid');
    ldid = Common.getUrlParam('ldid');
    getLiveListPic();
  }
  initAll();



  // 获取某一条数据
  function getTheOne(data,LiveDetailId){
    var arr = [];
    // console.log(data);
    for(var i = 0,len = data.length;i<len;i++){
      if(data[i].ldid == LiveDetailId){
        arr = data[i]
      }
    }
    // console.log(arr);
    return [arr];
  }


  // 获取直播封面图
  function getLiveListPic(){
    $.ajax({
      type: 'get',
      url: Common.globalDistUrl()+'/exp/GetLiveListInfo.do?do='+ownUri,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          for (var i = data.ll.length - 1; i >= 0; i--) {
            if(data.ll[i].lid == lid){
              liveListPic = data.ll[i].lp;
              if(ldid){
                getLiveInfo(ldid);
              }else{
                getLiveInfo();
              }
            }
          }
        }
      },
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }
    })
  }



  //获取直播详情列表
  function getLiveInfo(livedetailid){
    $.ajax({
      type: 'get',
      url: Common.globalDistUrl()+'/exp/GetLiveInfo.do?do='+ownUri+'&lid='+lid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          // livestatus: int 直播状态  1 未直播   2直播中  3直播结束
          var urlLdid = Common.getUrlParam('ldid');
          // console.log(urlLdid);
          if(!urlLdid){
              ldid = data.sldid
          }
          var livedid = livedetailid?livedetailid:data.sldid;
          // console.log(livedid);
          ldid = livedid;
          speakerUri = getTheOne(data.ll,livedid)[0].dou;

          // 渲染需要高亮的直播数据（在最上层展示）
          FirstData = getTheOne(data.ll,livedid);
          console.log(FirstData);
          var FirstDataStr = '';
          FirstDataStr +='<div id="J_prismPlayer" class="prism-player"></div>'
                        +'<img class="live_detail_bg" src="'+(FirstData[0].lp?(Common.globalTransferUrl()+FirstData[0].lp):(Common.globalTransferUrl()+liveListPic))+'"/>'
                        +'<div class="live_list_top_content">'
                        +'<div><span>'+(FirstData[0].lt?FirstData[0].lt:"课程介绍")+'</span><span class="'+(FirstData[0].ls == 2?"live_list_live":"live_list_live_no")+'">直播中</span></div>'
                        +'<div><span class="live_list_teacher">主讲：<span>'+(FirstData[0].sn?FirstData[0].sn:"无")+'</span> <span style="display='+(FirstData[0].sn?"inline":"none")+'">律师</span></span><span>'+(FirstData[0].livetime?(new Date(FirstData[0].livetime).Format("MM/dd hh:mm")):"直播时间")+'</span></div></div>'
                        +'<div class="live_detail_shadow" style=display:'+(FirstData[0].ls == 2?"inline":"none")+'><span class="live_detail_play live_detail_play_play" >进入直播</span></div>'
                        +'<div class="live_detail_shadow" style=display:'+(FirstData[0].ls == 1?"inline":"none")+'><span class="live_detail_play live_detail_play_time">直播时间：'+(FirstData[0].livetime?(new Date(FirstData[0].livetime).Format("MM/dd hh:mm")):"无")+'</span></div>'
                        +'<div class="live_detail_shadow" style=display:'+(FirstData[0].ls == 3?"inline":"none")+'><span class="live_detail_play live_detail_play_button" ><img src="image/video_on.png"/></span></div>'
          // console.log(FirstDataStr);
          $('.live_detail_top').html(FirstDataStr);  


          // 渲染所有的直播数据
          ListData = data.ll;
          var ListDataStr = '';
          if(ListData.length<1){
            $('.live_detail_list').html('');
          }else{
            for (var i = 0; i < ListData.length; i++) {
            ListDataStr +='<li data-id="'+ListData[i].ldid+'"class='+(ListData[i].ldid == ldid?"live_detail_list_active":"")+'>'
                        +'<div class="live_detail_list_img"><i></i><div></div></div>'
                        +'<div class="live_detail_list_content">'
                        +'<div class="live_list_title">'+ListData[i].lt+'<br/><i>'+(ListData[i].ls == 3?'点播':'直播')+'</i></div>'
                        +'<div class="live_list_content">'+(ListData[i].ls == 3?'':new Date(ListData[i].livetime).Format("yyyy-MM-dd hh:mm"))+'</div></div></li>'        
            }

            // console.log(ListDataStr);
            $('.live_detail_list').html(ListDataStr);
          }
          


          // 获取当前课程的讲师介绍
          var TeacherDataStr = '';
          TeacherDataStr +='<div><div class="live_detail_class">'
                          +'<p class="live_detail_introduce_box">课程详情</p><div>'+FirstData[0].ld+'</div></div>'
                          +'<div class="live_detail_class"><p class="live_detail_introduce_box">讲师介绍</p>'
                          +'<img src="'+(FirstData[0].sp?(Common.globalTransferUrl()+FirstData[0].sp):(Common.globalTransferUrl()+'header.jpg'))+'"/>'
                          +'<p class="live_detail_introduce_teacher"><span class="teacher_name">'+FirstData[0].sn+'</span><span className="teacher_job">律师</span></p>'
                          +'<div>'+FirstData[0].sd+'</div></div></div>'
          // console.log(TeacherDataStr);
          $('.live_detail_introduce').html(TeacherDataStr);

          // 获取当前课程所有提问
          getLiveQuestion(livedid);
          // 根据直播状态改变提问框出现隐藏
          if(getTheOne(data.ll,livedid)[0].ls == 2){
            $('.live_detail_question_text').show();
          }else{
            $('.live_detail_question_text').hide();
          }
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  } 


  // 获取当前课程所有提问
  function getLiveQuestion(LiveDetailId){
    var ldid = LiveDetailId?LiveDetailId:ldid;
    // console.log(ldid);
    if(ldid == 0 || !ldid){
      $('.live_detail_question_box').html('');
      $('.live_detail_question_text').hide();
    }else{
      $.ajax({
        type: 'get',
        url: Common.globalDistUrl()+'/exp/GetLiveQuestion.do?ldid='+ldid,
        success: function(data) {
          console.log(data);
          if(data.c == 1000){
            QuestionList = data.ql;
            var QuestionListStr = '';
            if(data.ql.length<1){
              $('.live_detail_question_box').html('');
            }else{
              for (var i = 0; i < QuestionList.length; i++) {
              QuestionListStr +='<li><div class="live_detail_question_img">'
                            +'<img src="'+(QuestionList[i].qp?(Common.globalTransferUrl()+QuestionList[i].qp):(Common.globalTransferUrl()+'header.jpg'))+'" width="50" height="50"/></div>'
                            +'<div class="live_detail_question_content"><span>'
                            +'<i class="live_detail_question_content_name">'+QuestionList[i].qn+'</i>'
                            +'<i class="live_detail_question_content_time">'+new Date(QuestionList[i].ts).Format("MM-dd hh:mm")+'</i><br/>'
                            +'<i class="live_detail_question_content_text">'+QuestionList[i].qd+'</i></span></div></li>'
              }
              console.log(QuestionListStr);
              $('.live_detail_question_box').html(QuestionListStr);
            }
            
          }
        },
        error: function(data) {
          this.showRefresh('系统开了小差，请刷新页面');
        }
      })
    }
    
  }


  // 点击提问局部刷新问题界面
  $('.live_detail_ask').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    var text = $('.live_detail_text').val();
    if(!text){
      this.showAlert('请输入问题')
      return;
    }
    var data = {
      ldid: ldid,
      lsu: ownUri,
      qd: text
    }
    $.ajax({
      type: 'post',
      url: Common.globalDistUrl()+'/exp/AddLiveQuestion.do',
      data: JSON.stringify(data),
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          $('.live_detail_text').val('');
          getLiveQuestion(ldid);
        }
      }.bind(this),
      error: function(data) {
        this.showRefresh('系统开了小差，请刷新页面');
      }.bind(this)
    })
  });



  // tab切换
  $('.live_detail_nav').on('click', 'li', function(event) {
    event.preventDefault();
    var index = $(this).index();
    // console.log(index);
    $(this).addClass('live_detail_nav_active').siblings('').removeClass('live_detail_nav_active');
    $('.live_detail').children('').eq(index).show().siblings('').hide();
  });


  // 点击某一条数据切换到对应直播或点播
  $('.live_detail_list').on('click', 'li', function(event) {
    event.preventDefault();
    var ldid = $(this).attr('data-id');
    getLiveInfo(ldid);
  });



  // 
  $('.live_detail_top').on('click','.live_detail_play_button',function(event) {
    event.preventDefault();
    /* Act on the event */
    gotoPlay();
  });

  // 打开播放器，传入url，开播
  function gotoPlay(){
    var player = new prismplayer({
        id: "J_prismPlayer", // 容器id
        source: "http://videolive.green-stone.cn/video/livee165832311.m3u8",// 视频地址
        autoplay: true,    //自动播放：否
        width: "100%",       // 播放器宽度
        height: "100%",      // 播放器高度
        skinLayout: [                            // false | Array, 播放器使用的ui组件，非必填，不传使用默认，传false或[]整体隐藏
            {name:"bigPlayButton", align:"cc", x:30, y:80},
            {name:"controlBar", align:"blabs", x:0, y:0,
                children: [
                    {name:"progress", align:"tlabs", x: 0, y:0},
                    {name:"playButton", align:"tl", x:15, y:26},
                    {name:"timeDisplay", align:"tl", x:10, y:24},
                    {name:"fullScreenButton", align:"tr", x:20, y:25},
                    {name:"volume", align:"tr", x:20, y:25}
                ]
            }
          ]
    });
    setTimeout(function(){
        player.play();
    },300)
  }




})
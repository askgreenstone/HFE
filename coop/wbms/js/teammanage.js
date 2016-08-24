var session = Common.getUrlParam('session');
var keyWord = Common.getUrlParam('keyWord');
var pageCount = 0;




jQuery(function($){
  // 点击头部li标示为选中状态，在底部添加li，已选中则取消选中状态，并更新底部结构
  $('#teamManage_lawyerList').on('click','li',function(){
    // console.log(this);
    if(!$(this).hasClass('teamManage_selected')){
      var showId = $(this).attr('showId');
      var lawyerTel = $(this).attr('lawyerTel');
      var str = '<li class="teamManage_close" selectId="'+showId+'" lawyerTel='+lawyerTel+'>'+$(this).html()+'</li>';
      // console.log(str);
      var lawyerTellist = [];
      var lawyerTellists = $('#teamManage_selectList li');
      for(var i=0;i<lawyerTellists.length;i++){
        lawyerTellist.push($(lawyerTellists[i]).attr('lawyerTel'));
      }
      // console.log(lawyerTellist);
      if($.inArray(lawyerTel,lawyerTellist) == -1){
        $('#teamManage_selectList').append(str);
        $(this).addClass('teamManage_selected');
      }else{
        alert('该律师已在机构团队中！')
      }
    }else{
      $(this).removeClass('teamManage_selected');
      var showId = $(this).attr('showId');
      var selectLi = $('li[selectId='+showId+']');
      // console.log(selectLi);
      selectLi.remove();
    }
  }) 
  // 点击底部li关闭按钮，底部删除li，头部对应li改变状态
  $('#teamManage_selectList').on('click','.teamManage_delete',function(){
    // console.log(this);
    var selectId = $(this).parent().attr('selectId');
    if(selectId){
      var showLi = $('li[showId='+selectId+']');
      // console.log(showLi);
      showLi.removeClass('teamManage_selected');
    }
    $(this).parent().remove();
  })

  // 手动添加团队成员操作
  $('.teamManage_addImg img').bind('click',function(){
    var lawyerName = $('#lawyerName').val();
    var lawyerTel = $('#lawyerTel').val();
    var lawyerTellist = [];
    var lawyerTellists = $('#teamManage_selectList li');
    var on = Common.getUrlParam('on');
    for(var i=0;i<lawyerTellists.length;i++){
      lawyerTellist.push($(lawyerTellists[i]).attr('lawyerTel'));
    }
    console.log($.inArray(lawyerTel,lawyerTellist));
    if(!lawyerName){
      alert('请输入律师姓名！');
      return;
    }else if(!lawyerTel){
      alert('请输入律师电话！');
      return;
    }else if($.inArray(lawyerTel,lawyerTellist) > -1){
      alert('该律师已在机构团队中！');
    }else if($.inArray(lawyerTel,lawyerTellist) == -1){
      // console.log(Common.globalTransferUrl()+'header.jpg')
      var str = '<li class="teamManage_close" lawyerTel='+lawyerTel+'><div class="teamManage_imgBox"><img class="teamManage_headImg" src='+Common.globalTransferUrl()+on+'><div class="teamManage_imgMark">'
              + '<img src="../image/lawSelect.png"/></div></div><p><span class="teamManage_title_name">'+lawyerName+'</span>'
              + '<span> 律师</span></p><img class="teamManage_delete" src="../image/delete.png"></li>'
      $('#teamManage_selectList').append(str);
      $('#lawyerName').val('');
      $('#lawyerTel').val('');
    }
  })

  // 点击提交按钮
  $('#teamManage_submit').bind('click',function(){
    var list = $('#teamManage_selectList li');
    var ownUri = Common.getUrlParam('ei');
    var from = Common.getUrlParam('from');
    // console.log(list)
    if(list.length == 0){
      alert('请至少选择一位律师！');
      return;
    }else{
      var arr=[];
      for(var i=0;i<list.length;i++){
        // console.log(list[i]); 
        var key = Common.globalTransferUrl();
        arr.push({
          ei: $(list[i]).attr('selectId')?$(list[i]).attr('selectId'):'',
          en: $(list[i]).find('.teamManage_title_name').text(),
          mn: $(list[i]).attr('lawyerTel'),
          p: $(list[i]).find('.teamManage_headImg').attr('src').replace(new RegExp(key,'g'),'')
        })      
      }
      var di = Common.getUrlParam('ei');
      var data = {
        di: di,
        ida: 0,
        ea: arr
      }
      $.ajax({
        type : 'POST',
        url : Common.globalDistUrl() + 'exp/AddExpToDept.do?session='+ session,
        data: JSON.stringify(data),
        success : function(data) {
          console.log(data);
          if(data.c == 1000){
            if(from == 'app'){
              alert('提交成功！')
            }else{
              window.location.href = Common.globalDistUrl()+'usr/ThirdHomePage.do?ownUri=e'+ownUri+'&ida=1&origin=shade';
            }
          }
          // 待修改
        },
        error : function(){
          alert('网络连接错误或服务器异常！');
        }
      })

    }
  })
  // 页面初始化获取模糊查询机构成员（分页处理）
  function getOrgMember(page){
    var on = Common.getUrlParam('on');
    console.log(on);
    var ei = Common.getUrlParam('ei');
    $.ajax({
      type: 'GET',
      url: Common.globalDistUrl() + 'exp/GetAllExpInDept.do?session='+session+'&k='+encodeURI(keyWord)+'&c=4&p='+page,
      success : function(data) {
        console.log(data);
        if(data.c == 1000){
          pageCount++;
          var html = $('#teamManage_lawyerList').html();
          if(data.el.length<4){
            $('.teamManage_loadMore').hide()
          }
          for(var i=0;i<data.el.length;i++){
            var head = data.el[i].p?(Common.globalTransferUrl()+data.el[i].p):(Common.globalTransferUrl()+on);
            console.log(head);
            var className = data.el[i].ei == ei?'teamManage_selected':'';
            html += '<li showId='+data.el[i].ei+' lawyerTel='+data.el[i].mn+' class='+className+'>'
                  + '<div class="teamManage_imgBox"><img class="teamManage_headImg" src="'+head+'">'
                  + '<div class="teamManage_imgMark"><img src="../image/lawSelect.png"/></div></div>'
                  + '<p><span class="teamManage_title_name">'+data.el[i].n+'</span><span> 律师</span></p>'
                  + '<img class="teamManage_delete" src="../image/delete.png"></li>'
          }
          $('#teamManage_lawyerList').html(html);
          // var list = $(html);
          // for(var i=0;i<list.length;i++){
          //   console.log($(list[i]).attr('showId'));
          //   if($(list[i]).attr('showId') == ei){
          //     var showId = $(list[i]).attr('showId');
          //     var lawyerTel = $(list[i]).attr('lawyerTel');
          //     var str = '<li class="teamManage_close" selectId="'+showId+'" lawyerTel='+lawyerTel+'>'+$(list[i]).html()+'</li>';
          //     var lawyerTellist = [];
          //     var lawyerTellists = $('#teamManage_selectList li');
          //     for(var i=0;i<lawyerTellists.length;i++){
          //       lawyerTellist.push($(lawyerTellists[i]).attr('lawyerTel'));
          //     }
          //     // console.log(lawyerTellist);
          //     if($.inArray(lawyerTel,lawyerTellist) == -1){
          //       $('#teamManage_selectList').append(str);
          //     }
          //   }
          // }
        }
      },
      error: function(){
        alert('网络连接错误或服务器异常！')
      }  
    })
  }


  // 页面初始化获取机构存在成员
  function getOrgExistMember(){
    var ei = Common.getUrlParam('ei');
    var on = Common.getUrlParam('on');
    $.ajax({
      type: 'GET',
      url: Common.globalDistUrl() + 'exp/GetDeptMembers.do?session='+session+'&di='+ei,
      success : function(data) {
        console.log(data);
        if(data.c == 1000){
          var html = $('#teamManage_selectList').html();
          if(data.el.length>0){
            for(var i=0;i<data.el.length;i++){
              var head = data.el[i].p?(Common.globalTransferUrl()+data.el[i].p):(Common.globalTransferUrl()+on);
              html += '<li class="teamManage_close" selectId="'+data.el[i].ei+'" lawyerTel="'+data.el[i].mn+'""><div class="teamManage_imgBox"><img class="teamManage_headImg" src="'+head+'">'
                    + '<div class="teamManage_imgMark"><img src="../image/lawSelect.png"/></div></div>'
                    + '<p><span class="teamManage_title_name">'+data.el[i].n+'</span><span> 律师</span></p>'
                    + '<img class="teamManage_delete" src="../image/delete.png"></li>'
              // $('#teamManage_lawyerList li[lawyerTel='+data.el[i].mn+']').addClass('teamManage_selected')
            }
            $('#teamManage_selectList').html(html);
          }
        }
      },
      error: function(){
        alert('网络连接错误或服务器异常！')
      }  
    })
  }
  
  $('.teamManage_loadMore').bind('click',function(){
    getOrgMember(pageCount);
  })


  //初始化数据
  function initAll() {
    getOrgMember(pageCount);
    getOrgExistMember();
  }

  initAll();
})




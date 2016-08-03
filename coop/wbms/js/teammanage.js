var openId = Common.getUrlParam('openId');
console.log(openId);




jQuery(function($){
  // 点击头部li标示为选中状态，在底部添加li，已选中则取消选中状态，并更新底部结构
  $('#teamManage_lawyerList li').bind('click',function(){
    // console.log(this);
    if(!$(this).hasClass('teamManage_selected')){
      var showId = $(this).attr('showId');
      var str = '<li class="teamManage_close" selectId="'+showId+'">'+$(this).html()+'</li>';
      // console.log(str);
      $('#teamManage_selectList').append(str);
      $(this).addClass('teamManage_selected');
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
    if(!lawyerName){
      alert('请输入律师姓名！');
      return;
    }else if(!lawyerTel){
      alert('请输入律师电话！');
      return;
    }else{
      // console.log(Common.globalTransferUrl()+'header.jpg')
      var str = '<li class="teamManage_close" lawyerTel='+lawyerTel+' lawyerName='+lawyerName+' ><div class="teamManage_imgBox"><img src="'+Common.globalTransferUrl()+'header.jpg"><div class="teamManage_imgMark">'
              + '<img src="../image/lawSelect.png"/></div></div><p><span class="teamManage_title_name">'+lawyerName+'</span>'
              + '<span> 律师</span></p><img class="teamManage_delete" src="../image/delete.png"></li>'
      $('#teamManage_selectList').append(str);
    }
  })

  // 点击提交按钮
  $('#teamManage_submit').bind('click',function(){
    var list = $('#teamManage_selectList li');
    // console.log(list)
    if(list.length == 0){
      alert('请至少选择一位律师！');
      return;
    }else{
      var arr1=[],arr2=[];
      for(var i=0;i<list.length;i++){
        console.log($(list[i]).attr('selectId'));
        if($(list[i]).attr('selectId')){
          arr1.push($(list[i]).attr('selectId'))
        }else{
          arr2.push({
            tel: $(list[i]).attr('lawyerTel'),
            name: $(list[i]).attr('lawyerName')
          })
        }
      }
      console.log(arr1);
      console.log(arr2);
      $.ajax({
      type : 'POST',
      url : Common.globalDistUrl() + 'exp/ExpMicroCardForMobile.do',
      data : JSON.stringify(data),
      dataType:'json',
      contentType:'application/json',
      success : function(data) {
        console.log(data);
        // 待修改
      },
      error : function(){
        alert('网络连接错误或服务器异常！');
      }
    })

    }
  })


    

  //初始化数据
  function initAll() {
    // getHeadImg();
  }

  initAll();
})




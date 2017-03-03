var React = require('react');

var CommonMixin = require('../../Mixin');
var prismplayer = require('../../common/prism-min.react')


var LiveDetail = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      FirstData: [],
      ListData: [],
      QuestionList: [],
      editFlag: false,
      editState: false,
      editShowFlag: false
    };
  },
  getEidtState: function(){
    var ida = this.getUrlParams('ida');
    if(ida == 1){
      this.setState({
        editFlag: true
      })
    }
  },
  getTheOne: function(data,ldid){
    var arr = [];
    console.log(data);
    for(var i = 0,len = data.length;i<len;i++){
      if(data[i].ldid == ldid){
        arr = data[i]
      }
    };
    console.log(arr);
    return [arr];
  },
  postLiveQuestions:function(){
    var ldid = window.localStorage.getItem('ldid');
    var session = this.getUrlParams('session');
    var text = $('.live_detail_text').val();
    var ownUri = this.getUrlParams('ownUri');
    if(!text){
      alert('请输入问题！');
      return;
    }
    var data = {
      ldid: ldid,
      lsu: ownUri,
      qd: text
    }
    $.ajax({
      type: 'post',
      url: global.url+'/exp/AddLiveQuestion.do?session='+session,
      data: JSON.stringify(data),
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          $('.live_detail_text').val('');
          this.getLiveQuestion(ldid);
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  getLiveQuestion:function(ldid){
    var session = this.getUrlParams('session');
    var ldid = ldid?ldid:window.localStorage.getItem('ldid');
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveQuestion.do?session='+session+'&ldid='+ldid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          this.setState({
            QuestionList: data.ql
          })
        }
      }.bind(this),
      error: function(data) {
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  getLiveInfo: function(ldid){
  	var ownUri = this.getUrlParams('ownUri');
  	var lid = this.getUrlParams('lid');
    var livedetailid = ldid;
    console.log(livedetailid);
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveInfo.do?do='+ownUri+'&lid='+lid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          var urlLdid = this.getUrlParams('ldid');
          console.log(urlLdid);
          if(!urlLdid){
            window.localStorage.setItem('ldid',data.sldid);
          }
          var livedid = livedetailid?livedetailid:window.localStorage.getItem('ldid');
          window.localStorage.setItem('ldid',livedid);
          console.log(livedid);
          this.setState({
            FirstData: this.getTheOne(data.ll,livedid),
            ListData: data.ll
          })
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  }, 
  liveVideoShow: function(data){
    console.log(data);
    this.setState({
      FirstData: [data]
    })
    $('.prism-player').show();
    $('.live_detail_top img').hide();
    var player = new prismplayer({
        id: "J_prismPlayer", // 容器id
        source: "http://live.green-stone.cn/gstone/liveIOS.m3u8",// 视频地址
        autoplay: true,    //自动播放：否
        width: "100%"      // 播放器高度
    });
    var ldid = data.ldid;
    $('.live_detail_list li[data-id='+ldid+']').addClass('class_name')
    console.log('qiaofan:::::::::::'+$('.live_detail_list li[data-id='+ldid+']'));
    // $('.live_detail_list').on('click', 'li', function(event) {
    //   event.preventDefault();
    //   var index = $(this).index();
    //   console.log($(this));
    //   alert(index);
    //   console.log($('.live_detail_list').children('').eq(index));
    //   // .addClass('live_detail_list_active');
    //   // $(this).addClass('live_detail_list_active')  //.siblings('').removeClass('live_detail_list_active');
    //   // $('.live_detail').children('').eq(index).show().siblings('').hide();
    // });
    // player.play();
  },
  gotoDetail: function(ldid){
    console.log('跳转到其他详情直播ldid'+ldid);
    window.localStorage.setItem('ldid',ldid);
    console.log(window.localStorage.getItem('ldid'));
    this.getLiveInfo(ldid);
    this.getLiveQuestion(ldid);
  },
  gotoCreatNewLive: function(){
    var lid = this.getUrlParams('lid');
    var ida = this.getUrlParams('ida');
    var ownUri = this.getUrlParams('ownUri');
    var session = this.getUrlParams('session');
    location.href = '#/CreateLive?ownUri='+ownUri+'&lid='+lid+'&ida='+ida+'&session='+session;
  },
  gotoEditLive: function(){
    var selectLiveDoms = $('.live_detail_list_input_active');
    console.log(selectLiveDoms.length);
    if(selectLiveDoms.length == 0){
      alert('请先选择要编辑的直播！');
      return;
    }
    if(selectLiveDoms.length > 1){
      alert('每次最多可编辑一条直播内容！')
      return;
    }
    var lid = this.getUrlParams('lid');
    var ida = this.getUrlParams('ida');
    var ldid = $(selectLiveDoms[0]).parent().attr('data-id');
    var ownUri = this.getUrlParams('ownUri');
    var session = this.getUrlParams('session');
    console.log(ldid);
    location.href = '#/CreateLive?ownUri='+ownUri+'&lid='+lid+'&ldid='+ldid+'&ida='+ida+'&session='+session;
  },
  gotoDeleteLive: function(){
    var selectLiveDoms = $('.live_detail_list_input_active');
    var session = this.getUrlParams('session');
    console.log(selectLiveDoms.length);
    if(selectLiveDoms.length == 0){
      alert('请先选择要删除的直播！');
      return;
    }
    var arr = [];
    for (var i = selectLiveDoms.length - 1; i >= 0; i--) {
      arr.push($(selectLiveDoms[i]).parent().attr('data-id'));
    }
    console.log(arr);
    var data = {
      ldids : arr
    }
    var flag = window.confirm('确定要删除么？');
    if(flag){
      $.ajax({
        type: 'post',
        url: global.url+'/exp/DeleteLiveInfo.do?session='+session,
        data: JSON.stringify(data),
        success: function(data) {
          console.log(data);
          if(data.c == 1000){
            this.getLiveInfo();
            this.getLiveQuestion();
            this.setState({
              editState: false
            })
            $('.live_detail_list_edit').show();
            $('.live_detail_list_edit_delete').hide();
          }
        }.bind(this),
        error: function(data) {
            // console.log(data);
          alert('系统开了小差，请刷新页面');
        }.bind(this)
      })
    }
    
  },
  editDetailLive: function(){
    this.setState({
      editState: true,
      editFlag: false
    })
    $('.live_detail_list_edit_delete').show();
  },
  selectLiveDetail: function(ldid){
    console.log(ldid);
    var selectLiveDom = $('.live_detail_list li[data-id='+ldid+'] .live_detail_list_input');
    if(selectLiveDom.hasClass('live_detail_list_input_active')){
      selectLiveDom.removeClass('live_detail_list_input_active');
    }else{
      selectLiveDom.addClass('live_detail_list_input_active');
    }
    // $('.live_detail_list li[data-id='+ldid+'] .live_detail_list_input').addClass('live_detail_list_input_active');
    // console.log(this);
    // $(this).addClass('live_detail_list_input_active');
  },
  judgeTime: function(time){
    var now = new Date();
    var theTime = new Date(time);
    var end = now - theTime;
    var str = '';
    console.log(end);
    if(end < 60*1000*1000){
      str = '刚刚';
    }else{
      str = ''
    }
    return end;
  },
  componentDidMount: function(){
    var $body = $('body')
    document.title = '直播详情';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
    $('.live_detail_nav').on('click', 'li', function(event) {
    	event.preventDefault();
    	var index = $(this).index();
    	// console.log(index);
    	$(this).addClass('live_detail_nav_active').siblings('').removeClass('live_detail_nav_active');
    	$('.live_detail').children('').eq(index).show().siblings('').hide();
    });
  },
  componentWillMount: function(){
    var ldid = this.getUrlParams('ldid');
    if(ldid){
      this.getLiveInfo(ldid);
      this.getLiveQuestion(ldid);
    }else{
      this.getLiveInfo();
      this.getLiveQuestion();
    }
    this.getEidtState();
  },
  render:function(){
    var ldid = window.localStorage.getItem('ldid');
    console.log(this.state.editShowFlag);
    console.log(this.state.editFlag);
  	var FirstDataShow = this.state.FirstData.map(function(item,i){
      return(
        <div className="live_list_top live_detail_top" key={new Date().getTime()+i}>
          <div id="J_prismPlayer" className="prism-player"></div>
          <img className="live_detail_bg" src={item.lp?(global.img+item.lp):(global.img+'header.jpg')} />
          <div className="live_list_top_content">
            <div><span>{item.ld}</span><span></span></div>
            <div><span className="live_list_teacher">主讲：<span>{item.sn}</span> <span>律师</span></span><span>{new Date(item.livetime).Format("MM/dd hh:mm")}</span></div>
          </div>
          <img className="live_detail_play" onClick={this.liveVideoShow.bind(this,item)} src="../../image/play.png"/>
        </div>
       );
    }.bind(this));
    var len = this.state.ListData.length-1;
    console.log(len);
    var ListDataShow = this.state.ListData.map(function(item,i){
      return(
        <li data-id={item.ldid} className={item.ldid == ldid?"live_detail_list_active":""} key={new Date().getTime()+i}>
          <div className="live_detail_list_input" onClick={this.selectLiveDetail.bind(this,item.ldid)} style={{display:this.state.editState?'block':'none'}}></div>
          <div className="live_detail_list_img" onClick={this.gotoDetail.bind(this,item.ldid)}>
            <i></i>
    				<div></div>
    			</div>
    			<div className="live_detail_list_content" onClick={this.gotoDetail.bind(this,item.ldid)}>
    				<div className="live_list_title">{item.lt}<br/><i>视频</i></div>
    				<div className="live_list_content">{new Date(item.livetime).Format("yyyy-MM-dd hh:mm")}</div>
    			</div>
        </li>
       );
    }.bind(this));
    console.log(this.state.FirstData);
    var TeacherDataShow = this.state.FirstData.map(function(item,i){
      return(
      	<div key={new Date().getTime()+i}>
      		<div className="live_detail_class">
          		<p className="live_detail_introduce_box">课程详情</p>
          		<div>{item.lt}</div>
          	</div>
          	<div className="live_detail_class">
          		<p className="live_detail_introduce_box">讲师介绍</p>
          		<img src={item.sp?(global.img+item.sp):(global.img+'header.jpg')}/>
          		<p className="live_detail_introduce_teacher"><span className="teacher_name">{item.sn}</span><span className="teacher_job">律师</span></p>
          		<div>{item.sd}</div>
          	</div>
      	</div>
        
       );
    }.bind(this));
    var QuestionListShow = this.state.QuestionList.map(function(item,i){
      return(
        <li key={new Date().getTime()+i}>
          <div className="live_detail_question_img">
            <img src={item.dp?(global.img+item.dp):(global.img+'header.jpg')} width="50" height="50"/>
          </div>
          <div className="live_detail_question_content">
            <span>
              <i className="live_detail_question_content_name">{item.qn}</i>
              <i className="live_detail_question_content_time">{this.judgeTime(item.ts)}</i><br/>
              <i className="live_detail_question_content_text">{item.qd}</i>
            </span>
          </div>
        </li>
       );
    }.bind(this));
    return(
        <div className="live_list_box">
          {FirstDataShow}
          <ul className="live_detail_nav">
          	<li className="live_detail_nav_active"><span>目录</span><span>.</span></li>
          	<li><span>介绍</span><span>.</span></li>
          	<li><span>提问</span><span>.</span></li>
          </ul>
          <div className="live_detail">
            <div className="live_detail_list_box">
              <ul className="live_detail_list">
                {ListDataShow}
              </ul>
              <div className="live_detail_list_edit" style={{display:this.state.editFlag?'box':'none'}}>
                <span onClick={this.editDetailLive}><img src="image/live_detail_edit.png"/>编辑</span>
                <span onClick={this.gotoCreatNewLive}><img src="image/live_detail_new.png"/>新建</span>
              </div>
              <div className="live_detail_list_edit live_detail_list_edit_delete" style={{display:this.state.editShowFlag?'box':'none'}}>
                <span></span>
                <span></span>
                <span onClick={this.gotoEditLive}>编辑</span>
                <span onClick={this.gotoDeleteLive} className="delete">删除</span>
              </div>
            </div>
          	
	          <div className="live_detail_introduce">
	          	{TeacherDataShow}
	          </div>
	          <div className="live_detail_question">
              <ul className="live_detail_question_box">
                {QuestionListShow}
              </ul>
              <div className="live_detail_question_text">
                <input className="live_detail_text" placeholder="请输入文字" type="text"/>
                <span onClick={this.postLiveQuestions}>提问</span>
              </div>
	          </div>
          </div>
          
        </div> 
    );
  }
});

module.exports = LiveDetail;
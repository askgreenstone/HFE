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
      editFlag: false,    //是否显示编辑框ida=1显示ida=0隐藏
      editState: false,   //用于在编辑时切换目录列表结构
      editShowFlag: false,    //点击编辑时出现新的编辑框（包含取消按钮）
      askQuestionFlag: true,  //是否可以进行提问data.ls为2即正在直播时可以进行提问，其余情况都不可以
      ldid: 0,
      editDetailFlag: false     //目录列表中没有具体直播时不显示编辑按钮
    };
  },
  getLiveListPic: function(){
    var ownUri = this.getUrlParams('ownUri');
    var lid = this.getUrlParams('lid');
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveListInfo.do?do='+ownUri,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          for (var i = data.ll.length - 1; i >= 0; i--) {
            if(data.ll[i].lid == lid){
              this.setState({
                liveListPic: data.ll[i].lp
              })
            }
          }
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  getEidtState: function(){
    var ida = this.getUrlParams('ida');
    if(ida == 1){
      this.setState({
        editFlag: true
      })
    }
  },
  getTheOne: function(data,LiveDetailId){
    var arr = [];
    console.log(data);
    for(var i = 0,len = data.length;i<len;i++){
      if(data[i].ldid == LiveDetailId){
        arr = data[i]
      }
    }
    console.log(arr);
    return [arr];
  },
  postLiveQuestions:function(){
    // var ldid = window.sessionStorage.getItem('ldid');
    var session = this.getUrlParams('session');
    var text = $('.live_detail_text').val();
    var ownUri = this.getUrlParams('ownUri');
    if(!text){
      alert('请输入问题！');
      return;
    }
    var data = {
      ldid: this.state.ldid,
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
          this.getLiveQuestion(this.state.ldid);
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  getLiveQuestion:function(LiveDetailId){
    var session = this.getUrlParams('session');
    var ldid = LiveDetailId?LiveDetailId:this.state.ldid;
    console.log(ldid);
    if(ldid == 0 || !ldid){
      this.setState({
        QuestionList: [],
        askQuestionFlag: false
      })
    }else{
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
    }
    
  },
  getLiveInfo: function(LiveDetailId){
  	var ownUri = this.getUrlParams('ownUri');
  	var lid = this.getUrlParams('lid');
    var livedetailid = LiveDetailId;
    // console.log(livedetailid);
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveInfo.do?do='+ownUri+'&lid='+lid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          // livestatus: int 直播状态  1 未直播   2直播中  3直播结束
          var urlLdid = this.getUrlParams('ldid');
          console.log(urlLdid);
          if(!urlLdid){
            this.setState({
              ldid: data.sldid
            })
          }
          var livedid = livedetailid?livedetailid:data.sldid;
          // console.log(livedid);
          this.setState({
            ldid: livedid,
            FirstData: this.getTheOne(data.ll,livedid),
            ListData: data.ll,
            askQuestionFlag: this.getTheOne(data.ll,livedid)[0].ls == 2?true:false,
            editDetailFlag: data.ll.length>0?true:false
          })
          if(this.getTheOne(data.ll,livedid)[0].ls == 2){
            $('.live_detail_question_text').show();
          }
          this.getLiveQuestion(livedid);
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
    // $('.prism-player').show();
    $('.live_detail_top img').hide();
    $('.live_detail_play').hide();
    var source = data.ls==3?data.va:data.la;
    // "http://live.green-stone.cn/gstone/liveIOS.m3u8"
    // alert(source);
    
    var player = new prismplayer({
      id: "J_prismPlayer", // 容器id
      source: source,// 视频地址
      autoplay: true,    //自动播放：是（移动端不支持）
      width: "100%",      // 播放器宽度
      height: "200px",     //播放器高度
      isLive: data.ls == 2?true:false,
      showBuffer: true
    });
    setTimeout(function(){
        player.play();
        console.log('qiaof:video play success')
      },300
    );
    
  },
  gotoDetail: function(LiveDetailId){
    console.log('跳转到其他详情直播ldid'+LiveDetailId);
    this.setState({
      ldid: LiveDetailId
    })
    this.getLiveInfo(LiveDetailId);
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
            // this.getLiveQuestion();
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
  cancleEdit: function(){
    this.setState({
      editState: false
    })
    $('.live_detail_list_edit').show();
    $('.live_detail_list_edit_delete').hide();
  },
  selectLiveDetail: function(LiveDetailId){
    console.log(LiveDetailId);
    var selectLiveDom = $('.live_detail_list li[data-id='+LiveDetailId+'] .live_detail_list_input');
    if(selectLiveDom.hasClass('live_detail_list_input_active')){
      selectLiveDom.removeClass('live_detail_list_input_active');
    }else{
      selectLiveDom.addClass('live_detail_list_input_active');
    }
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
    this.getLiveListPic();
    if(ldid){
      this.getLiveInfo(ldid);
    }else{
      this.getLiveInfo();
    }
    this.getEidtState();
  },
  render:function(){
    // var ldid = window.sessionStorage.getItem('ldid');
    var ldid = this.state.ldid;
    // console.log(this.state.editShowFlag);
    console.log(this.state.askQuestionFlag);
    var now  = new Date().getTime();
  	var FirstDataShow = this.state.FirstData.map(function(item,i){
      return(
        <div className="live_list_top live_detail_top" key={new Date().getTime()+i}>
          <div id="J_prismPlayer" className="prism-player"></div>
          <img className="live_detail_bg" src={item.lp?(global.img+item.lp):(global.img+this.state.liveListPic)} />
          <div className="live_list_top_content">
            <div><span>{item.lt?item.lt:'课程介绍'}</span><span className={item.ls == 2?'live_list_live':'live_list_live_no'}>直播中</span></div>
            <div><span className="live_list_teacher">主讲：<span>{item.sn?item.sn:'无'}</span> <span style={{display:item.sn?'inline':'none'}}>律师</span></span><span>{item.livetime?(new Date(item.livetime).Format("MM/dd hh:mm")):'直播时间'}</span></div>
          </div>
          <div className="live_detail_shadow" style={{display:item.ls == 2?'inline':'none'}}><span className="live_detail_play" onClick={this.liveVideoShow.bind(this,item)}>进入直播</span></div>
          <div className="live_detail_shadow" style={{display:item.ls == 1?'inline':'none'}}><span className="live_detail_play live_detail_play_time">直播时间：{item.livetime?(new Date(item.livetime).Format("MM/dd hh:mm")):'无'}</span></div>
          <div className="live_detail_shadow" style={{display:item.ls == 3?'inline':'none'}}><span className="live_detail_play live_detail_play_button" onClick={this.liveVideoShow.bind(this,item)}><img src="image/video_on.png"/></span></div>
        </div>
       );
    }.bind(this));
    var len = this.state.ListData.length-1;
    // console.log(len);
    var ListDataShow = this.state.ListData.map(function(item,i){
      return(
        <li data-id={item.ldid} className={item.ldid == ldid?"live_detail_list_active":""} key={new Date().getTime()+i} onClick={this.gotoDetail.bind(this,item.ldid)}>
          <div className="live_detail_list_img">
            <i></i>
    				<div></div>
    			</div>
    			<div className="live_detail_list_content">
    				<div className="live_list_title">{item.lt}<br/><i>{item.ls == 3?'点播':'直播'}</i></div>
    				<div className="live_list_content">{item.ls == 3?'':new Date(item.livetime).Format("yyyy-MM-dd hh:mm")}</div>
    			</div>
        </li>
       );
    }.bind(this));
    var ListDataInputShow = this.state.ListData.map(function(item,i){
      return(
        <li data-id={item.ldid} className={item.ldid == ldid?"live_detail_list_active":""} key={new Date().getTime()+i} onClick={this.selectLiveDetail.bind(this,item.ldid)} >
          <div className="live_detail_list_input"></div>
          <div className="live_detail_list_img">
            <i></i>
            <div></div>
          </div>
          <div className="live_detail_list_content">
            <div className="live_list_title">{item.lt}<br/><i>{item.ls == 3?'点播':'直播'}</i></div>
            <div className="live_list_content">{item.ls == 3?'':new Date(item.livetime).Format("yyyy-MM-dd hh:mm")}</div>
          </div>
        </li>
       );
    }.bind(this));
    // console.log(this.state.FirstData);
    var TeacherDataShow = this.state.FirstData.map(function(item,i){
      return(
      	<div key={new Date().getTime()+i}>
      		<div className="live_detail_class">
          		<p className="live_detail_introduce_box">课程详情</p>
          		<div>{item.ld}</div>
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
              <i className="live_detail_question_content_time">{new Date(item.ts).Format("MM-dd hh:mm")}</i><br/>
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
              <ul className="live_detail_list" style={{display:this.state.editState?'none':'block'}}>
                {ListDataShow}
              </ul>
              <ul className="live_detail_list" style={{display:this.state.editState?'block':'none'}}>
                {ListDataInputShow}
              </ul>
              <div className="live_detail_list_edit" style={{display:this.state.editFlag?'box':'none'}}>
                <span onClick={this.editDetailLive} style={{display:this.state.editDetailFlag?'block':'none'}}><img src="image/live_detail_edit.png"/>编辑</span>
                <span onClick={this.gotoCreatNewLive}><img src="image/live_detail_new.png"/>新建</span>
              </div>
              <div className="live_detail_list_edit live_detail_list_edit_delete" style={{display:this.state.editShowFlag?'box':'none'}}>
                <span onClick={this.cancleEdit}>取消</span>
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
              <div className="live_detail_question_text" style={{display:this.state.askQuestionFlag?'box':'none'}}>
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
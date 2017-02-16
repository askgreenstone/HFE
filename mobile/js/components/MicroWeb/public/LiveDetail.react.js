var React = require('react');

var CommonMixin = require('../../Mixin');



var LiveDetail = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      FirstData:[],
      ListData:[]
    };
  },
  getLiveInfo: function(ownUri){
  	var deptOwnUri = this.getUrlParams('deptOwnUri')||'e399';
  	var lid = this.getUrlParams('lid');
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveInfo.do?do='+deptOwnUri+'&lid='+lid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          this.setState({
            FirstData: data.ll.length > 0?data.ll.slice(0,1):[],
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
    this.getLiveInfo();
  },
  render:function(){
  	var FirstDataShow = this.state.FirstData.map(function(item,i){
      return(
        <div className="live_list_top live_detail_top" key={new Date().getTime()+i}>
          <img src={global.img+item.lp} />
          <div className="live_list_top_content">
            <div><span>{item.ld}</span><span></span></div>
            <div><span className="live_list_teacher">主讲：<span>{item.sn}</span> <span>律师</span></span><span>{new Date(item.livetime).Format("MM/dd hh:mm")}</span></div>
          </div>
        </div>
       );
    }.bind(this));
    var len = this.state.ListData.length-1;
    console.log(len);
    var ListDataShow = this.state.ListData.map(function(item,i){
      return(
        <li className={i == 0?"live_detail_list_first":(i == len?"live_detail_list_last":"")} key={new Date().getTime()+i}>
			<div className="live_detail_list_img">
				<img src={global.img+item.lp} />
				<div></div>
			</div>
			<div className="live_detail_list_content">
				<div className="live_list_title">{item.ld}<br/><i>视频</i></div>
				<div className="live_list_content">{new Date(item.livetime).Format("yyyy-MM-dd hh:mm")}</div>
			</div>
        </li>
       );
    }.bind(this));
    var TeacherDataShow = this.state.FirstData.map(function(item,i){
      return(
      	<div key={new Date().getTime()+i}>
      		<div className="live_detail_class">
          		<p className="live_detail_introduce_box">课程详情</p>
          		<div>{item.lt}</div>
          	</div>
          	<div className="live_detail_class">
          		<p className="live_detail_introduce_box">讲师介绍</p>
          		<img src="../../image/wj.png"/>
          		<p className="live_detail_introduce_teacher"><span className="teacher_name">{item.sn}</span><span className="teacher_job">律师</span></p>
          		<div>{item.sd}</div>
          	</div>
      	</div>
        
       );
    }.bind(this));
    return(
        <div className="live_list_box">
          {FirstDataShow}
          <ul className="live_detail_nav">
          	<li className="live_detail_nav_active"><span>目录</span><span>.</span></li>
          	<li><span>介绍</span><span>.</span></li>
          	<li><span>目录</span><span>.</span></li>
          </ul>
          <div className="live_detail">
          	<ul className="live_detail_list">
	            {ListDataShow}
	          </ul>
	          <div className="live_detail_introduce">
	          	{TeacherDataShow}
	          </div>
	          <div className="live_detail_introduce">
	          	<div className="live_detail_class">
	          		<p className="live_detail_introduce_box">课程详情</p>
	          		<div>妇女未经开发呢我反胃可能扶危济困妇女为风味咖啡那我就饿开发范围可分为看见俄方范围可分为加客服范围可分为开发</div>
	          	</div>
	          	<div className="live_detail_class">
	          		<p className="live_detail_introduce_box">讲师介绍</p>
	          		<img src="../../image/wj.png"/>
	          		<p className="live_detail_introduce_teacher"><span className="teacher_name">李晓飞</span><span className="teacher_job">律师</span></p>
	          		<div>妇女未经开发呢我反胃可能扶危济困妇女为风味咖啡那我就饿开发范围可分为看见俄方范围可分为加客服范围可分为开发</div>
	          	</div>
	          </div>
          </div>
          
        </div> 
    );
  }
});

module.exports = LiveDetail;
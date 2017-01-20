var React = require('react');
var CommonMixin = require('../../Mixin');
var ReportDetail = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      reportTitle: ''
    };
  },
  consultNum: function(){
    var reportContent = $('.reportContent textarea').val();
    var len = reportContent?reportContent.length:0;
    // console.log(len);
    $('.reportNom i').text(len);
  },
  submitReport: function(){
    var arr = ['其他','欺诈','色情','不实信息','违法犯罪','侵权'];
    var type = this.getUrlParams('type');
    var ownUri = this.getUrlParams('ownUri');
    var fid = this.getUrlParams('fid');
    var reportTypeNm = arr[type];
    var reportContent = $('.reportContent textarea').val();
    var len = reportContent?reportContent.length:0;
    if(len>200){
      alert('投诉描述内容过长！');
      return;
    }else{
      // ctype：int 被投诉类别  1 最新动态   2 微课堂
      var data = {
        cn : reportTypeNm,
        ct : type,
        cd : reportContent,
        fid : fid,
        ctype : 1
      }
      $.ajax({
        type: 'POST',
        url: global.url+'/usr/UserComplaint.do',
        data: JSON.stringify(data),
        success: function(data) {
          console.log(data);
          if(data.c == 1000){
            alert('提交成功！')
            WeixinJSBridge.call('closeWindow');
          }
        }.bind(this),
        error: function(data) {
            // console.log(data);
            alert('系统开了小差，请刷新页面');
        }.bind(this)
      })
    }
  },
  componentDidMount: function(){
    var $body = $('body')
    document.title = '投诉';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
    window.localStorage.removeItem('reportTitle');
  },
  componentWillMount:function(){
    var reportTitle = window.localStorage.getItem('reportTitle')
    this.setState({
      reportTitle: reportTitle?(reportTitle.length>12?reportTitle.substr(0,12)+'...':reportTitle):''
    })
  }, 
  render: function() {
    // 1 欺诈 2 色情 3 不实信息 4 违法犯罪 5 侵权 6 其他
    return (
      <div className="reportBox">
        <p>投诉内容</p>
        <div className="reportTitle">{this.state.reportTitle}</div>
        <p>投诉描述</p>
        <div className="reportContent">
          <textarea placeholder="请输入投诉内容" onInput={this.consultNum}></textarea>
          <span className="reportNom"><i>0</i>/200</span>  
        </div>
        <div className="reportSub" onClick={this.submitReport}><span>提交</span></div>
      </div>
    )
  }
});

module.exports = ReportDetail;
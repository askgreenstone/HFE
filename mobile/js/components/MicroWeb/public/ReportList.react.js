var React = require('react');
var CommonMixin = require('../../Mixin');
var ReportList = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {};
  },
  gotoReportDetail: function(type){
    var ownUri = this.getUrlParams('ownUri');
    var fid = this.getUrlParams('fid');
    var ida = this.getUrlParams('ida');
    var idf = this.getUrlParams('idf');
    location.href = '#/ReportDetail?ownUri='+ownUri+'&fid='+fid+'&ida='+ida+'&idf='+idf+'&type='+type;
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
  },
  componentWillMount:function(){
  }, 
  render: function() {
    // 1 欺诈 2 色情 3 不实信息 4 违法犯罪 5 侵权 0 其他
    return (
      <div className="reportBox">
        <p>请选择投诉原因</p>
        <ul className="reportBox_list">
          <li onClick={this.gotoReportDetail.bind(this,1)}>欺诈</li>
          <li onClick={this.gotoReportDetail.bind(this,2)}>色情</li>
          <li onClick={this.gotoReportDetail.bind(this,3)}>不实信息</li>
          <li onClick={this.gotoReportDetail.bind(this,4)}>违法犯罪</li>
          <li onClick={this.gotoReportDetail.bind(this,5)}>侵权</li>
          <li onClick={this.gotoReportDetail.bind(this,0)}>其他</li>
        </ul>
      </div>
    )
  }
});

module.exports = ReportList;
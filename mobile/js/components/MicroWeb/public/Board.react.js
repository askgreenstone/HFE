var React = require('react');
var CommonMixin = require('../../Mixin');

var Board = React.createClass({
  mixins:[CommonMixin],
	getInitialState:function(){
		return {flag:false}
	},
  componentDidMount: function(){
    var documentHeight = document.body.scrollHeight;
    $('.board_content').css({'height':documentHeight});
  },
  render: function() {
    return (
        <div className="board_box">
          <div className="board_content">
            <h3>留言板</h3>
            <textarea cols="" rows="" placeholder="请输入您的问题，我会第一时间给您反馈。"/>
            <a className="board_btn" href="javascript:void(0)">提 交</a>
            <p>&nbsp;</p>
            <h3>咨询会话（20）</h3>
            <ul className="board_list">
              <li>
                <img src="image/photo.jpg" width="65" height="65"/>
                <div className="board_list_right">
                  <i></i>
                  <span>王律师 2016-5-25 10:27:35</span>
                  <p>请问有人在吗,放大防守打法。发动发放地方，公司发的发。请问有人在吗,放大防守打法。发动发放地方，公司发的发。</p>
                </div>
                <div className="clean"></div>
              </li>
              <li>
                <img src="image/photo.jpg" width="65" height="65"/>
                <div className="board_list_left">
                  <i></i>
                  <span>王律师 2016-5-25 10:27:35</span>
                  <p>请问有人在吗,放大防守打法。</p>
                </div>
              </li>
              <li>
                <img src="image/photo.jpg" width="65" height="65"/>
                <div className="board_list_right">
                  <i></i>
                  <span>王律师 2016-5-25 10:27:35</span>
                  <p>请问有人在吗,放大防守打法。发动发放地方，公司发的发。请问有人在吗,放大防守打法。发动发放地方，公司发的发。</p>
                </div>
                <div className="clean"></div>
              </li>
              <li>
                <img src="image/photo.jpg" width="65" height="65"/>
                <div className="board_list_left">
                  <i></i>
                  <span>王律师 2016-5-25 10:27:35</span>
                  <p>请问有人在吗,放大防守打法。</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
    );
  },
});

module.exports = Board;
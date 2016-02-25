var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

require('../../../../css/theme/theme007.less');
var Index007=React.createClass({
	mixins:[CommonMixin],
	getInitialState: function(){
    return {
      navArrs:[],
      path:['articleDetail','articleList','photo','articleList']
    };
  },
  gotoLink: function(path,ntid){
    var ownUri = this.getUrlParams('ownUri');
    //测试环境和正式环境用户切换
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    location.href = '#'+path+'?ownUri='+ownUri+'&ntid='+ntid;
  },
	getUserList: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    $.ajax({
      type:'get',
      url: global.url+'/exp/QueryNewsTypes.do?&ownUri='+ownUri,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          this.setState({navArrs:data.ntl});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('网络连接错误或服务器异常！');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
	componentDidMount: function(){
    this.staticWebPV(1);
    // this.getUserList();
  },
	render:function(){
		return (
				<div>
					<div className="theme7_main">
						<div className="main">
							<img src="image/theme007/bg.png" alt="" className="theme3_main_bg"/>
              <div className="logo">
                <img src="image/theme007/logo.png"/>
              </div>
						</div>
            <div className="theme7_ul">
              <div className="container1">
                <div className="test">
                  <div className="icons">
                    <img src="image/theme007/card.png" width="100%"/>
                    <span>微名片</span>
                  </div>
                  <div className="one"></div>
                  <div className="two"></div>
                  <div className="three"></div>
                </div>
              </div>
              <div className="container2">
                <div className="test">
                  <div className="icons">
                    <img src="image/theme007/learning.png" width="100%"/>
                    <span>微名片</span>
                  </div>
                  <div className="one"></div>
                  <div className="two"></div>
                  <div className="three"></div>
                </div>
                <div className="test">
                  <div className="icons">
                    <img src="image/theme007/lwrs.png" width="100%"/>
                    <span>微名片</span>
                  </div>
                  <div className="one"></div>
                  <div className="two"></div>
                  <div className="three"></div>
                </div>
                <div className="test">
                  <div className="icons">
                    <img src="image/theme007/lycp.png" width="100%"/>
                    <span>微名片</span>
                  </div>
                  <div className="one"></div>
                  <div className="two"></div>
                  <div className="three"></div>
                </div>
              </div>
              <div className="container3">
                <div className="test">
                  <div className="icons">
                    <img src="image/theme007/online.png" width="100%"/>
                    <span>微名片</span>
                  </div>
                  <div className="one"></div>
                  <div className="two"></div>
                  <div className="three"></div>
                </div>
                <div className="test">
                  <div className="icons">
                    <img src="image/theme007/photo2.png" width="100%"/>
                    <span>微名片</span>
                  </div>
                  <div className="one"></div>
                  <div className="two"></div>
                  <div className="three"></div>
                </div>
              </div>
            </div>
						<div className="theme6_copyright"><a href="tel:010-58678723">绿石科技研发</a></div>
            <Share title={"律师微网站"} desc={"律师专注于律师事务所运营管理，律师机构战略规划，法律行业发展研究与实践"} 
            imgUrl={global.img+"wzd20151221145959.png"} target="index003"/>
					</div>
          <Message/>
				</div>
			)
	}
})

module.exports = Index007;
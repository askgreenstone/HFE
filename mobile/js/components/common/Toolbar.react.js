var React = require('react');
var CommonMixin = require('../Mixin');

var Toolbar = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      display:''
    };
  },
	hideToolbar: function(e){
   //  var currentTarget = e.target;
  	// console.log(currentTarget);
    // e.target.stopPropagation();
    $('.toolbar_shadow ul').animate({
      bottom: -$('.toolbar_shadow ul').height()},
      300, function() {
        $('.toolbar_shadow').hide();
        $('body').css({'overflow':'auto'});
    });
	},
  join: function(e){
    e.stopPropagation();
    alert('个人微网站可以连接到您所在的组织机构或合作单位网络，彰显实力和集群效应。详询 +86 10 5867 8723');
  },
  wxpublic: function(e){
    e.stopPropagation();
    alert('微网站可以嵌入微信公众号，让您运营自己的品牌，与客户实时互动、在线收费和提供服务。这需要您提供或申请微信公众号，详询 +86 10 5867 8723');
  },
  gotoWbms: function(which){
    var sess = this.getUrlParams('sess');
    if(!sess) return;
    if(which == 'logout'){
      sessionStorage.removeItem('userSession');
      window.location.href = global.url+'/coop/wbms/index.html';
    }else if(which == 'reset'){
      window.location.href = global.url+'/coop/wbms/view/template.html?session='+sess;
    }
  },
  componentDidMount: function(){
    var sess = this.getUrlParams('sess');
    $('.container,.theme3_main,.theme4_main,.theme5_main,.theme6_main,.theme7_main,.theme8_main,.theme9_main,.theme012_container,.theme013_container,.theme015_container,.theme016_container,.index017_content,.theme018_container')
    .click(function(event) {
      $(this).siblings('.toolbar_shadow').show();
      $('.toolbar_shadow ul').animate({
        bottom: 0},
        300, function() {
          $('body').css({'overflow':'hidden'});
      });
    });
    $(".themeScan_Iframe").click(function(){
      var confirm = window.confirm('保存并继续？点“取消”返回修改！');
      if(confirm){
        window.location.href =  global.url+'/coop/wbms/view/card.html?session='+sess;
      }else{
        window.location.href =  global.url+'/coop/wbms/view/themebg.html?session='+sess;
      }
    })
  },
	componentWillMount:function(){
    var origin = this.getUrlParams('origin');
    if(origin && origin == 'wbms') {
      this.setState({
        display:'wbms'
      })
    }else if(origin && origin == 'scan'){
      this.setState({
        display:'scan'
      })
    }
  }, 
  render: function() {
    if(this.state.display == 'wbms'){
      return (
        <div className="toolbar_shadow" onClick={this.hideToolbar}>
          <ul>
            <li className="active" onClick={this.join}>
              <img src="image/toolbar/join.png" width="30" height="28"/>
              <div>加入组织</div>
            </li>
            <li onClick={this.wxpublic}>
              <img src="image/toolbar/wxpublic.png" width="30" height="28"/>
              <div>微信公众号</div>
            </li>
            <li onClick={this.gotoWbms.bind(this,'reset')}>
              <img src="image/toolbar/reset.png" width="30" height="28"/>
              <div>重新定制</div>
            </li>
            <li onClick={this.gotoWbms.bind(this,'logout')}>
              <img src="image/toolbar/logout.png" width="30" height="28"/>
              <div>退出登录</div>
            </li>
          </ul>
        </div>
      );
    }else if(this.state.display == 'scan'){
      return (
        <div className="themeScan_Iframe">
          
        </div>
      );
    }else{
      return (
        <div></div>
      )
    }
  }     
});

module.exports = Toolbar;


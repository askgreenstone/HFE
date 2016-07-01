var React = require('react');
var CommonMixin = require('../Mixin');

var Shade = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {}
  },
  hideShadebox: function(e){
   //  var currentTarget = e.target;
    // console.log(currentTarget);
    // e.target.stopPropagation();
    
    $('.shade_box').hide();
  },
  gotoDownloadApp: function(){
    if(this.isWechat()) {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.greenstone.exp';
    } else if(this.isAndroid){
        window.location.href = 'http://cdn.askgreenstone.com/client/android.exp.apk';
    } else if(this.isIOS){
        window.location.href = 'https://itunes.apple.com/us/app/lu-shi-zhuan-jia-ban/id976040724';
    }
  },
  // 检测wechat客户端
  isWechat: function() {  
    var ua = navigator.userAgent.toLowerCase();
    return /micromessenger/i.test(ua) || typeof navigator.wxuserAgent !== 'undefined';
  },
  componentDidMount: function(){
    $('.container,.theme3_main,.theme4_main,.theme5_main,.theme6_main,.theme7_main,.theme8_main,.theme9_main,.theme012_container,.theme013_container,.theme015_container,.theme016_container,.index017_content,.theme018_container,.theme019_container')
    .click(function(event) {
      $(this).siblings('.shade_box').show();
    });
  },
	componentWillMount:function(){
    
  }, 
  render: function() {
      return (
        <div className="shade_box" onClick={this.hideShadebox}>
            <div className="shade_btn" onClick={this.gotoDownloadApp}>
              <img src="../image/shadebtn.png"/>
            </div>
        </div> 
        
      );
  } 
});

module.exports = Shade;


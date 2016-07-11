// 暂时取消过期状态（乔凡2016年7月11日）
// 检查用户过期代码如下：
// if(this.props.display){
//   return (
//     <div className="transparent_shadow" onClick={this.showMessage}>
//       <div className="tip">
//         <img src="image/warn.png" width="35" height="35"/>
//         <span>{this.props.context}</span>
//       </div>
//     </div>
//   );
// }else{
//   return (
//     <div></div>
//   )
// }

var React = require('react');
var Shadow = React.createClass({
	showMessage: function(){
  	$('.transparent_shadow .tip').show();
    var that=$(this);
    that.data('rt',(new Date).getTime());
    setTimeout(function(){
      var d=(new Date).getTime(); 
      if(d-that.data('rt')>1000) 
        $('.transparent_shadow .tip').hide();
    },2000);
	},
	componentWillMount:function(){
    $('.transparent_shadow').height(document.body.scrollHeight);
  }, 
  render: function() {
    return (
      <div></div>
    )
  }     
});

module.exports = Shadow;


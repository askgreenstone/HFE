var React = require('react');
// <Password display="true"/>
var Password = React.createClass({
	showMessage: function(){
  	// $('.transparent_shadow .tip').show();
   //  var that=$(this);
   //  that.data('rt',(new Date).getTime());
   //  setTimeout(function(){
   //    var d=(new Date).getTime(); 
   //    if(d-that.data('rt')>1000) 
   //      $('.transparent_shadow .tip').hide();
   //  },2000);
	},
	componentWillMount:function(){
    // $('.transparent_shadow').height(document.body.scrollHeight);
  }, 
  render: function() {
    if(this.props.display){
      return (
        <div className="password_shadow" onClick={this.showMessage}>
          <div className="password">
            <i>+</i>
            <h1>法律文集</h1>
            <small>-----您正在访问加密文档，请输入密码-----</small>
            <div className="inputItems"> 
              <input type="tel" placeholder="" maxLength=""/>
              <input type="tel" placeholder="" maxLength=""/>
              <input type="tel" placeholder="" maxLength=""/>
              <input type="tel" placeholder="" maxLength=""/>
              <input type="tel" placeholder="" maxLength=""/> 
            </div> 
          </div>
        </div>
      );
    }else{
      return (
        <div></div>
      )
    }
  }     
});

module.exports = Password;


var React = require('react');
var CommonMixin = require('../Mixin');
// <Password display="true"/>

var Password = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      title:''
    };
  },
  hideMessage: function(){
    $('.password_shadow').parent('#limit_password_box').hide();
  },
  submitStr: function(){
    var userInput = $('.inputItems input').val(),
        target = $('.password_shadow').parent('#limit_password_box'),
        utitle = $(target).attr('title'),
        uid = $(target).attr('name'),
        utype = $(target).attr('type'),
        uvalue = $(target).attr('value');
    if(!utitle || !uvalue) return;
    this.setState({'title':utitle});
    //ownUri 没有的话，取测试数据
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }

    console.log(userInput);
    if(userInput.length==5){
      // $('.inputItems input').blur();
      // window.location.href = 'https://www.baidu.com';
      if(userInput == uvalue){
        $('.password .error').hide();
        window.location.href = '#'+utype+'?ownUri='+ownUri+'&ntid='+uid;
      }else{
        $('.password .error').show();
        setTimeout(function(){
          $('.inputItems input').val('');
          $('.password .error').hide();
        },800);
      }
    }
  },
  componentDidMount:function(){
    $('body').css({'overflow':'hidden'});
  }, 
	componentWillMount:function(){
    // $('.transparent_shadow').height(document.body.scrollHeight);
  }, 
  render: function() {
    var boxTitle = this.state.title?this.state.title:'加密文档';
    if(this.props.display){
      return (
        <div className="password_shadow">
          <div className="password">
            <i onClick={this.hideMessage}>+</i>
            <h1>{boxTitle}</h1>
            <small>-----您正在访问加密文档，请输入密码-----</small>
            <div className="inputItems"> 
              <input type="password" onChange={this.submitStr} maxLength="5"/>
              <div className="spanItems">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div> 
            <small className="error">访问密码错误！</small>
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


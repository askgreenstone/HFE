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
        uvalue = $(target).attr('value'),
        uuid = $(target).attr('alt');
    if(!utitle || !uvalue) return;
    this.setState({'title':utitle});
    //ownUri 没有的话，取测试数据
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    if(userInput.length==5){
      console.log(userInput);
      // $('.inputItems input').blur();
      // window.location.href = 'https://www.baidu.com';
      if(userInput == uvalue){
        // console.log('aa');
        sessionStorage.setItem('user_token_'+uid,uid);
        sessionStorage.setItem('user_token_'+uuid,uuid);
        $('.password .error').hide();
        // window.location.href = '#'+utype+'?ownUri='+ownUri+'&ntid='+uid;
        console.log(sessionStorage.getItem('user_token_'+uid));
        if(sessionStorage.getItem('user_token_'+uid)||sessionStorage.getItem('user_token_'+uuid)){
          // console.log(1);
          this.hideMessage();
          // window.location.href = '#'+utype+'?ownUri='+ownUri+'&ntid='+uid;
          // alert(uuid+'-'+uid);
          if(uuid){
            window.location.href = '#'+utype+'?ownUri='+ownUri+'&ntid='+uid+'&nid='+uuid+'&t='+new Date().getTime();
            // window.location.href = global.url +'/mobile/#/'+ utype+'?ownUri='+ownUri+'&ntid='+uid+'&nid='+uuid+'&t='+new Date().getTime();
            window.location.reload();
          }else{
            window.location.href = '#'+utype+'?ownUri='+ownUri+'&ntid='+uid;
            // window.location.href = global.url +'/mobile/#/'+ utype+'?ownUri='+ownUri+'&ntid='+uid;
            window.location.reload();
          }
        }
      }else{
        $('.password .error').show();
        setTimeout(function(){
          $('.inputItems input').val('');
          $('.password .error').hide();
        },800);
      }
    }
  },
  showMessage: function(){
    var target = $('.password_shadow').parent('#limit_password_box'),
        uid = $(target).attr('name');
        // console.log('user_token_'+uid);
        console.log('user_token_'+uid);
        // console.log(sessionStorage.getItem('user_token_'+uid));
    if(sessionStorage.getItem('user_token_'+uid)){
      $('.password_shadow').parent('#limit_password_box').show();
    }
  },
  componentDidMount:function(){
    // alert($('body').width());
    // alert($('body').height());
    $('body').css({'overflow':'hidden'});
    // this.showMessage();
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
            <small>-----请输入密码，<span style={{'color':'red'}}>该页面分享无效！</span>-----</small>
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


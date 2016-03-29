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
  clearMessage: function(){
    var target = $('.password_shadow').parent('#limit_password_box'),
        ntid = $(target).attr('name');
    console.log('ntid:'+ntid);
    $('.password_shadow').parent('#limit_password_box').hide();
    sessionStorage.removeItem('user_token_'+ntid);
    $('.inputItems input').val('');
  },
  hideMessage: function(){
    $('.password_shadow').parent('#limit_password_box').hide();
  },
  submitStr: function(){
    var userInput = $('.inputItems input').val(),
        target = $('.password_shadow').parent('#limit_password_box'),
        utitle = $(target).attr('title'),
        ntid = $(target).attr('name'),
        utype = $(target).attr('type'),
        uvalue = $(target).attr('value'),
        nid = $(target).attr('alt');
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
        sessionStorage.setItem('user_token_'+ntid,ntid);
        sessionStorage.setItem('user_token_'+nid,nid);
        $('.password .error').hide();
        // window.location.href = '#'+utype+'?ownUri='+ownUri+'&ntid='+ntid;
        console.log(sessionStorage.getItem('user_token_'+ntid));
        if(sessionStorage.getItem('user_token_'+ntid)||sessionStorage.getItem('user_token_'+nid)){
          // console.log(1);
          this.hideMessage();
          // window.location.href = '#'+utype+'?ownUri='+ownUri+'&ntid='+ntid;
          // alert(nid+'-'+ntid);
          if(nid){
            window.location.href = '#'+utype+'?ownUri='+ownUri+'&ntid='+ntid+'&nid='+nid+'&t='+new Date().getTime();
            // window.location.href = global.url +'/mobile/#/'+ utype+'?ownUri='+ownUri+'&ntid='+ntid+'&nid='+nid+'&t='+new Date().getTime();
            window.location.reload();
          }else{
            window.location.href = '#'+utype+'?ownUri='+ownUri+'&ntid='+ntid;
            // window.location.href = global.url +'/mobile/#/'+ utype+'?ownUri='+ownUri+'&ntid='+ntid;
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
        ntid = $(target).attr('name');
        // console.log('user_token_'+ntid);
        console.log('user_token_'+ntid);
        // console.log(sessionStorage.getItem('user_token_'+ntid));
    if(sessionStorage.getItem('user_token_'+ntid)){
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
            <i onClick={this.clearMessage}>+</i>
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


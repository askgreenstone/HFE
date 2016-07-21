var React = require('react');
var CommonMixin = require('../../Mixin');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

var TimeAxis = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {datas:[],Abstract:'',Title:'',Introduction:'',Img:''};
  },
  gotoLink: function(path){
    location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri');
  },
  getShareInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    $.ajax({
      type:'get',
      url: global.url+'/usr/GetMicWebShareInfo.do?ou='+ownUri+'&st=1',
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        // alert('ownUri:'+ownUri+'ntid:'+ntid);
        if(data.c == 1000){
          // console.log(data.sil[0].spu)
          if(data.sil.length>0){
            this.setState({
              Title:data.sil[0].sti,
              Introduction:data.sil[0].sd,
              Img:data.sil[0].spu
            });
          }else{
            this.setState({
              Title:'我的工作室',
              Introduction:'欢迎访问我的工作室！这里有我的职业介绍和成就',
              Img:'greenStoneicon300.png'
            });
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  goHome: function(){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
    }
    console.log(global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri);
    window.location.href = global.url + '/mobile/#/'+ this.state.indexTheme +'?ownUri=' + ownUri;
  },
  getIndexTheme: function(){
    var ownUri = this.getUrlParams('ownUri');
    $.ajax({
      type: 'GET',
      url: global.url+'/usr/QueryMicWebInfo.do?ownUri='+ownUri,
      success: function(data) {
          console.log(data);
          if(data.c == 1000){
            this.setState({
              indexTheme: data.url
            })
          }
      }.bind(this),
      error: function(data) {
          // console.log(data);
          alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    console.log(this.state.Abstract);
  },
  componentWillMount:function(){
    this.getShareInfo();
    this.getIndexTheme();
  }, 
  render: function() {
    var ShareTitile = this.state.Title;
    var ShareDesc = this.state.Introduction;
    var ShareImg = this.state.Img;
    
      return (
        <div className="htmleaf_container">
          <ul className="timeline_container">
            <li className="timeline">
              <div className="timeline_time">
                今天 18：20
              </div>
              <div className="timeline_content">
                <div className="timeline_img">
                  <img src="image/LatestNews/u16.jpg"/>
                </div>
                <div className="timeline_con">
                  <h2>我是标题</h2>
                  <p>我是内容我是内容我是内容我是内容我是内容</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      )
  }
});

module.exports = TimeAxis;
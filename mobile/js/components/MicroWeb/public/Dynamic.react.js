var React = require('react');
var CommonMixin = require('../../Mixin');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');

var Dynamic = React.createClass({
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
        <div className="dynamic_contaniner">
          <div className="dynamic_exp">
            <div className="dynamic_exp_top">
              <img className="dynamic_exp_img" src="image/LatestNews/u77.jpg" width="65" height="65"/>
              <p className="dynamic_exp_name">
                <span>张丹峰</span><br/>
                <span className="dynamic_exp_date">06-07</span>
              </p>
              <p className="dynamic_exp_nice">
                <span className="dynamic_exp_goog">15</span>
                <span className="dynamic_exp_com">10</span>
              </p>            
            </div>
            <div className="dynamic_exp_content">
              <div className="dynamic_exp_title">荣获年度最佳律师</div>
              <div className="dynamic_exp_word">非本人本尔康给比尔卡各个接口人供热接口二个可根据人</div>
              <div className="dynamic_exp_img">
                <img src="image/LatestNews/u16.jpg"/>
                <img src="image/LatestNews/u28.jpg"/>
                <img src="image/LatestNews/u77.jpg"/>
                <img src="image/LatestNews/u79.jpg"/>
                <img src="image/LatestNews/u81.jpg"/>
                <img src="image/LatestNews/u85.jpg"/>
                <img src="image/LatestNews/u16.jpg"/>
                <img src="image/LatestNews/u28.jpg"/>
                <img src="image/LatestNews/u81.jpg"/>
              </div>
            </div>
          </div>
        </div>
      )
  }
});

module.exports = Dynamic;
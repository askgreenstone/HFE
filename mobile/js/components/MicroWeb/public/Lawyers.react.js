var React = require('react');

var CommonMixin = require('../../Mixin');



var Lawyers = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      lawyerCount:'',
      showLawyerNumber:false,
      LawyersList: [],
      getMoreLawyer: false,
      pageNum: 0
    };
  },
  gotoSearch:function(){
    var key_word = $('#search_word').val();
    var ida = this.getUrlParams('ida');
    var st = this.getUrlParams('st');
    var ownUri = this.getUrlParams('ownUri');
    var elements = [];
    if(!key_word){
      alert('请输入关键字！')
    }else if(ownUri){
      window.location.href = '#SearchLawyers?key_word='+key_word+'&ida='+ida+'&st='+st+'&ownUri='+ownUri;
    }else{
      window.location.href = '#SearchLawyers?key_word='+key_word+'&ida='+ida+'&st='+st;
    }
  },
  getMoreLawyer: function(){
    this.getLawyerList(this.state.pageNum);
  },
  getLawyerList: function(page) {
    var ownUri = this.getUrlParams('ownUri');
    var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
    var url = ownUri?global.url+'/usr/QueryExpert.do?v=1.0.0&t=1&p='+page+'&c=10&ownUri='+ownUri+'&ida='+ida:global.url+'/usr/QueryExpert.do?v=1.0.0&t=1&p='+page+'&c=10&ida='+ida;
    var arrList = [];
    $.ajax({
      type:'get',
      url: url,
      success: function(data) {
        // alert(JSON.stringify(data));
        console.log(data);
        if(data.c == 1000){
          for(var i=0;i<data.s.length;i++){
            arrList.push(data.s[i]);
          }
          if(data.s.length<10){
            this.setState({
              getMoreLawyer: false,
              lawyerCount: data.rc,
              LawyersList:this.state.LawyersList.concat(arrList)
            })
          }else{
            this.setState({
              getMoreLawyer: true,
              lawyerCount: data.rc,
              pageNum: page+1,
              LawyersList:this.state.LawyersList.concat(arrList)
            })
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.showAlert('系统开了小差，请刷新页面');
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  gotoDetail: function(id){
    var temp = '';
    var appid = '';
    var ida = 0;  //乔凡：聊天跳转到个人工作室，ida固定为0
    var st = this.getUrlParams('st')?this.getUrlParams('st'):3;
    var str = window.location.href;
    if(str.indexOf('localhost')>-1 || str.indexOf('t-dist')>-1){
      temp = 't-web';
      appid = 'wx2858997bbc723661';
    }else{
      temp = 'web';
      appid = 'wx73c8b5057bb41735';
    }
    // 查询用户是否开通在线咨询功能
    // ocm字段  0表示关闭在线咨询功能，1表示开通在线咨询功能
    $.ajax({
      type: 'get',
      url: global.url+'/exp/Settings.do?ownUri=' + id,
      success: function(data) {
        if (data.c == 1000) {
          if(data.ocm == 1){
            location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri=http%3a%2f%2f'+temp+'.green-stone.cn%2fusr%2fWeiXinWebOAuthForChat.do&response_type=code&scope=snsapi_base&state=explistchat_e'+id+'_'+ida+'_0_'+st+'#wechat_redirect';
          }else{
            this.gotoIndex();
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    });
    console.log(temp+'....'+appid);
  },
  gotoIndex: function(){
    var ownUri = this.getUrlParams('ownUri');
    $.ajax({
      type: 'post',
      url: global.url+'/usr/ThirdHomePage.do?ownUri='+ownUri+'&ida=0',
      success: function(data) {
        console.log(data);
        if(data.c == 1999){
          alert('该律师还没有创建个人工作室');
        }else{
          window.location.href = global.url+'/usr/ThirdHomePage.do?ownUri='+ownUri+'&ida=0';
        }
      }.bind(this),
      error: function(data) {
          // console.log(data);
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  transferNumber: function(str){
    var num = '';
    if(!str){
      return 0;
      return;
    }
    num = str.replace(/"/g,"").replace(/\[/,"").replace(/\]/g,"");
    return num;
  },
  transferArr: function(str){
    var arr =[]; 
    var descArr = [];
    if(!str){
      descArr = ['公司企业','资本市场','证券期货'];
      return descArr.join(" ");
      return;
    }
    // arr = str.replace(/"/g,"").replace(/\[/,"").replace(/\]/g,"").split(",");
    arr = JSON.parse(str);
    // console.log(arr);
    var eilArr = ['','公司企业','资本市场','证券期货','知识产权','金融保险','合同债务','劳动人事','矿业能源','房地产','贸易','海事海商','涉外','财税','物权','婚姻家庭','侵权','诉讼仲裁','刑事','破产','新三板','反垄断','家族财富','交通事故','医疗','人格权','其他'];
    for(var i = 0; i<arr.length; i++){
      if(arr[i] == 99){
        descArr.push('其他')
      }else{
        descArr.push(eilArr[arr[i]])
      }
    }
    if(descArr.length == 0){
      descArr = ['公司企业','资本市场','证券期货']
    }
    var lawyerArr = descArr.slice(0,3);
    // console.log(descArr);
    return lawyerArr.join(" ");
  },
  componentDidMount: function(){
    var $body = $('body')
    document.title = '团队成员';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
  },
  componentWillMount: function(){
    // this.getLawyerCount(0,10);
    this.getLawyerList(0);
    var ownUri = this.getUrlParams('ownUri');
    if(ownUri){
      this.setState({
        showLawyerNumber: true
      })
    }else{
      this.setState({
        showLawyerNumber: false
      })
    }
  },
  render:function(){
    var areaArray = ['不限','北京','天津','上海','重庆','河北','河南','云南','辽宁','黑龙江','湖南','安徽','山东','新疆','江苏','浙江','江西','湖北','广西','甘肃','山西','内蒙古','陕西','吉林','福建','贵州','广东','青海','西藏','四川','宁夏','海南','台湾','香港','澳门','境外'];
    var navNodes = this.state.LawyersList.map(function(item,i){
      return(
        <li onClick={this.gotoDetail.bind(this,item.ei)} key={new Date().getTime()+i}>
          <div className="lawyer_list_logo">
            <img src={item.p?(global.img+item.p):(global.img+'batchdeptlogo20160811_W108_H108_S15.png')} width="45" height="45"/>
          </div>
          <div className="lawyer_list_msg">
            <div className="lawyer_list_name">
              <span className="lawyer_list_name_name" style={{display:item.en?'inline-block':'none'}}>{item.en}</span> 律师
            </div>
            <div className="lawyer_list_company" style={{display:item.c?'block':'none'}}>
              {item.c}
            </div>
            <div className="lawyer_list_desc">
              {this.transferArr(item.eil)}
            </div>
            <div className="lawyer_list_area" style={{display:this.transferNumber(item.pl)>0?'block':'none'}}>
              {areaArray[this.transferNumber(item.pl)]}
            </div>
            <div className="lawyer_list_year" style={{display:item.py?'block':'none'}}>
              执业{item.py}年
            </div>
          </div>
        </li>
       );
    }.bind(this));
    return(
        <div className="lawyer_list_box">
          <div className="searchBox">
            <div>
              <input type="text" placeholder="搜索律师、领域、地域、机构等" id="search_word" />
              <span style={{display:this.state.showLawyerNumber?'block':'none'}} className="searchBox_num">{this.state.lawyerCount} 名律师</span>  
              <span className="searchBox_btn" onClick={this.gotoSearch}></span>
            </div> 
          </div>
          <ul className="lawyer_list">
            {navNodes}
            <div className="timeline_more" style={{display:this.state.getMoreLawyer?'block':'none'}}>
              <span onClick={this.getMoreLawyer}>加载更多</span>
            </div>
          </ul>
        </div> 
    );
  }
});

module.exports = Lawyers;
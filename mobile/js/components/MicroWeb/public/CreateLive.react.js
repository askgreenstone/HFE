var React = require('react');

var CommonMixin = require('../../Mixin');
var cropper = require('../../common/Cropper.react')
Date.prototype.Format = function(fmt){ //author: meizz
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  // console.log(today.getTime());
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };  
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  


var CreateLive = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {
      FirstData:[],
      ListData:[],
      ProfessList:[],
      SpeakerList:[],
      ProfessShow: false,
      SpeakerShow: false,
      uploadShow: false,
      profession: '',
      speaker: '请选择',
      speakeruri: 399,
      headImg: 'header.jpg',
      CreateDate: new Date().Format('yyyy-MM-dd'),
      CreateTitle: '',
      CreateDesc: '',
      Speakerdesc: '',
      imgx: 0,
      imgy: 0,
      imgw: 0,
      imgh: 0
    };
  },
  getLiveInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    var ldid = this.getUrlParams('ldid');
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveInfo.do?do='+ownUri+'&ldid='+ldid,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          this.setState({
            CreateDate: new Date(data.ll[0].livetime).Format('yyyy-MM-dd'),
            CreateTitle: data.ll[0].lt,
            CreateDesc: data.ll[0].ld,
            speaker: data.ll[0].sn,
            headImg: data.ll[0].sp,
            Speakerdesc: data.ll[0].sd
          })
        }
      }.bind(this),
      error: function(data) {
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  changeDate:  function(e) {
    this.setState({
      CreateDate: e.target.value
    });
  },
  changeTitle:  function(e) {
    this.setState({
      CreateTitle: e.target.value
    });
  },
  changeDesc:  function(e) {
    this.setState({
      CreateDesc: e.target.value
    });
  },
  changeSpeakerDesc:  function(e) {
    this.setState({
      SpeakerDesc: e.target.value
    });
  },
  getLiveList: function(){
    var ownUri = this.getUrlParams('ownUri')||'e399';
    var lid = this.getUrlParams('lid')*1-1;
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetLiveListInfo.do?do='+ownUri,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          this.setState({
            FirstData: data.ll.length > 0?data.ll.slice(0,1):[],
            ListData: data.ll.length > 1?data.ll.slice(1):[],
            ProfessList: data.ll,
            profession: data.ll[0].ln
          })
        }
      }.bind(this),
      error: function(data) {
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  showProfess: function(){
    this.setState({
      ProfessShow: true
    })
  },
  getExpProfess: function(profession){
    this.setState({
      ProfessShow: false,
      profession: profession
    })
  },
  showSpeaker: function(){
    var ownUri = this.getUrlParams('ownUri')?(this.getUrlParams('ownUri').replace('e','')):'399';
    var session = this.getUrlParams('session');
    $.ajax({
      type: 'get',
      url: global.url+'/exp/GetDeptMembers.do?di='+ownUri+'&session='+session,
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          this.setState({
            SpeakerList: data.el,
            SpeakerShow: true
          })
        }
      }.bind(this),
      error: function(data) {
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
  },
  getSpeaker: function(speaker,speakeruri){
    this.setState({
      SpeakerShow: false,
      speaker: speaker,
      speakeruri: speakeruri
    })
  },
  uploadHead: function(){
    this.setState({
      uploadShow: true
    })
    var that = this;
    $('#themeCropper').cropper({
      aspectRatio: 1 / 1,
      viewMode: 1,
      crop: function(e) {
        that.setState({
          imgx : Math.round(e.x),
          imgy : Math.round(e.y),
          imgh : Math.round(e.height),
          imgw : Math.round(e.width)
        })
      }
    })
    var $choose_file = $('#uploadHead_choose'),
      URL = window.URL || window.webkitURL,
      blobURL;
    if (URL) {
        $choose_file.change(function() {
            var files = this.files,
                file;

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $('#themeCropper').one('built.cropper', function() {
                        URL.revokeObjectURL(blobURL); // Revoke when load complete
                    }).cropper('reset').cropper('replace', blobURL);
                } else {
                    alert('请选择图片文件！');
                }
            }
        });
    }
  },
  getUploadHead: function(imgw,imgh,imgx,imgy){
    var file = document.getElementById('uploadHead_choose').files[0],
        reader = new FileReader();
    var that = this;
    console.log(file);
    if(!file){
      console.log(this.state.headImg);
      that.clipSourceImg(this.state.headImg,imgw,imgh,imgx,imgy);
    }
    var that = this;
    reader.addEventListener('load', function() {
      var fd = new FormData();
      var session = that.getUrlParams('session');
      fd.append('ThirdUpload', file);
      fd.append('filename', file.name);
      fd.append('w', imgw);
      fd.append('h', imgh);
      fd.append('x', imgx);
      fd.append('y', imgy);
      console.log(fd);
      // Type : 1二维码  2  头像  3背景图  4 自动回复图文消息横版图片 5 微网站logo
      $.ajax({
          type: 'POST',
          url: global.url + '/exp/ThirdUpload.do?session=' + session+'&type=2',
          data: fd,
          processData: false,
          contentType: false,
          success: function(data) {
            console.log(data);
            if(data.c == 1000){
              that.setState({
                uploadShow: false,
                headImg: data.on
              })
            }
          },
          error: function(error) {
            alert('网络连接错误或服务器异常！');
          }
      })
    })
    if (file) {
        reader.readAsDataURL(file);
    }
  },
  clipSourceImg: function(name,imgw,imgh,imgx,imgy){
    var that = this;
    var session = that.getUrlParams('session');
    var obj = {
      in:name,
      it:3,
      w:imgw,
      h:imgh,
      x:imgx,
      y:imgy
    };
    $.ajax({
        type: 'POST',
        url: global.url + '/exp/UpdateMicWebImgs.do?session=' + session,
        data: JSON.stringify(obj),
        success: function(data) {
          console.log(data);
          that.setState({
            uploadShow: false,
            headImg: data.in
          })
        },
        error: function(error) {
          alert('网络连接错误或服务器异常！');
        }
    })
  },
  postLiveInfo: function(){
    var ownUri = this.getUrlParams('ownUri');
    var session = this.getUrlParams('session');
    var ida = this.getUrlParams('ida');
    var lid = this.getUrlParams('lid');
    var ldid = this.getUrlParams('ldid')||0;
    var livetime = $('.create_time input').val();
    var newTime = Date.parse(new Date(livetime));
    var livetitle = $('.create_title input').val();
    var livedesc = $('.create_intro textarea').val();
    var speakername = this.state.speaker;
    var speakeruri = this.state.speakeruri;
    var speakerpic = this.state.headImg;
    var speakerdesc = $('.create_per_intro textarea').val();
    if(!livetime){
      alert('请选择直播时间！');
      return;
    }
    if(!livetitle){
      alert('请输入课程标题！');
      return;
    }
    if(!livedesc){
      alert('请输入课程介绍！');
      return;
    }
    if(!speakername || speakername == '请选择'){
      alert('请选择主讲人！');
      return;
    }
    if(!speakerdesc){
      alert('请输入主讲人介绍！');
      return;
    }
    var data = {
      lid : lid,
      ldid : ldid,
      livetime : newTime,
      lt : livetitle,
      ld : livedesc,
      sn : speakername,
      su : speakeruri,
      sp : speakerpic,
      sd : speakerdesc
    }
    console.log(data);
    var session = this.getUrlParams('session');
    $.ajax({
      type: 'post',
      url: global.url+'/exp/AddLiveInfo.do?session='+session,
      data: JSON.stringify(data),
      success: function(data) {
        console.log(data);
        if(data.c == 1000){
          alert('提交成功！');
          window.location.href = '#/LiveDetail?ownUri='+ownUri+'&lid='+lid+'&ida='+ida+'&session='+session;
        }
      }.bind(this),
      error: function(data) {
        alert('系统开了小差，请刷新页面');
      }.bind(this)
    })
    
  },
  componentDidMount: function(){
    var $body = $('body')
    document.title = '创建直播';
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
      setTimeout(function() {
        $iframe.off('load').remove()
      }, 0)
    }).appendTo($body);
    
  },
  componentWillMount: function(){
    this.getLiveList();
    var ldid = this.getUrlParams('ldid');
    if(ldid){
      this.getLiveInfo();
    }
  },
  render:function(){
    var ProfessListNode = this.state.ProfessList.map(function(item,i){
      return(
        <li key={new Date().getTime()+i} onClick={this.getExpProfess.bind(this,item.ln)}>
          {item.ln}
        </li>
       );
    }.bind(this));
    var SpeakerListNode = this.state.SpeakerList.map(function(item,i){
      return(
        <li key={new Date().getTime()+i} onClick={this.getSpeaker.bind(this,item.n,item.ei)}>
          {item.n}
        </li>
       );
    }.bind(this));
    return(
        <div className="create_live">
          <div className="create_pro" >
            <span>系列</span><span onClick={this.showProfess}>{this.state.profession}</span>  
          </div> 
          <div className="create_pro create_time">
            <span>直播时间</span><span><input type="date" value={this.state.CreateDate} onChange={this.changeDate}/></span>
          </div> 
          <div className="create_title">
            <input type="text" placeholder="输入课程标题..." value={this.state.CreateTitle} onChange={this.changeTitle}/>
          </div> 
          <div className="create_intro">
            <textarea placeholder="课程介绍..." value={this.state.CreateDesc} onChange={this.changeDesc}></textarea>
          </div> 
          <div className="create_pro create_per">
            <span>主讲人</span><span onClick={this.showSpeaker} data-uri={this.state.speakeruri}>{this.state.speaker}</span>
          </div> 
          <div className="create_pro create_pic">
          <span>主讲人照片</span><span onClick={this.uploadHead}><img src={global.img+this.state.headImg}/></span>
          </div> 
          <div className="create_per_intro">
            <textarea placeholder="主讲人介绍..." value={this.state.Speakerdesc} onChange={this.changeSpeakerDesc}></textarea>
          </div> 
          <div className="create_sub" onClick={this.postLiveInfo}><span>提交</span></div>
          <ul className="create_profess" style={{display:this.state.ProfessShow?'block':false}}>{ProfessListNode}</ul>
          <ul className="create_speaker" style={{display:this.state.SpeakerShow?'block':false}}>{SpeakerListNode}</ul>
          <div className="upload_head" style={{display:this.state.uploadShow?'block':false}}>
            <div className="upload_btn"><span>选择头像</span><input id="uploadHead_choose" type="file"/></div>
            <div className="cropper_main">
              <img id="themeCropper" src={global.img+this.state.headImg} width="1" height="1"/>
            </div>
            <div className="upload_btn" onClick={this.getUploadHead.bind(this,this.state.imgw,this.state.imgh,this.state.imgx,this.state.imgy)}><span>完成</span></div>
          </div>
        </div> 
    );
  }
});

module.exports = CreateLive;
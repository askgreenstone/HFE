var React = require('react');
var CommonMixin = require('../Mixin');

var ImgList = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {};
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    console.log(this.props.imgWidth);
    console.log('basename='+this.props.basename);
  },
  componentWillMount: function(){
  },
  render: function() {
    var imgList = this.props.list.map(function(item,i){
      var imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_ZmVlZGxvZ28yMDE3MDExOF9XNDJfSDM4X1M0LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEwCg==,type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      if(this.props.showFlag){
        return (
          <img className='lazy' key={new Date().getTime()+i} width={this.props.imgWidth} basename={this.props.basename} src={global.img+item+imgStr} />
        )
      }else{
        return (
          <img className='lazy' key={new Date().getTime()+i} width={this.props.imgWidth} basename={this.props.basename} src={(i==0||i==1)?(global.img+item+imgStr):'image/loading.gif'} data-original={global.img+item+imgStr}/>
        )
      }
    }.bind(this));
    return (
      <div className="dynamic_exp_imgs">
        {imgList}
      </div>
    );
    
  },
});

module.exports = ImgList;





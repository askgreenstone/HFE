var React = require('react');
var CommonMixin = require('../Mixin');

var ImgList = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {};
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    // console.log(this.props.imgWidth);
    // console.log(this.props.waterMarkFlag);
    // console.log('basename='+this.props.basename);
  },
  componentWillMount: function(){
  },
  render: function() {
    var imgList = this.props.list.map(function(item,i){
      var imgStr = '';
      // console.log(this.props.waterMarkFlag);
      // 根据不同机构添加不同水印
      var onLineLaw = 'ZmVlZGxvZ28yMDE3MDExOF9XNDJfSDM4X1M0LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEwCg==';
      var deHeHeng = 'ZWNsYXNodWl5aW4yMDE3MDkyMF9XNTBfSDUwX1MyMC5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMA==';
      var timeRipper = 'c2hpamlhbmxpYW55aWxvZ28yMDE4MDExN19XODBfSDgwX1M1LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEw';
      if(this.props.waterMarkFlag === 'onLineLaw'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+onLineLaw+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }else if(this.props.waterMarkFlag === 'deHeHeng'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+deHeHeng+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }else if(this.props.waterMarkFlag === 'timeRipper'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+timeRipper+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }
      // console.log(imgStr);
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





var React = require('react');
var wx = require('weixin-js-sdk');
var CommonMixin = require('../Mixin');

var ImgList = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {};
  },
  gotoSingle: function(src){
    alert(src);
    console.log(this.props.list);
    var imgStr = ''
    var onLineLaw = 'ZmVlZGxvZ28yMDE3MDExOF9XNDJfSDM4X1M0LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEwCg==';
    var deHeHeng = 'ZWNsYXNodWl5aW4yMDE3MDkyMF9XNTBfSDUwX1MyMC5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMA==';
    var timeRipper = 'c2hpamlhbmxpYW55aWxvZ28yMDE4MDExN19XODBfSDgwX1M1LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEw';
    var jingYingShiDai = 'amluZ3lpbmdzaGlkYWkyMDE4MDIwOF9XMTA4X0gxMDhfUzUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLFBfMTA=';
    var gaoduansusong = 'ZmVlZGxvZ28yMDE3MDExOF9XNDJfSDM4X1M0LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEwCg==';
    var dachengxian = 'ZGFjaGVuZ3hpYW5zaHVpeWluMjAxODAzMjhfVzEwOF9IMTA4X1M4LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEw';
    var dachengjinrong = 'ZGFjaGVuZ2ppbnJvbmdzaHVpeWluMjAxODAzMjhfVzEwOF9IMTA4X1MxMi5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMA==';
    var jiuhefashang = 'aml1aGVmYXNoYW5nMjAxODA0MDNfVzEwOF9IMTA4X1MzNi5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMAo='
    if(this.props.waterMarkFlag === 'onLineLaw'){
      imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+onLineLaw+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
    }else if(this.props.waterMarkFlag === 'deHeHeng'){
      imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+deHeHeng+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
    }else if(this.props.waterMarkFlag === 'timeRipper'){
      imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+timeRipper+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
    }else if(this.props.waterMarkFlag === 'jingYingShiDai'){
      imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+jingYingShiDai+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
    }else if(this.props.waterMarkFlag === 'gaoduansusong'){
      imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+gaoduansusong+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
    }else if(this.props.waterMarkFlag === 'dachengxian'){
      imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+dachengxian+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
    }else if(this.props.waterMarkFlag === 'dachengjinrong'){
      imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+dachengjinrong+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
    }else if(this.props.waterMarkFlag === 'jiuhefashang'){
      imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+jiuhefashang+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
    }
    var photoLists = [];
    this.props.list.forEach(function(list,index){
      // console.log(list.pn);
      photoLists.push(global.img+list+imgStr);
    });
    console.log(photoLists);
    wx.ready(function() {
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: photoLists // 需要预览的图片http链接列表
        });
    });
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
    // 解决安卓手机微信里，点击图片会全屏放大的默认行为
    $(document).on('click', 'img', e => {
        e.preventDefault();
    })
    // console.log(this.props.imgWidth);
    // console.log(this.props.waterMarkFlag);
    // console.log('basename='+this.props.basename);
  },
  componentWillMount: function(){
  },
  render: function() {
    var that = this;
    var imgList = this.props.list.map(function(item,i){
      var imgStr = '';
      // 在线法律传1，德和衡传2，时间涟漪传3，菁英时代传4，高端诉讼传5，大成西安传6，大成金融传7
      // console.log(this.props.waterMarkFlag);
      // 根据不同机构添加不同水印
      // 需要加密的部分：feedlogo20170118_W42_H38_S4.png?x-oss-process=image/resize,P_10
      // 每次只需修改图片名称
      // base64转码后的文本需要做的改动：
      // 将结果中的加号”+”替换成中划线“-“;
      // 将结果中的斜杠”/”替换成下划线”_”;
      // 将结果中尾部的“=”号全部保留;
      var onLineLaw = 'ZmVlZGxvZ28yMDE3MDExOF9XNDJfSDM4X1M0LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEwCg==';
      var deHeHeng = 'ZWNsYXNodWl5aW4yMDE3MDkyMF9XNTBfSDUwX1MyMC5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMA==';
      var timeRipper = 'c2hpamlhbmxpYW55aWxvZ28yMDE4MDExN19XODBfSDgwX1M1LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEw';
      var jingYingShiDai = 'amluZ3lpbmdzaGlkYWkyMDE4MDIwOF9XMTA4X0gxMDhfUzUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLFBfMTA=';
      var gaoduansusong = 'ZmVlZGxvZ28yMDE3MDExOF9XNDJfSDM4X1M0LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEwCg==';
      var dachengxian = 'ZGFjaGVuZ3hpYW5zaHVpeWluMjAxODAzMjhfVzEwOF9IMTA4X1M4LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEw';
      var dachengjinrong = 'ZGFjaGVuZ2ppbnJvbmdzaHVpeWluMjAxODAzMjhfVzEwOF9IMTA4X1MxMi5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMA==';
      var jiuhefashang = 'aml1aGVmYXNoYW5nMjAxODA0MDNfVzEwOF9IMTA4X1MzNi5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMAo='
      if(this.props.waterMarkFlag === 'onLineLaw'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+onLineLaw+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }else if(this.props.waterMarkFlag === 'deHeHeng'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+deHeHeng+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }else if(this.props.waterMarkFlag === 'timeRipper'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+timeRipper+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }else if(this.props.waterMarkFlag === 'jingYingShiDai'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+jingYingShiDai+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }else if(this.props.waterMarkFlag === 'gaoduansusong'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+gaoduansusong+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }else if(this.props.waterMarkFlag === 'dachengxian'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+dachengxian+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }else if(this.props.waterMarkFlag === 'dachengjinrong'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+dachengjinrong+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }else if(this.props.waterMarkFlag === 'jiuhefashang'){
        imgStr = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_'+jiuhefashang+',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10'
      }


      // console.log(imgStr);
      if(this.props.showFlag){
        return (
          <img className='lazy' onClick={this.gotoSingle.bind(that,global.img+item+imgStr)} key={new Date().getTime()+i} width={this.props.imgWidth} basename={this.props.basename} src={global.img+item+imgStr} />
        )
      }else{
        return (
          <img className='lazy' onClick={this.gotoSingle.bind(that,global.img+item+imgStr)} key={new Date().getTime()+i} width={this.props.imgWidth} basename={this.props.basename} src={(i==0||i==1)?(global.img+item+imgStr):'image/loading.gif'} data-original={global.img+item+imgStr}/>
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





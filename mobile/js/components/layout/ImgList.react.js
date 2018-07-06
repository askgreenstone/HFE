var React = require('react');
var wx = require('weixin-js-sdk');
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
    var that = this;
    var imgList = this.props.list.map(function(item,i){
    var imgStr = '';

    // console.log(this.props.waterMarkFlag);
    // 在线法律传1，德和衡传2，时间涟漪传3，菁英时代传4，高端诉讼传5，大成西安传6，大成金融传7，九赫法商传8，大成太原传9
    // console.log(this.props.waterMarkFlag);
    // 根据不同机构添加不同水印
    // 需要加密的部分：feedlogo20170118_W42_H38_S4.png?x-oss-process=image/resize,P_10
    // 每次只需修改图片名称
    // base64转码后的文本需要做的改动：
    // 将结果中的加号”+”替换成中划线“-“;
    // 将结果中的斜杠”/”替换成下划线”_”;
    // 将结果中尾部的“=”号全部保留;


    // 在线法律
    var onLineLaw = 'ZmVlZGxvZ28yMDE3MDExOF9XNDJfSDM4X1M0LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEwCg==';
    // 德和衡
    var deHeHeng = 'ZWNsYXNodWl5aW4yMDE3MDkyMF9XNTBfSDUwX1MyMC5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMA==';
    // 时间涟漪
    var timeRipper = 'c2hpamlhbmxpYW55aWxvZ28yMDE4MDExN19XODBfSDgwX1M1LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEw';
    // 菁英时代
    var jingYingShiDai = 'amluZ3lpbmdzaGlkYWkyMDE4MDIwOF9XMTA4X0gxMDhfUzUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLFBfMTA=';
    // 高端诉讼
    var gaoduansusong = 'Z2FvZHVhbnN1c29uZzIwMTgwNTI4X1cxMDhfSDEwOF9TNC5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMA==';
    // 大成西安
    var dachengxian = 'ZGFjaGVuZ3hpYW5zaHVpeWluMjAxODAzMjhfVzEwOF9IMTA4X1M4LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEw';
    // 大成金融
    var dachengjinrong = 'ZGFjaGVuZ2ppbnJvbmdzaHVpeWluMjAxODAzMjhfVzEwOF9IMTA4X1MxMi5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMA==';
    // 九赫法商
    var jiuhefashang = 'aml1aGVmYXNoYW5nMjAxODA0MDNfVzEwOF9IMTA4X1MzNi5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMAo=';
    // 大成太原
    var dachengtaiyuan = 'ZGFjaGVuZ3RhaXl1YW4yMDE4MDUxNl9XMzJfSDMyX1M0LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEw';
    // 大成郑州
    var dachengzhengzhou = 'ZGFjaGVuZ3poZW5nemhvdTIwMTgwNTIyX1cxMDhfSDEwOF9TNC5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMA==';
    // 大成沈阳
    var dachengshenyang = 'ZGFjaGVuZ3NoZW55YW5nc2h1aXlpbjIwMTgwNjExX1cxMDhfSDEwOF9TNC5wbmc_eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsUF8xMA==';
    // 莱特法财税
    var laitefacaishui = 'bGF0c2h1aXlpbmcyMDE4MDYwNV9XMTA4X0gxMDhfUzEyLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEw';
    // 河南律师之家
    var henanlvshizhijia = 'aGVuYW5sdnNoaXpoaWppYTIwMTgwNzA2X1cxMDhfSDEwOF9TMTIucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLFBfMTAK';


    // 图片路径前半段
    var imgStrBefore = '?x-oss-process=image/resize,w_'+this.props.imgWidth*2+'/auto-orient,1/quality,q_90/format,jpg/watermark,image_';
    // 图片路径后半段
    var imgStrAfter = ',type_d3F5LXplbmhlaQ,size_20,text_'+this.props.basename+',color_FFFFFF,shadow_0,order_0,align_1,interval_10,t_60,g_se,x_10,y_10';

    
    if(this.props.waterMarkFlag === 'onLineLaw'){
      imgStr = imgStrBefore + onLineLaw + imgStrAfter
    }else if(this.props.waterMarkFlag === 'deHeHeng'){
      imgStr = imgStrBefore + deHeHeng + imgStrAfter
    }else if(this.props.waterMarkFlag === 'timeRipper'){
      imgStr = imgStrBefore + timeRipper + imgStrAfter
    }else if(this.props.waterMarkFlag === 'jingYingShiDai'){
      imgStr = imgStrBefore + jingYingShiDai + imgStrAfter
    }else if(this.props.waterMarkFlag === 'gaoduansusong'){
      imgStr = imgStrBefore + gaoduansusong + imgStrAfter
    }else if(this.props.waterMarkFlag === 'dachengxian'){
      imgStr = imgStrBefore + dachengxian + imgStrAfter
    }else if(this.props.waterMarkFlag === 'dachengjinrong'){
      imgStr = imgStrBefore + dachengjinrong + imgStrAfter
    }else if(this.props.waterMarkFlag === 'jiuhefashang'){
      imgStr = imgStrBefore + jiuhefashang + imgStrAfter
    }else if(this.props.waterMarkFlag === 'dachengtaiyuan'){
      imgStr = imgStrBefore + dachengtaiyuan + imgStrAfter
    }else if(this.props.waterMarkFlag === 'dachengzhengzhou'){
      imgStr = imgStrBefore + dachengzhengzhou + imgStrAfter
    }else if(this.props.waterMarkFlag === 'dachengshenyang'){
      imgStr = imgStrBefore + dachengshenyang + imgStrAfter
    }else if(this.props.waterMarkFlag === 'laitefacaishui'){
      imgStr = imgStrBefore + laitefacaishui + imgStrAfter
    }


    console.log(imgStr);
    if(this.props.showFlag){
      return (
        <img className='lazy' key={new Date().getTime()+i} width={this.props.imgWidth} basename={this.props.basename} src={global.img+item+imgStr} data-original={global.img+item+imgStr} />
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





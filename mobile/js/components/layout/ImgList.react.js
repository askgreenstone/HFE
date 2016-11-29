var React = require('react');
var CommonMixin = require('../Mixin');

var ImgList = React.createClass({
  mixins:[CommonMixin],
  getInitialState: function(){
    return {};
  },
  componentDidMount: function(){
    $('body').css({'background':'#ebebeb'});
  },
  componentWillMount: function(){
  },
  render: function() {
    var imgList = this.props.list.map(function(item,i){
      if(this.props.showFlag){
        return (
          <img className='lazy' key={new Date().getTime()+i} src={global.img+item+'@400w'} />
        )
      }else{
        return (
          <img className='lazy' key={new Date().getTime()+i}  src={(i==0||i==1)?(global.img+item+'@400w'):'image/loading.gif'} data-original={global.img+item+'@400w'}/>
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
var React = require('react');
var Masonry = require('react-masonry-component')(React);

var masonryOptions = {
  // transitionDuration: 0
  percentPosition:true,
  gutter:5
};

var Waterfall = React.createClass({
  getInitialState:function(){
    return {src:'',describe:''};
  },
  hideShadow: function(e){
    // if(e.target.tagName.toLowerCase()!='img'){
    //   $('.single_show').hide();
    // }
    $('.single_show').hide();
    $('body,html').css({'overflow-y':'auto'});
  },
  gotoSingle: function(src,describe,e){
    $('.single_show').height(document.body.scrollHeight);
    this.setState({
      src:src,
      describe:describe
    });
    $('.single_show').show();
    $('body,html').css({'overflow-y':'hidden'});
  },
  render: function () {
      var screenWidth = document.body.scrollWidth/2-10;
      var that = this;
      var childElements = this.props.item.map(function(ele,i){
         return (
              <li onClick={that.gotoSingle.bind(that,ele.pn,ele.pd?ele.pd:'暂无描述')} key={new Date().getTime()+i} className="water-fall-list">
                  <img src={global.img+ele.pn} width={screenWidth}/>
                  <div>{ele.pd?(ele.pd.length>12?ele.pd.substring(0,12)+'...':ele.pd):'暂无描述'}</div>
              </li>
          );
      });
      return (
          <div>
            <Masonry
                className={'water-fall-ul'} 
                elementType={'ul'} 
                options={masonryOptions} 
                disableImagesLoaded={false} >
                {childElements}
            </Masonry>
            <div className="single_show" onClick={this.hideShadow}>
              <img src={global.img+this.state.src} width="100%" />
              <span className="single_describe">
                {this.state.describe}
              </span>
            </div>
          </div>
      );
  }
});

module.exports = Waterfall;
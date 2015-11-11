var React = require('react');
var Slider = require('react-slick');

// require('../../../css/lib/slick/slick.css');

var Carousel = React.createClass({
  render: function () {
    var settings = {
      dots: true,
      autoplay : true,
      initialSlide : 0,
      arrows : false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    var CarouselNodes = this.props.item.map(function(item,i){
      return(
        <div key={new Date()+i}><img src={item} width={this.props.width} height={this.props.height}/></div>
      );
    }.bind(this));
    return (
      <Slider {...settings}>
        {CarouselNodes}
      </Slider>
    );
  }
});

module.exports = Carousel;
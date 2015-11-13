var React = require('react');
var Masonry = require('react-masonry-component')(React);

var masonryOptions = {
    // transitionDuration: 0
    percentPosition:true,
    gutter:5
};

var Waterfall = React.createClass({
    render: function () {
        var screenWidth = window.screen.width/2-10;
        var childElements = this.props.item.map(function(ele,i){
           return (
                <li key={new Date()+i} className="water-fall-list">
                    <img src={ele.src} width={screenWidth}/>
                    <div>{ele.des?ele.des:'暂无描述'}</div>
                </li>
            );
        });

        return (
            <Masonry
                className={'water-fall-ul'} 
                elementType={'ul'} 
                options={masonryOptions} 
                disableImagesLoaded={false} >
                {childElements}
            </Masonry>
        );
    }
});

module.exports = Waterfall;
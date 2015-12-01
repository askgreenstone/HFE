var React = require('react');
var Masonry = require('react-masonry-component')(React);

var masonryOptions = {
    // transitionDuration: 0
    percentPosition:true,
    gutter:5
};

var Waterfall = React.createClass({
    gotoSingle: function(src){
        location.href = '#single?src='+src;
    },
    render: function () {
        var screenWidth = window.screen.width/2-10;
        var that = this;
        var childElements = this.props.item.map(function(ele,i){
           return (
                <li onClick={that.gotoSingle.bind(that,ele.pn)} key={new Date().getTime()+i} className="water-fall-list">
                    <img src={'http://transfer.green-stone.cn/'+ele.pn} width={screenWidth}/>
                    <div>{ele.pd?ele.pd:'暂无描述'}</div>
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
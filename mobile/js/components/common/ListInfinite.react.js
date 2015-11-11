var React = require('react');
var Infinite = require('react-infinite');
var Loader = require('./Loader.react');

var ListItem = React.createClass({
    render: function() {
        return <div className="infinite-list-item">
        List Item {this.props.num}
        </div>;
    }
});

var ListInfinite = React.createClass({
    getInitialState: function() {
        return {
            elements: this.buildElements(0, 20),
            isInfiniteLoading: false
        }
    },

    buildElements: function(start, end) {
        var elements = [];
        for (var i = start; i < end; i++) {
            elements.push(<ListItem key={i} num={i}/>)
        }
        return elements;
    },
    handleInfiniteLoad: function() {
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        setTimeout(function() {
            var elemLength = that.state.elements.length,
                newElements = that.buildElements(elemLength, elemLength + 20);
            that.setState({
                isInfiniteLoading: false,
                elements: that.state.elements.concat(newElements)
            });
        }, 500);
    },

    elementInfiniteLoad: function() {
        return <Loader flag={false}/>
    },

    render: function() {
        return <Infinite elementHeight={this.props.element}
                         containerHeight={this.props.container}
                         useWindowAsScrollContainer={this.props.isWindow}
                         infiniteLoadBeginEdgeOffset={this.props.offset}
                         onInfiniteLoad={this.handleInfiniteLoad}
                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
                         isInfiniteLoading={this.state.isInfiniteLoading}
                         >
            {this.state.elements}
        </Infinite>;
    }
});

module.exports = ListInfinite;

var React = require('react');
var CommonMixin = require('../../Mixin');

var LatestNews = React.createClass({
	mixins:[CommonMixin],
  render: function() {
    return (
    	<div className="LatestNews">
    		<div className="newsBox">
    			<div className="latestNewsBox">
    				<span className="newsTitle">{this.props.newsTitle}</span>
    				<span className="newsContent">{this.props.newsContent}</span>
    			</div>		
    		</div>
    		
    	</div>
    );
  }
});

module.exports = LatestNews;



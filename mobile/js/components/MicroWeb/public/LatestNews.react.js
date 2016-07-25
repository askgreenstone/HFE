var React = require('react');
var CommonMixin = require('../../Mixin');

var LatestNews = React.createClass({
	mixins:[CommonMixin],
  gotoLink: function(path){
    var ownUri = this.getUrlParams('ownUri');
    if(!ownUri){
      ownUri = this.checkDevOrPro();
      console.log(ownUri);
    }
    location.href = '#'+path+'?ownUri='+ownUri;
  },
  render: function() {
    return (
    	<div className="LatestNews" onClick={this.gotoLink.bind(this,'TimeAxis')}>
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



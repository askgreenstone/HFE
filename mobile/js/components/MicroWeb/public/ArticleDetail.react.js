var React = require('react');
var ArticleDetail = React.createClass({
	componentDidMount: function(){
    $('body').css('backgroundColor','#fff');
  },
  render: function() {
    return (
    	<div>
    		<div className="article_detail">
	    		<h3>文章标题</h3>
	    	</div>
    		<div className="ad_format">中央扶贫开发工作会议11月27日至28日在北京召开。中共中央总书记、国家主席、
    		中央军委主席习近平出席会议并发表重要讲话。他强调，消除贫困、改善民生、逐步实现共同富裕，
    		是社会主义的本质要求，是我们党的重要使命。全面建成小康社会，是我们对全国人民的庄严承诺。
    		脱贫攻坚战的冲锋号已经吹响。我们要立下愚公移山志，咬定目标、苦干实干，坚决打赢脱贫攻坚战，
    		确保到2020年所有贫困地区和贫困人口一道迈入全面小康社会。</div>
    	</div>
    );
  },
});

module.exports = ArticleDetail;
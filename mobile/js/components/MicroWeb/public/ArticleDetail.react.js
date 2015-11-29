var React = require('react');
var ArticleDetail = React.createClass({
	componentDidMount: function(){
    $('body').css('backgroundColor','#fff');
  },
  render: function() {
    return (
    	<div>
    		<div className="article_detail">
	    		<h3>律师介绍</h3>
	    	</div>
    		<div className="ad_format">
    		<img src="image/photo.jpg" width="100%" height="100%"/>
    		王杰律师执业二十余年来，王律师及其工作团队为重要的金融和实业企业担任顾问，在公司法律事务、PE/VC投融资、IPO/上市、企业并购及其相关的合规、知识产权等法律领域提供法律服务，业务涵盖国内及境外、非诉及司法。其早年的诉讼律师经验为其非诉顾问业务提供了坚实的基本功和方向性指导；其与美国等境外律师的长期密切合作能够使客户的跨境法律服务需求实现无缝对接。
			其典型业务包含：<br/> 
（1）投融资及资本市场：长年担任政府基金、私募股权基金、担保公司等投资基金及/或项目公司的法律顾问，涉及行业包括高科技、房地产、制造业、矿业冶炼、煤化工、精细化工、水泥、新型商业模式等，涉及业务包括境内外VC/PE、改制重组、IPO；<br/> 
（2）公司法律事务：担任初创、成长、重组、上市公司的常年法律顾问或独立董事，就其资本运营提供咨询，就常规公司事务提供风险和合规性咨询，就股东代表大会出具律师意见书并提交证券交易所备案，就监管层关注的问题出具尽职调查报告等；<br/> 
（3）企业改制、产权交易。常年担任西部产权交易所的法律顾问，精通国有企业股权、资产交易的国资委政策、流程、监管和实务操作；<br/> 
（4）清算重组：是法院指定的多起正常破产、政策性破产重组案件的主承办人，担任监管组或清算组主要负责人，破产企业包括投资公司，房地产，国有制造企业等；<br/> 
（5）银行及资产处置：在中国银行、中国工商银行、中国农业银行、中国建设银行、西安市商业银行、信用合作社、华融、东方等资产管理公司中长年代理案件，熟知金融机构债务重组、不良资产处置的司法或非司法解决途径；<br/> 
（6）房地产：长年担任房地产开发企业的法律顾问，熟知中国房地产开发运营的各阶段实务操作和项目融资模式；<br/> 
（7）诉讼和执行：代理过近千起经济纠纷诉讼和强制执行案件；在基层人民法院参与审理过民商事案件，作为仲裁员裁判和调解争议，熟练解析复杂诉讼案件的症结并运用诉讼策略实现完胜；<br/> 
（8） 知识产权及其他：熟悉企业知识产权战略保护的框架布局，专利、商标全球检索和注册，美国337调查，中国、美国反垄断、反倾销，中国外商投资、外汇管制规定、跨境投资避税安排、红筹结构、新浪模式等知识；对这些领域的服务机构在行业内的权威性有可靠了解，能够随时为客户推荐和调用相匹配的服务资源。</div>
    	</div>
    );
  },
});

module.exports = ArticleDetail;
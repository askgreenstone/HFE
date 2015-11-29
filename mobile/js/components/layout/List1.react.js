var React = require('react');

var List1 = React.createClass({
  gotoDetail: function(){
    location.href = '#articleDetail';
  },
  render: function() {
    var legend;
    if(this.props.legend){
      legend = <h3>最新文章</h3>;
    }
    return (
      <div>
        <ul className="article_list">
          {legend}
          <li onClick={this.gotoDetail}>
            <img src="image/gjdw.jpg" width="70" height="70"/>
            <span>国家电网</span>
            <p>国家电网二级子公司亚洲A国绿地投资项目</p>
          </li>
          <li onClick={this.gotoDetail}>
            <img src="image/Camecologo.png" width="70" height="70"/>
            <span>Cameclolgo 公司</span>
            <p>世界第一大铀材料生产商Cameco公司收购NUKEM能源公...</p>
          </li>
          <li onClick={this.gotoDetail}>
            <img src="image/xhl.jpg" width="70" height="70"/>
            <span>新华联</span>
            <p>新华联集团境外地产投资项目</p>
          </li>
        </ul>
      </div>
    );
  },
});

module.exports = List1;
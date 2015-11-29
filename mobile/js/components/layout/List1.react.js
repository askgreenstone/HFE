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
            <img src="image/1.png" width="70" height="70"/>
            <span>此处是标题</span>
            <p>当调用的时候。该子级组件可以是虚拟，也可以是自定义的复合组件...</p>
          </li>
          <li onClick={this.gotoDetail}>
            <img src="image/2.png" width="70" height="70"/>
            <span>此处是标题</span>
            <p>当调用的时候。该子级组件可以是虚拟，也可以是自定义的复合组件...</p>
          </li>
          <li onClick={this.gotoDetail}>
            <img src="image/3.png" width="70" height="70"/>
            <span>此处是标题</span>
            <p>当调用的时候。该子级组件可以是虚拟，也可以是自定义的复合组件...</p>
          </li>
          <li onClick={this.gotoDetail}>
            <img src="image/4.png" width="70" height="70"/>
            <span>此处是标题</span>
            <p>当调用的时候。该子级组件可以是虚拟，也可以是自定义的复合组件...</p>
          </li>
          <li onClick={this.gotoDetail}>
            <img src="image/5.png" width="70" height="70"/>
            <span>此处是标题</span>
            <p>当调用的时候。该子级组件可以是虚拟，也可以是自定义的复合组件...</p>
          </li>
        </ul>
      </div>
    );
  },
});

module.exports = List1;
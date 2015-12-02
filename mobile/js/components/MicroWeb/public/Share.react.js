var React = require('react');
var Share = require('../../common/Share.react');

var WXShare = React.createClass({
  render: function() {
    return (
        <Share title={"王杰律师微网站"} desc={"王杰律师专注于资本市场、基金、投融资、并购、公司法务、境外直接投资"} 
        imgUrl={"http://transfer.green-stone.cn/WXweb_wangjiepor.png"}/>
    );
  }
});

module.exports = WXShare;
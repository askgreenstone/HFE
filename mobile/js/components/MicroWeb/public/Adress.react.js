var React = require('react');
var Location = require('../../common/Location.react');

var Adress = React.createClass({
  render: function() {
    return (
        <Location current={"北京市朝阳区时间国际4号楼"} target={"北京市昌平区天通苑西三区"} region={"北京市"}/>
    );
  },
});

module.exports = Adress;
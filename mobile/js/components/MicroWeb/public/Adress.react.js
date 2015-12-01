var React = require('react');
var Location = require('../../common/Location.react');

var Adress = React.createClass({
  render: function() {
    return (
        <Location current={""} target={"北京市朝阳区时间国际4号楼"} region={"北京市"}/>
    );
  },
});

module.exports = Adress;
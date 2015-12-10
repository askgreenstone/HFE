var React = require('react');
var Location = require('../../common/Location.react');

var Adress = React.createClass({
  render: function() {
    return (
        <Location currentpath={"北京市朝阳区东大桥路9号侨福芳草地大厦B座"} target={"北京市朝阳区东大桥路9号侨福芳草地大厦B座"} region={"北京市"}/>
    );
  },
});

module.exports = Adress;
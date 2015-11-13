var React = require('react');
var Waterfall = require('../../common/Waterfall.react');

var Home = React.createClass({
  render: function() {
    var arr=[
      {src:'image/waterfall/a.png',des:'蓝天白云'},
      {src:'image/waterfall/b.png',des:'好看的花，好美啊'},
      {src:'image/waterfall/c.png',des:'石头山上不见石'},
      {src:'image/waterfall/d.png',des:'这是什么花呢'},
      {src:'image/waterfall/e.png',des:'图片都模糊了，坑！'},
      {src:'image/waterfall/f.png',des:''},
      {src:'image/waterfall/i.png',des:'什么东西'},
      {src:'image/waterfall/j.png',des:''},
      {src:'image/waterfall/k.png',des:'不写描述会怎样'},
      {src:'image/waterfall/l.png',des:''},
      {src:'image/waterfall/m.png',des:'还是不屑'},
      {src:'image/waterfall/n.png',des:'看不懂'},
      {src:'image/waterfall/o.png',des:'这是青蛙王子？'}
    ];
    return (
        <Waterfall item={arr} />
    );
  },
});

module.exports = Home;
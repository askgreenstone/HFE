'use strict';

import React from 'react';
import SwipeViews from 'react-swipe-views';
//load react-swipe-views css
require('../../../css/lib/react-swipe-views.min.css');

export default class App extends React.Component {
  render() {
    var TabNodes = this.props.item.map(function(item,i){
      return(
        <div key={new Date()+i} title={item.title}>{item.content}</div>
      );
    }.bind(this));
    return (
      <SwipeViews>
        {TabNodes}
      </SwipeViews>
    );
  }
}
// var React = require('react');
// var SwipeViews = require('react-swipe-views');

// var Tab = React.createClass({
//   render: function () {
//     return (
//       <SwipeViews>
//         <div title="Tab 1">
//           Page 1
//         </div>
//         <div title="Tab 2">
//           Page 2
//         </div>
//         <div title="Tab 3">
//           Page 3
//         </div>
//       </SwipeViews>
//     );
//   }
// });
// module.exports = Tab;
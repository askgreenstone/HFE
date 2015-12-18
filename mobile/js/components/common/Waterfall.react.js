var React = require('react');
var Masonry = require('react-masonry-component')(React);

var masonryOptions = {
  // transitionDuration: 0
  percentPosition:true,
  gutter:5
};

var Waterfall = React.createClass({
  getInitialState:function(){
    return {flag:true,src:"",describe:""}
  },

  gotoSingle: function(src,describe){
    var single = '<div class="single_show"></span><img src='+global.img+src+' width="100%" /><span class="single_describe">'+describe+'</span></div>';
      if($("div.single_show").length==0){

          $(single).appendTo($("body"));
          var windowH = $(window).height(),
              describeH = $("span.single_describe").height(),
              contentH = $("div.single_show img").height(),
              top = (windowH-contentH-describeH)/2,
              scrollT = $(window).scrollTop();
          
          $("div.single_show").css("height",scrollT+windowH+10+"px");
          $("div.single_show img").css("top",scrollT+top+"px");
          $("span.single_describe").css("top",scrollT+contentH+top+"px");
          
          $("body,html").css({"overflow":"hidden"})
          $("div.single_show").click(function(e){
            console.log(e.target.tagName)
              if(e.target.tagName.toLowerCase()!="img"){
                 $('div.single_show').hide();
                 $("body,html").css({"overflow":"auto"});
              };
              
          });

      }
      
      
  },
  render: function () {
      var screenWidth = window.screen.width/2-10;
      var that = this;
      var childElements = this.props.item.map(function(ele,i){
         return (
              <li onClick={that.gotoSingle.bind(that,ele.pn,ele.pd?ele.pd:'暂无描述')} key={new Date().getTime()+i} className="water-fall-list">
                  <img src={global.img+ele.pn} width={screenWidth}/>
                  <div>{ele.pd?ele.pd:'暂无描述'}</div>
              </li>
          );
      });

      return (
          <div>
          
          <Masonry
              className={'water-fall-ul'} 
              elementType={'ul'} 
              options={masonryOptions} 
              disableImagesLoaded={false} >
              {childElements}
          </Masonry>
          
          </div>
      );
  }
});

module.exports = Waterfall;
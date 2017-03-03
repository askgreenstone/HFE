/*!
 * Cropper v2.2.0
 * https://github.com/fengyuanchen/cropper
 *
 * Copyright (c) 2014-2015 Fengyuan Chen and contributors
 * Released under the MIT license
 *
 * Date: 2015-12-06T07:06:12.378Z
 */
!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t("object"==typeof exports?require("jquery"):jQuery)}(function(t){"use strict";function i(t){return"number"==typeof t&&!isNaN(t)}function e(t){return"undefined"==typeof t}function s(t,e){var s=[];return i(e)&&s.push(e),s.slice.apply(t,s)}function o(t,i){var e=s(arguments,2);return function(){return t.apply(i,e.concat(s(arguments)))}}function a(t){var i=t.match(/^(https?:)\/\/([^\:\/\?#]+):?(\d*)/i);return i&&(i[1]!==v.protocol||i[2]!==v.hostname||i[3]!==v.port)}function h(t){var i="timestamp="+(new Date).getTime();return t+(-1===t.indexOf("?")?"?":"&")+i}function n(t){return t?' crossOrigin="'+t+'"':""}function r(t,i){var e;return t.naturalWidth?i(t.naturalWidth,t.naturalHeight):(e=document.createElement("img"),e.onload=function(){i(this.width,this.height)},void(e.src=t.src))}function p(t){var e=[],s=t.rotate,o=t.scaleX,a=t.scaleY;return i(s)&&e.push("rotate("+s+"deg)"),i(o)&&i(a)&&e.push("scale("+o+","+a+")"),e.length?e.join(" "):"none"}function l(t,i){var e,s,o=dt(t.degree)%180,a=(o>90?180-o:o)*Math.PI/180,h=gt(a),n=ut(a),r=t.width,p=t.height,l=t.aspectRatio;return i?(e=r/(n+h/l),s=e/l):(e=r*n+p*h,s=r*h+p*n),{width:e,height:s}}function c(e,s){var o,a,h,n=t("<canvas>")[0],r=n.getContext("2d"),p=0,c=0,d=s.naturalWidth,g=s.naturalHeight,u=s.rotate,f=s.scaleX,m=s.scaleY,v=i(f)&&i(m)&&(1!==f||1!==m),w=i(u)&&0!==u,x=w||v,C=d,b=g;return v&&(o=d/2,a=g/2),w&&(h=l({width:d,height:g,degree:u}),C=h.width,b=h.height,o=h.width/2,a=h.height/2),n.width=C,n.height=b,x&&(p=-d/2,c=-g/2,r.save(),r.translate(o,a)),w&&r.rotate(u*Math.PI/180),v&&r.scale(f,m),r.drawImage(e,vt(p),vt(c),vt(d),vt(g)),x&&r.restore(),n}function d(t,i,e){var s,o="";for(s=i,e+=i;e>s;s++)o+=xt(t.getUint8(s));return o}function g(t){var i,e,s,o,a,h,n,r,p,l,c=new C(t),g=c.byteLength;if(255===c.getUint8(0)&&216===c.getUint8(1))for(p=2;g>p;){if(255===c.getUint8(p)&&225===c.getUint8(p+1)){n=p;break}p++}if(n&&(e=n+4,s=n+10,"Exif"===d(c,e,4)&&(h=c.getUint16(s),a=18761===h,(a||19789===h)&&42===c.getUint16(s+2,a)&&(o=c.getUint32(s+4,a),o>=8&&(r=s+o)))),r)for(g=c.getUint16(r,a),l=0;g>l;l++)if(p=r+12*l+2,274===c.getUint16(p,a)){p+=8,i=c.getUint16(p,a),c.setUint16(p,1,a);break}return i}function u(i,e){this.$element=t(i),this.options=t.extend({},u.DEFAULTS,t.isPlainObject(e)&&e),this.isLoaded=!1,this.isBuilt=!1,this.isCompleted=!1,this.isRotated=!1,this.isCropped=!1,this.isDisabled=!1,this.isReplaced=!1,this.isLimited=!1,this.isImg=!1,this.originalUrl="",this.canvas=null,this.cropBox=null,this.init()}var f=t(window),m=t(document),v=window.location,w=window.ArrayBuffer,x=window.Uint8Array,C=window.DataView,b=window.btoa,B="cropper",y="cropper-modal",D="cropper-hide",$="cropper-hidden",L="cropper-invisible",T="cropper-move",k="cropper-crop",M="cropper-disabled",W="cropper-bg",X="mousedown touchstart pointerdown MSPointerDown",Y="mousemove touchmove pointermove MSPointerMove",R="mouseup touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel",H="wheel mousewheel DOMMouseScroll",z="dblclick",O="load."+B,U="error."+B,E="resize."+B,P="build."+B,I="built."+B,F="cropstart."+B,S="cropmove."+B,j="cropend."+B,A="crop."+B,N="zoom."+B,_=/^(e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/,q="preview",Z="action",K="e",Q="w",V="s",G="n",J="se",tt="sw",it="ne",et="nw",st="all",ot="crop",at="move",ht="zoom",nt="none",rt=t.isFunction(t("<canvas>")[0].getContext),pt=Number,lt=Math.min,ct=Math.max,dt=Math.abs,gt=Math.sin,ut=Math.cos,ft=Math.sqrt,mt=Math.round,vt=Math.floor,wt={version:"2.2.0"},xt=String.fromCharCode;t.extend(wt,{init:function(){var t,i=this.$element;if(i.is("img")){if(this.isImg=!0,this.originalUrl=t=i.attr("src"),!t)return;t=i.prop("src")}else i.is("canvas")&&rt&&(t=i[0].toDataURL());this.load(t)},trigger:function(i,e){var s=t.Event(i,e);return this.$element.trigger(s),s},load:function(i){var e,s,o=this.options,a=this.$element;if(i&&(a.one(P,o.build),!this.trigger(P).isDefaultPrevented())){if(this.url=i,this.image={},!o.checkOrientation||!w)return this.clone();e=t.proxy(this.read,this),s=new XMLHttpRequest,s.onload=function(){e(this.response)},s.open("get",i),s.responseType="arraybuffer",s.send()}},read:function(i){var e,s,o,a=this.options,h=g(i),n=this.image,r="";if(h)switch(t.each(new x(i),function(t,i){r+=xt(i)}),this.url="data:image/jpeg;base64,"+b(r),h){case 2:s=-1;break;case 3:e=-180;break;case 4:o=-1;break;case 5:e=90,o=-1;break;case 6:e=90;break;case 7:e=90,s=-1;break;case 8:e=-90}a.rotatable&&(n.rotate=e),a.scalable&&(n.scaleX=s,n.scaleY=o),this.clone()},clone:function(){var i,e,s=this.options,o=this.$element,r=this.url,p="";s.checkCrossOrigin&&a(r)&&(p=o.prop("crossOrigin"),p||(p="anonymous",i=h(r))),this.crossOrigin=p,this.crossOriginUrl=i,this.$clone=e=t("<img"+n(p)+' src="'+(i||r)+'">'),this.isImg?o[0].complete?this.start():o.one(O,t.proxy(this.start,this)):e.one(O,t.proxy(this.start,this)).one(U,t.proxy(this.stop,this)).addClass(D).insertAfter(o)},start:function(){var i=this.$element,e=this.$clone;this.isImg||(e.off(U,this.stop),i=e),r(i[0],t.proxy(function(i,e){t.extend(this.image,{naturalWidth:i,naturalHeight:e,aspectRatio:i/e}),this.isLoaded=!0,this.build()},this))},stop:function(){this.$clone.remove(),this.$clone=null}}),t.extend(wt,{build:function(){var i,e,s,o=this.options,a=this.$element,h=this.$clone;this.isLoaded&&(this.isBuilt&&this.unbuild(),this.$container=a.parent(),this.$cropper=i=t(u.TEMPLATE),this.$canvas=i.find(".cropper-canvas").append(h),this.$dragBox=i.find(".cropper-drag-box"),this.$cropBox=e=i.find(".cropper-crop-box"),this.$viewBox=i.find(".cropper-view-box"),this.$face=s=e.find(".cropper-face"),a.addClass($).after(i),this.isImg||h.removeClass(D),this.initPreview(),this.bind(),o.aspectRatio=ct(0,o.aspectRatio)||NaN,o.viewMode=ct(0,lt(3,mt(o.viewMode)))||0,o.autoCrop?(this.isCropped=!0,o.modal&&this.$dragBox.addClass(y)):e.addClass($),o.guides||e.find(".cropper-dashed").addClass($),o.center||e.find(".cropper-center").addClass($),o.cropBoxMovable&&s.addClass(T).data(Z,st),o.highlight||s.addClass(L),o.background&&i.addClass(W),o.cropBoxResizable||e.find(".cropper-line, .cropper-point").addClass($),this.setDragMode(o.dragMode),this.render(),this.isBuilt=!0,this.setData(o.data),a.one(I,o.built),setTimeout(t.proxy(function(){this.trigger(I),this.isCompleted=!0},this),0))},unbuild:function(){this.isBuilt&&(this.isBuilt=!1,this.isCompleted=!1,this.initialImage=null,this.initialCanvas=null,this.initialCropBox=null,this.container=null,this.canvas=null,this.cropBox=null,this.unbind(),this.resetPreview(),this.$preview=null,this.$viewBox=null,this.$cropBox=null,this.$dragBox=null,this.$canvas=null,this.$container=null,this.$cropper.remove(),this.$cropper=null)}}),t.extend(wt,{render:function(){this.initContainer(),this.initCanvas(),this.initCropBox(),this.renderCanvas(),this.isCropped&&this.renderCropBox()},initContainer:function(){var t=this.options,i=this.$element,e=this.$container,s=this.$cropper;s.addClass($),i.removeClass($),s.css(this.container={width:ct(e.width(),pt(t.minContainerWidth)||200),height:ct(e.height(),pt(t.minContainerHeight)||100)}),i.addClass($),s.removeClass($)},initCanvas:function(){var i,e=this.options.viewMode,s=this.container,o=s.width,a=s.height,h=this.image,n=h.naturalWidth,r=h.naturalHeight,p=90===dt(h.rotate),l=p?r:n,c=p?n:r,d=l/c,g=o,u=a;a*d>o?3===e?g=a*d:u=o/d:3===e?u=o/d:g=a*d,i={naturalWidth:l,naturalHeight:c,aspectRatio:d,width:g,height:u},i.oldLeft=i.left=(o-g)/2,i.oldTop=i.top=(a-u)/2,this.canvas=i,this.isLimited=1===e||2===e,this.limitCanvas(!0,!0),this.initialImage=t.extend({},h),this.initialCanvas=t.extend({},i)},limitCanvas:function(t,i){var e,s,o,a,h=this.options,n=h.viewMode,r=this.container,p=r.width,l=r.height,c=this.canvas,d=c.aspectRatio,g=this.cropBox,u=this.isCropped&&g;t&&(e=pt(h.minCanvasWidth)||0,s=pt(h.minCanvasHeight)||0,n&&(n>1?(e=ct(e,p),s=ct(s,l),3===n&&(s*d>e?e=s*d:s=e/d)):e?e=ct(e,u?g.width:0):s?s=ct(s,u?g.height:0):u&&(e=g.width,s=g.height,s*d>e?e=s*d:s=e/d)),e&&s?s*d>e?s=e/d:e=s*d:e?s=e/d:s&&(e=s*d),c.minWidth=e,c.minHeight=s,c.maxWidth=1/0,c.maxHeight=1/0),i&&(n?(o=p-c.width,a=l-c.height,c.minLeft=lt(0,o),c.minTop=lt(0,a),c.maxLeft=ct(0,o),c.maxTop=ct(0,a),u&&this.isLimited&&(c.minLeft=lt(g.left,g.left+g.width-c.width),c.minTop=lt(g.top,g.top+g.height-c.height),c.maxLeft=g.left,c.maxTop=g.top,2===n&&(c.width>=p&&(c.minLeft=lt(0,o),c.maxLeft=ct(0,o)),c.height>=l&&(c.minTop=lt(0,a),c.maxTop=ct(0,a))))):(c.minLeft=-c.width,c.minTop=-c.height,c.maxLeft=p,c.maxTop=l))},renderCanvas:function(t){var i,e,s=this.canvas,o=this.image,a=o.rotate,h=o.naturalWidth,n=o.naturalHeight;this.isRotated&&(this.isRotated=!1,e=l({width:o.width,height:o.height,degree:a}),i=e.width/e.height,i!==s.aspectRatio&&(s.left-=(e.width-s.width)/2,s.top-=(e.height-s.height)/2,s.width=e.width,s.height=e.height,s.aspectRatio=i,s.naturalWidth=h,s.naturalHeight=n,a%180&&(e=l({width:h,height:n,degree:a}),s.naturalWidth=e.width,s.naturalHeight=e.height),this.limitCanvas(!0,!1))),(s.width>s.maxWidth||s.width<s.minWidth)&&(s.left=s.oldLeft),(s.height>s.maxHeight||s.height<s.minHeight)&&(s.top=s.oldTop),s.width=lt(ct(s.width,s.minWidth),s.maxWidth),s.height=lt(ct(s.height,s.minHeight),s.maxHeight),this.limitCanvas(!1,!0),s.oldLeft=s.left=lt(ct(s.left,s.minLeft),s.maxLeft),s.oldTop=s.top=lt(ct(s.top,s.minTop),s.maxTop),this.$canvas.css({width:s.width,height:s.height,left:s.left,top:s.top}),this.renderImage(),this.isCropped&&this.isLimited&&this.limitCropBox(!0,!0),t&&this.output()},renderImage:function(i){var e,s=this.canvas,o=this.image;o.rotate&&(e=l({width:s.width,height:s.height,degree:o.rotate,aspectRatio:o.aspectRatio},!0)),t.extend(o,e?{width:e.width,height:e.height,left:(s.width-e.width)/2,top:(s.height-e.height)/2}:{width:s.width,height:s.height,left:0,top:0}),this.$clone.css({width:o.width,height:o.height,marginLeft:o.left,marginTop:o.top,transform:p(o)}),i&&this.output()},initCropBox:function(){var i=this.options,e=this.canvas,s=i.aspectRatio,o=pt(i.autoCropArea)||.8,a={width:e.width,height:e.height};s&&(e.height*s>e.width?a.height=a.width/s:a.width=a.height*s),this.cropBox=a,this.limitCropBox(!0,!0),a.width=lt(ct(a.width,a.minWidth),a.maxWidth),a.height=lt(ct(a.height,a.minHeight),a.maxHeight),a.width=ct(a.minWidth,a.width*o),a.height=ct(a.minHeight,a.height*o),a.oldLeft=a.left=e.left+(e.width-a.width)/2,a.oldTop=a.top=e.top+(e.height-a.height)/2,this.initialCropBox=t.extend({},a)},limitCropBox:function(t,i){var e,s,o,a,h=this.options,n=h.aspectRatio,r=this.container,p=r.width,l=r.height,c=this.canvas,d=this.cropBox,g=this.isLimited;t&&(e=pt(h.minCropBoxWidth)||0,s=pt(h.minCropBoxHeight)||0,e=lt(e,p),s=lt(s,l),o=lt(p,g?c.width:p),a=lt(l,g?c.height:l),n&&(e&&s?s*n>e?s=e/n:e=s*n:e?s=e/n:s&&(e=s*n),a*n>o?a=o/n:o=a*n),d.minWidth=lt(e,o),d.minHeight=lt(s,a),d.maxWidth=o,d.maxHeight=a),i&&(g?(d.minLeft=ct(0,c.left),d.minTop=ct(0,c.top),d.maxLeft=lt(p,c.left+c.width)-d.width,d.maxTop=lt(l,c.top+c.height)-d.height):(d.minLeft=0,d.minTop=0,d.maxLeft=p-d.width,d.maxTop=l-d.height))},renderCropBox:function(){var t=this.options,i=this.container,e=i.width,s=i.height,o=this.cropBox;(o.width>o.maxWidth||o.width<o.minWidth)&&(o.left=o.oldLeft),(o.height>o.maxHeight||o.height<o.minHeight)&&(o.top=o.oldTop),o.width=lt(ct(o.width,o.minWidth),o.maxWidth),o.height=lt(ct(o.height,o.minHeight),o.maxHeight),this.limitCropBox(!1,!0),o.oldLeft=o.left=lt(ct(o.left,o.minLeft),o.maxLeft),o.oldTop=o.top=lt(ct(o.top,o.minTop),o.maxTop),t.movable&&t.cropBoxMovable&&this.$face.data(Z,o.width===e&&o.height===s?at:st),this.$cropBox.css({width:o.width,height:o.height,left:o.left,top:o.top}),this.isCropped&&this.isLimited&&this.limitCanvas(!0,!0),this.isDisabled||this.output()},output:function(){this.preview(),this.isCompleted?this.trigger(A,this.getData()):this.isBuilt||this.$element.one(I,t.proxy(function(){this.trigger(A,this.getData())},this))}}),t.extend(wt,{initPreview:function(){var i=n(this.crossOrigin),e=i?this.crossOriginUrl:this.url;this.$preview=t(this.options.preview),this.$viewBox.html("<img"+i+' src="'+e+'">'),this.$preview.each(function(){var s=t(this);s.data(q,{width:s.width(),height:s.height(),html:s.html()}),s.html("<img"+i+' src="'+e+'" style="display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;">')})},resetPreview:function(){this.$preview.each(function(){var i=t(this),e=i.data(q);i.css({width:e.width,height:e.height}).html(e.html).removeData(q)})},preview:function(){var i=this.image,e=this.canvas,s=this.cropBox,o=s.width,a=s.height,h=i.width,n=i.height,r=s.left-e.left-i.left,l=s.top-e.top-i.top;this.isCropped&&!this.isDisabled&&(this.$viewBox.find("img").css({width:h,height:n,marginLeft:-r,marginTop:-l,transform:p(i)}),this.$preview.each(function(){var e=t(this),s=e.data(q),c=s.width,d=s.height,g=c,u=d,f=1;o&&(f=c/o,u=a*f),a&&u>d&&(f=d/a,g=o*f,u=d),e.css({width:g,height:u}).find("img").css({width:h*f,height:n*f,marginLeft:-r*f,marginTop:-l*f,transform:p(i)})}))}}),t.extend(wt,{bind:function(){var i=this.options,e=this.$element,s=this.$cropper;t.isFunction(i.cropstart)&&e.on(F,i.cropstart),t.isFunction(i.cropmove)&&e.on(S,i.cropmove),t.isFunction(i.cropend)&&e.on(j,i.cropend),t.isFunction(i.crop)&&e.on(A,i.crop),t.isFunction(i.zoom)&&e.on(N,i.zoom),s.on(X,t.proxy(this.cropStart,this)),i.zoomable&&i.zoomOnWheel&&s.on(H,t.proxy(this.wheel,this)),i.toggleDragModeOnDblclick&&s.on(z,t.proxy(this.dblclick,this)),m.on(Y,this._cropMove=o(this.cropMove,this)).on(R,this._cropEnd=o(this.cropEnd,this)),i.responsive&&f.on(E,this._resize=o(this.resize,this))},unbind:function(){var i=this.options,e=this.$element,s=this.$cropper;t.isFunction(i.cropstart)&&e.off(F,i.cropstart),t.isFunction(i.cropmove)&&e.off(S,i.cropmove),t.isFunction(i.cropend)&&e.off(j,i.cropend),t.isFunction(i.crop)&&e.off(A,i.crop),t.isFunction(i.zoom)&&e.off(N,i.zoom),s.off(X,this.cropStart),i.zoomable&&i.zoomOnWheel&&s.off(H,this.wheel),i.toggleDragModeOnDblclick&&s.off(z,this.dblclick),m.off(Y,this._cropMove).off(R,this._cropEnd),i.responsive&&f.off(E,this._resize)}}),t.extend(wt,{resize:function(){var i,e,s,o=this.options.restore,a=this.$container,h=this.container;!this.isDisabled&&h&&(s=a.width()/h.width,(1!==s||a.height()!==h.height)&&(o&&(i=this.getCanvasData(),e=this.getCropBoxData()),this.render(),o&&(this.setCanvasData(t.each(i,function(t,e){i[t]=e*s})),this.setCropBoxData(t.each(e,function(t,i){e[t]=i*s})))))},dblclick:function(){this.isDisabled||(this.$dragBox.hasClass(k)?this.setDragMode(at):this.setDragMode(ot))},wheel:function(t){var i=t.originalEvent,e=i||t,s=pt(this.options.wheelZoomRatio)||.1,o=1;this.isDisabled||(t.preventDefault(),e.deltaY?o=e.deltaY>0?1:-1:e.wheelDelta?o=-e.wheelDelta/120:e.detail&&(o=e.detail>0?1:-1),this.zoom(-o*s,i))},cropStart:function(i){var e,s,o=this.options,a=i.originalEvent,h=a&&a.touches,n=i;if(!this.isDisabled){if(h){if(e=h.length,e>1){if(!o.zoomable||!o.zoomOnTouch||2!==e)return;n=h[1],this.startX2=n.pageX,this.startY2=n.pageY,s=ht}n=h[0]}if(s=s||t(n.target).data(Z),_.test(s)){if(this.trigger(F,{originalEvent:a,action:s}).isDefaultPrevented())return;i.preventDefault(),this.action=s,this.cropping=!1,this.startX=n.pageX||a&&a.pageX,this.startY=n.pageY||a&&a.pageY,s===ot&&(this.cropping=!0,this.$dragBox.addClass(y))}}},cropMove:function(t){var i,e=this.options,s=t.originalEvent,o=s&&s.touches,a=t,h=this.action;if(!this.isDisabled){if(o){if(i=o.length,i>1){if(!e.zoomable||!e.zoomOnTouch||2!==i)return;a=o[1],this.endX2=a.pageX,this.endY2=a.pageY}a=o[0]}if(h){if(this.trigger(S,{originalEvent:s,action:h}).isDefaultPrevented())return;t.preventDefault(),this.endX=a.pageX||s&&s.pageX,this.endY=a.pageY||s&&s.pageY,this.change(a.shiftKey,h===ht?s:null)}}},cropEnd:function(t){var i=t.originalEvent,e=this.action;this.isDisabled||e&&(t.preventDefault(),this.cropping&&(this.cropping=!1,this.$dragBox.toggleClass(y,this.isCropped&&this.options.modal)),this.action="",this.trigger(j,{originalEvent:i,action:e}))}}),t.extend(wt,{change:function(t,i){var e,s,o=this.options,a=o.aspectRatio,h=this.action,n=this.container,r=this.canvas,p=this.cropBox,l=p.width,c=p.height,d=p.left,g=p.top,u=d+l,f=g+c,m=0,v=0,w=n.width,x=n.height,C=!0;switch(!a&&t&&(a=l&&c?l/c:1),this.limited&&(m=p.minLeft,v=p.minTop,w=m+lt(n.width,r.width),x=v+lt(n.height,r.height)),s={x:this.endX-this.startX,y:this.endY-this.startY},a&&(s.X=s.y*a,s.Y=s.x/a),h){case st:d+=s.x,g+=s.y;break;case K:if(s.x>=0&&(u>=w||a&&(v>=g||f>=x))){C=!1;break}l+=s.x,a&&(c=l/a,g-=s.Y/2),0>l&&(h=Q,l=0);break;case G:if(s.y<=0&&(v>=g||a&&(m>=d||u>=w))){C=!1;break}c-=s.y,g+=s.y,a&&(l=c*a,d+=s.X/2),0>c&&(h=V,c=0);break;case Q:if(s.x<=0&&(m>=d||a&&(v>=g||f>=x))){C=!1;break}l-=s.x,d+=s.x,a&&(c=l/a,g+=s.Y/2),0>l&&(h=K,l=0);break;case V:if(s.y>=0&&(f>=x||a&&(m>=d||u>=w))){C=!1;break}c+=s.y,a&&(l=c*a,d-=s.X/2),0>c&&(h=G,c=0);break;case it:if(a){if(s.y<=0&&(v>=g||u>=w)){C=!1;break}c-=s.y,g+=s.y,l=c*a}else s.x>=0?w>u?l+=s.x:s.y<=0&&v>=g&&(C=!1):l+=s.x,s.y<=0?g>v&&(c-=s.y,g+=s.y):(c-=s.y,g+=s.y);0>l&&0>c?(h=tt,c=0,l=0):0>l?(h=et,l=0):0>c&&(h=J,c=0);break;case et:if(a){if(s.y<=0&&(v>=g||m>=d)){C=!1;break}c-=s.y,g+=s.y,l=c*a,d+=s.X}else s.x<=0?d>m?(l-=s.x,d+=s.x):s.y<=0&&v>=g&&(C=!1):(l-=s.x,d+=s.x),s.y<=0?g>v&&(c-=s.y,g+=s.y):(c-=s.y,g+=s.y);0>l&&0>c?(h=J,c=0,l=0):0>l?(h=it,l=0):0>c&&(h=tt,c=0);break;case tt:if(a){if(s.x<=0&&(m>=d||f>=x)){C=!1;break}l-=s.x,d+=s.x,c=l/a}else s.x<=0?d>m?(l-=s.x,d+=s.x):s.y>=0&&f>=x&&(C=!1):(l-=s.x,d+=s.x),s.y>=0?x>f&&(c+=s.y):c+=s.y;0>l&&0>c?(h=it,c=0,l=0):0>l?(h=J,l=0):0>c&&(h=et,c=0);break;case J:if(a){if(s.x>=0&&(u>=w||f>=x)){C=!1;break}l+=s.x,c=l/a}else s.x>=0?w>u?l+=s.x:s.y>=0&&f>=x&&(C=!1):l+=s.x,s.y>=0?x>f&&(c+=s.y):c+=s.y;0>l&&0>c?(h=et,c=0,l=0):0>l?(h=tt,l=0):0>c&&(h=it,c=0);break;case at:this.move(s.x,s.y),C=!1;break;case ht:this.zoom(function(t,i,e,s){var o=ft(t*t+i*i),a=ft(e*e+s*s);return(a-o)/o}(dt(this.startX-this.startX2),dt(this.startY-this.startY2),dt(this.endX-this.endX2),dt(this.endY-this.endY2)),i),this.startX2=this.endX2,this.startY2=this.endY2,C=!1;break;case ot:if(!s.x||!s.y){C=!1;break}e=this.$cropper.offset(),d=this.startX-e.left,g=this.startY-e.top,l=p.minWidth,c=p.minHeight,s.x>0?h=s.y>0?J:it:s.x<0&&(d-=l,h=s.y>0?tt:et),s.y<0&&(g-=c),this.isCropped||(this.$cropBox.removeClass($),this.isCropped=!0,this.limited&&this.limitCropBox(!0,!0))}C&&(p.width=l,p.height=c,p.left=d,p.top=g,this.action=h,this.renderCropBox()),this.startX=this.endX,this.startY=this.endY}}),t.extend(wt,{crop:function(){this.isBuilt&&!this.isDisabled&&(this.isCropped||(this.isCropped=!0,this.limitCropBox(!0,!0),this.options.modal&&this.$dragBox.addClass(y),this.$cropBox.removeClass($)),this.setCropBoxData(this.initialCropBox))},reset:function(){this.isBuilt&&!this.isDisabled&&(this.image=t.extend({},this.initialImage),this.canvas=t.extend({},this.initialCanvas),this.cropBox=t.extend({},this.initialCropBox),this.renderCanvas(),this.isCropped&&this.renderCropBox())},clear:function(){this.isCropped&&!this.isDisabled&&(t.extend(this.cropBox,{left:0,top:0,width:0,height:0}),this.isCropped=!1,this.renderCropBox(),this.limitCanvas(!0,!0),this.renderCanvas(),this.$dragBox.removeClass(y),this.$cropBox.addClass($))},replace:function(t){!this.isDisabled&&t&&(this.isImg&&(this.isReplaced=!0,this.$element.attr("src",t)),this.options.data=null,this.load(t))},enable:function(){this.isBuilt&&(this.isDisabled=!1,this.$cropper.removeClass(M))},disable:function(){this.isBuilt&&(this.isDisabled=!0,this.$cropper.addClass(M))},destroy:function(){var t=this.$element;this.isLoaded?(this.isImg&&this.isReplaced&&t.attr("src",this.originalUrl),this.unbuild(),t.removeClass($)):this.isImg?t.off(O,this.start):this.$clone&&this.$clone.remove(),t.removeData(B)},move:function(t,i){var s=this.canvas;this.moveTo(e(t)?t:s.left+pt(t),e(i)?i:s.top+pt(i))},moveTo:function(t,s){var o=this.canvas,a=!1;e(s)&&(s=t),t=pt(t),s=pt(s),this.isBuilt&&!this.isDisabled&&this.options.movable&&(i(t)&&(o.left=t,a=!0),i(s)&&(o.top=s,a=!0),a&&this.renderCanvas(!0))},zoom:function(t,i){var e=this.canvas;t=pt(t),t=0>t?1/(1-t):1+t,this.zoomTo(e.width*t/e.naturalWidth,i)},zoomTo:function(t,i){var e,s,o=this.options,a=this.canvas,h=a.width,n=a.height,r=a.naturalWidth,p=a.naturalHeight;if(t=pt(t),t>=0&&this.isBuilt&&!this.isDisabled&&o.zoomable){if(e=r*t,s=p*t,this.trigger(N,{originalEvent:i,oldRatio:h/r,ratio:e/r}).isDefaultPrevented())return;a.left-=(e-h)/2,a.top-=(s-n)/2,a.width=e,a.height=s,this.renderCanvas(!0)}},rotate:function(t){this.rotateTo((this.image.rotate||0)+pt(t))},rotateTo:function(t){t=pt(t),i(t)&&this.isBuilt&&!this.isDisabled&&this.options.rotatable&&(this.image.rotate=t%360,this.isRotated=!0,this.renderCanvas(!0))},scale:function(t,s){var o=this.image,a=!1;e(s)&&(s=t),t=pt(t),s=pt(s),this.isBuilt&&!this.isDisabled&&this.options.scalable&&(i(t)&&(o.scaleX=t,a=!0),i(s)&&(o.scaleY=s,a=!0),a&&this.renderImage(!0))},scaleX:function(t){var e=this.image.scaleY;this.scale(t,i(e)?e:1)},scaleY:function(t){var e=this.image.scaleX;this.scale(i(e)?e:1,t)},getData:function(i){var e,s,o=this.options,a=this.image,h=this.canvas,n=this.cropBox;return this.isBuilt&&this.isCropped?(s={x:n.left-h.left,y:n.top-h.top,width:n.width,height:n.height},e=a.width/a.naturalWidth,t.each(s,function(t,o){o/=e,s[t]=i?mt(o):o})):s={x:0,y:0,width:0,height:0},o.rotatable&&(s.rotate=a.rotate||0),o.scalable&&(s.scaleX=a.scaleX||1,s.scaleY=a.scaleY||1),s},setData:function(e){var s,o,a,h=this.options,n=this.image,r=this.canvas,p={};t.isFunction(e)&&(e=e.call(this.element)),this.isBuilt&&!this.isDisabled&&t.isPlainObject(e)&&(h.rotatable&&i(e.rotate)&&e.rotate!==n.rotate&&(n.rotate=e.rotate,this.isRotated=s=!0),h.scalable&&(i(e.scaleX)&&e.scaleX!==n.scaleX&&(n.scaleX=e.scaleX,o=!0),i(e.scaleY)&&e.scaleY!==n.scaleY&&(n.scaleY=e.scaleY,o=!0)),s?this.renderCanvas():o&&this.renderImage(),a=n.width/n.naturalWidth,i(e.x)&&(p.left=e.x*a+r.left),i(e.y)&&(p.top=e.y*a+r.top),i(e.width)&&(p.width=e.width*a),i(e.height)&&(p.height=e.height*a),this.setCropBoxData(p))},getContainerData:function(){return this.isBuilt?this.container:{}},getImageData:function(){return this.isLoaded?this.image:{}},getCanvasData:function(){var i=this.canvas,e={};return this.isBuilt&&t.each(["left","top","width","height","naturalWidth","naturalHeight"],function(t,s){e[s]=i[s]}),e},setCanvasData:function(e){var s=this.canvas,o=s.aspectRatio;t.isFunction(e)&&(e=e.call(this.$element)),this.isBuilt&&!this.isDisabled&&t.isPlainObject(e)&&(i(e.left)&&(s.left=e.left),i(e.top)&&(s.top=e.top),i(e.width)?(s.width=e.width,s.height=e.width/o):i(e.height)&&(s.height=e.height,s.width=e.height*o),this.renderCanvas(!0))},getCropBoxData:function(){var t,i=this.cropBox;return this.isBuilt&&this.isCropped&&(t={left:i.left,top:i.top,width:i.width,height:i.height}),t||{}},setCropBoxData:function(e){var s,o,a=this.cropBox,h=this.options.aspectRatio;t.isFunction(e)&&(e=e.call(this.$element)),this.isBuilt&&this.isCropped&&!this.isDisabled&&t.isPlainObject(e)&&(i(e.left)&&(a.left=e.left),i(e.top)&&(a.top=e.top),i(e.width)&&e.width!==a.width&&(s=!0,a.width=e.width),i(e.height)&&e.height!==a.height&&(o=!0,a.height=e.height),h&&(s?a.height=a.width/h:o&&(a.width=a.height*h)),this.renderCropBox())},getCroppedCanvas:function(i){var e,s,o,a,h,n,r,p,l,d,g;return this.isBuilt&&this.isCropped&&rt?(t.isPlainObject(i)||(i={}),g=this.getData(),e=g.width,s=g.height,p=e/s,t.isPlainObject(i)&&(h=i.width,n=i.height,h?(n=h/p,r=h/e):n&&(h=n*p,r=n/s)),o=mt(h||e),a=mt(n||s),l=t("<canvas>")[0],l.width=o,l.height=a,d=l.getContext("2d"),i.fillColor&&(d.fillStyle=i.fillColor,d.fillRect(0,0,o,a)),d.drawImage.apply(d,function(){var t,i,o,a,h,n,p=c(this.$clone[0],this.image),l=p.width,d=p.height,u=[p],f=g.x,m=g.y;return-e>=f||f>l?f=t=o=h=0:0>=f?(o=-f,f=0,t=h=lt(l,e+f)):l>=f&&(o=0,t=h=lt(e,l-f)),0>=t||-s>=m||m>d?m=i=a=n=0:0>=m?(a=-m,m=0,i=n=lt(d,s+m)):d>=m&&(a=0,i=n=lt(s,d-m)),u.push(vt(f),vt(m),vt(t),vt(i)),r&&(o*=r,a*=r,h*=r,n*=r),h>0&&n>0&&u.push(vt(o),vt(a),vt(h),vt(n)),u}.call(this)),l):void 0},setAspectRatio:function(t){var i=this.options;this.isDisabled||e(t)||(i.aspectRatio=ct(0,t)||NaN,this.isBuilt&&(this.initCropBox(),this.isCropped&&this.renderCropBox()))},setDragMode:function(t){var i,e,s=this.options;this.isLoaded&&!this.isDisabled&&(i=t===ot,e=s.movable&&t===at,t=i||e?t:nt,this.$dragBox.data(Z,t).toggleClass(k,i).toggleClass(T,e),s.cropBoxMovable||this.$face.data(Z,t).toggleClass(k,i).toggleClass(T,e))}}),t.extend(u.prototype,wt),u.DEFAULTS={viewMode:0,dragMode:"crop",aspectRatio:NaN,data:null,preview:"",responsive:!0,restore:!0,checkCrossOrigin:!0,checkOrientation:!0,modal:!0,guides:!0,center:!0,highlight:!0,background:!0,autoCrop:!0,autoCropArea:.8,movable:!0,rotatable:!0,scalable:!0,zoomable:!0,zoomOnTouch:!0,zoomOnWheel:!0,wheelZoomRatio:.1,cropBoxMovable:!0,cropBoxResizable:!0,toggleDragModeOnDblclick:!0,minCanvasWidth:0,minCanvasHeight:0,minCropBoxWidth:0,minCropBoxHeight:0,minContainerWidth:200,minContainerHeight:100,build:null,built:null,cropstart:null,cropmove:null,cropend:null,crop:null,zoom:null},u.setDefaults=function(i){t.extend(u.DEFAULTS,i)},u.TEMPLATE='<div class="cropper-container"><div class="cropper-wrap-box"><div class="cropper-canvas"></div></div><div class="cropper-drag-box"></div><div class="cropper-crop-box"><span class="cropper-view-box"></span><span class="cropper-dashed dashed-h"></span><span class="cropper-dashed dashed-v"></span><span class="cropper-center"></span><span class="cropper-face"></span><span class="cropper-line line-e" data-action="e"></span><span class="cropper-line line-n" data-action="n"></span><span class="cropper-line line-w" data-action="w"></span><span class="cropper-line line-s" data-action="s"></span><span class="cropper-point point-e" data-action="e"></span><span class="cropper-point point-n" data-action="n"></span><span class="cropper-point point-w" data-action="w"></span><span class="cropper-point point-s" data-action="s"></span><span class="cropper-point point-ne" data-action="ne"></span><span class="cropper-point point-nw" data-action="nw"></span><span class="cropper-point point-sw" data-action="sw"></span><span class="cropper-point point-se" data-action="se"></span></div></div>',u.other=t.fn.cropper,t.fn.cropper=function(i){var o,a=s(arguments,1);return this.each(function(){var e,s=t(this),h=s.data(B);if(!h){if(/destroy/.test(i))return;s.data(B,h=new u(this,i))}"string"==typeof i&&t.isFunction(e=h[i])&&(o=e.apply(h,a))}),e(o)?this:o},t.fn.cropper.Constructor=u,t.fn.cropper.setDefaults=u.setDefaults,t.fn.cropper.noConflict=function(){return t.fn.cropper=u.other,this}});
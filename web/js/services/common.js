'use strict';

define([], function() {

    var Common = function() {
      this.$get = function() {
            return this;
      };
      
      //获取url参数值
      this.getUrlParam = function(p) {
        var url = location.href; 
        var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
        var paraObj = {} ;
        for (var i=0,j=0; j=paraString[i]; i++){ 
          paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
        } 
        var returnValue = paraObj[p.toLowerCase()]; 
        if(typeof(returnValue)=="undefined"){ 
          return ""; 
        }else{ 
          return  returnValue;
        } 
      };

      //格式化图片比例如：'4-10'转化为0.4
      this.formatAr = function(str){
        // console.log(str);
        var w = str.split('-')[0];
        var h = str.split('-')[1];
        var ar = parseInt(w)/parseInt(h);
        return ar;
      }

    };
    var servicesApp = angular.module('CommonServices', []);

    //Must be a provider since it will be injected into module.config()    
    servicesApp.provider('Common', Common);
});

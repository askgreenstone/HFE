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

    };
    var servicesApp = angular.module('CommonServices', []);

    //Must be a provider since it will be injected into module.config()    
    servicesApp.provider('Common', Common);
});

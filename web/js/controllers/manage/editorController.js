'use strict';

define(['js/app/app'], function(app) {

    var injectParams = ['$location'];
    var EditorController = function($location) {

        var vm = this;
        vm.str = '';

        vm.showMsg = function() {
            var ue = UE.getEditor('editor');
            alert('aaa');
            var arr = [];
            arr.push("使用editor.getContent()方法可以获得编辑器的内容");
            arr.push("内容为：");
            arr.push(ue.getContent());
            alert(arr.join("\n"));
        };

        function init(){
          // vm.showMsg();
        }

        init();
    };

    EditorController.$inject = injectParams;

    app.register.controller('EditorController', EditorController);

});

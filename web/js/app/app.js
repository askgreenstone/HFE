'use strict';

define(['RouteResolver','Common'], function() {

    var app = angular.module('webApp', ['ngRoute','routeResolverServices','CommonServices']);
    
    //后台调用接口兼容
    if(window.location.href.indexOf('localhost')>-1){
        app.constant('GlobalUrl', 'http://t-dist.green-stone.cn');
    }else{
        app.constant('GlobalUrl', '');
    }
    //测试服务器和正式环境图片路径兼容
    if(window.location.href.indexOf('localhost')>-1 || window.location.href.indexOf('t-dist')>-1){
        app.constant('TransferUrl', 'http://t-transfer.green-stone.cn/');
    }else{
        app.constant('TransferUrl', 'http://transfer.green-stone.cn/');
    }

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
        '$compileProvider', '$filterProvider', '$provide', '$httpProvider',

        function($routeProvider, routeResolverProvider, $controllerProvider,
            $compileProvider, $filterProvider, $provide, $httpProvider) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers'); 
            app.register = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;

            $routeProvider
                .when('/docs', route.resolve('Docs', 'docs/','vm'))
                .when('/chat', route.resolve('Chat', 'chat/','vm'))
                .when('/circle', route.resolve('Circle', 'circle/','vm'))
                //Manage
                .when('/active', route.resolve('Active', 'manage/','vm'))
                .when('/actmode', route.resolve('Actmode', 'manage/','vm'))
                .when('/actexpired', route.resolve('Actexpired', 'manage/','vm'))
                .when('/manage', route.resolve('Manage', 'manage/','vm'))
                .when('/list', route.resolve('List', 'manage/','vm'))
                .when('/editor', route.resolve('Editor', 'manage/','vm'))
                .when('/add', route.resolve('Add', 'manage/','vm'))
                .when('/photo', route.resolve('Photo', 'manage/','vm'))
                .when('/single', route.resolve('Single', 'manage/','vm'))
                .when('/data', route.resolve('Data', 'manage/','vm'))
                .when('/preview', route.resolve('Preview', 'manage/','vm'))
                .when('/micro', route.resolve('Micro', 'manage/','vm'))
                .when('/micro1', route.resolve('Micro1', 'manage/','vm'))
                .when('/micro2', route.resolve('Micro2', 'manage/','vm'))
                .when('/step1', route.resolve('Step1', 'manage/','vm'))
                .when('/step2', route.resolve('Step2', 'manage/','vm'))
                .when('/step3', route.resolve('Step3', 'manage/','vm'))
                .when('/step4', route.resolve('Step4', 'manage/','vm'))
                .when('/step5', route.resolve('Step5', 'manage/','vm'))
                .when('/card', route.resolve('Card', 'manage/','vm'))
                .when('/card2', route.resolve('Card2', 'manage/','vm'))
                .when('/card3', route.resolve('Card3', 'manage/','vm'))
                .when('/wx', route.resolve('Wx', 'manage/','vm'))
                .when('/filelist', route.resolve('Filelist', 'manage/','vm'))
                .when('/reply1', route.resolve('Reply1', 'manage/','vm'))
                .when('/reply2', route.resolve('Reply2', 'manage/','vm'))
                .when('/uploadfile', route.resolve('Uploadfile', 'manage/','vm'))
                .when('/tools', route.resolve('Tools', 'manage/','vm'))
                .when('/tooliframe', route.resolve('Tooliframe', 'manage/','vm'))
                .when('/temp', route.resolve('Temp', 'manage/','vm'))
                .when('/videolist', route.resolve('Videolist', 'manage/','vm'))
                .when('/uploadvideo', route.resolve('Uploadvideo', 'manage/','vm'))
                .otherwise({
                    redirectTo: '/manage'
                });
        }
    ]);

    app.run(['$rootScope', '$location',
        function($rootScope, $location) {

            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function(event, next, current) {
                // if (next && next.$$route && next.$$route.secure) {
                //     if (!authService.user.isAuthenticated) {
                //         $rootScope.$evalAsync(function() {
                //             // authService.redirectToLogin();
                //         });
                //     }
                // }
            });

        }
    ]);

    return app;

});

'use strict';

define(['js/services/routeResolver'], function() {

    var app = angular.module('webApp', ['ngRoute','routeResolverServices']);
    
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
                .when('/manage', route.resolve('Manage', 'manage/','vm'))
                .when('/list', route.resolve('List', 'manage/','vm'))
                .when('/editor', route.resolve('Editor', 'manage/','vm'))
                .when('/add', route.resolve('Add', 'manage/','vm'))
                .when('/photo', route.resolve('Photo', 'manage/','vm'))
                .when('/single', route.resolve('Single', 'manage/','vm'))
                .when('/data', route.resolve('Data', 'manage/','vm'))
                .when('/preview', route.resolve('Preview', 'manage/','vm'))
                .otherwise({
                    redirectTo: '/chat'
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

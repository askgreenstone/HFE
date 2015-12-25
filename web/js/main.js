require.config({
    baseUrl: '',
    urlArgs: 'v=1.1.2',
    paths:{
    	'ZeroClipboard':'lib/ueditor/third-party/zeroclipboard/ZeroClipboard',
        'App':'js/app/app',
        'RouteResolver':'js/services/routeResolver',
        'Common':'js/services/common'
    }
});

require(
    [
        'App',
        'RouteResolver',
        'Common'
    ],
    function () {
        angular.bootstrap(document, ['webApp']);
    });
require.config({
    baseUrl: '',
    urlArgs: 'v=1.1.2',
    paths:{
    	'ZeroClipboard':'lib/umeditor/third-party/zeroclipboard/ZeroClipboard',
        'App':'js/app/app',
        'RouteResolver':'js/services/routeResolver',
        'Common':'js/services/common',
        'Sortable':'lib/sortable'
    }
});

require(
    [
        'App',
        'RouteResolver',
        'Common',
        'Sortable'
    ],
    function () {
        angular.bootstrap(document, ['webApp']);
    });
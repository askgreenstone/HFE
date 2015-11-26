require.config({
    baseUrl: '',
    urlArgs: 'v=1.1.1',
    paths:{
    	'ZeroClipboard':'lib/ueditor/third-party/zeroclipboard/ZeroClipboard'
    }
});

require(
    [
        'js/app/app',
        'js/services/routeResolver'
    ],
    function () {
        angular.bootstrap(document, ['webApp']);
    });
angular.module('myApp', [])
    .controller('myCtrl', function($scope,$http) {
        $scope.user = '';

        $scope.getServerData = function() {
        	$scope.codeList = [];
        	if(!$scope.user) return;
            $http({
                method: 'POST',
                url: 'http://mshare.green-stone.cn/comm/CreateInviteCode.do',
                data:{'nms':$scope.user}
            }).
            success(function(data, status) {
               console.log(data);
               $scope.codeList = data.array;
               $scope.user = '';
            }).
            error(function(data, status) {
                console.log('error:'+data);
            });
        }

    });

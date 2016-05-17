angular.module('myApp', [])
    .controller('myCtrl', function($scope,$http) {
        $scope.user = {};
        $scope.user.t = 4;
        $scope.user.p = 12;
        $scope.codeList = [];

        $scope.addServerData = function() {	
        	if(!$scope.user.en){
        		alert('请填写姓名！');
        		return;
        	}
        	if(!$scope.user.pn){
        		alert('请填写电话！');
        		return;
        	}
        	console.log($scope.user);
        	$scope.codeList.push($scope.user);
        	$scope.user = {};
        	$scope.user.t = 4;
        	$scope.user.p = 12;
        	console.log($scope.codeList);
        }
        $scope.postServerData = function() {	
        	console.log($scope.codeList);
            $http({
                method: 'POST',
                url: 'http://t-dist.green-stone.cn/exp/BatchRegister.do',
                data:{'al':$scope.codeList},
                headers : {'Content-Type':undefined}
            }).
            success(function(data, status) {
               console.log(data);
               if(data.c == 1000){
               	alert('注册成功！');
               	$scope.codeList = [];
               }else{
               	alert('注册失败');
               }
            }).
            error(function(data, status) {
            	alert('网络错误或服务器异常');	
                console.log('error:'+data);
            });
        }
    });

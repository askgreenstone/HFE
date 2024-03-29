angular.module('myApp', [])
    .controller('myCtrl', function($scope,$http) {
        var url = '';
        if(window.location.href.indexOf('localhost')>-1||window.location.href.indexOf('t-dist')>-1){
		  url = 'http://t-dist.green-stone.cn';
		}else{
		  url = 'http://dist.green-stone.cn';
		}

        $scope.getQRcodeAddress = function() {	
        	if(!$scope.website){
        		alert('请填写地址！');
        		return;
        	}
            console.log($scope.website);
            var data = JSON.stringify({'param':$scope.website});
            console.log(data);
            $http({
                method: 'POST',
                url: url + '/comm/VCard.do',
                data:data,
                headers : {'Content-Type':undefined}
            }).
            success(function(data, status) {
               console.log(data);
               $('.qrcode').text(data.QrCodeUrl);
               setTimeout(function(){
                $('#imgSrc').attr('src',data.QrCodeUrl)
               },300)
               
            }).
            error(function(data, status) {
                alert('系统开了小差，请刷新页面');    
                console.log('error:'+data);
            });
        	
        	
        }
    });

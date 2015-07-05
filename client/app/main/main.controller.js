'use strict';

angular.module('stockOverwatchApp')
	.controller('MainCtrl', function ($scope, $http, socket) {
		$scope.theStocks = [];

		$http.get('/api/stocks').success(function(theStocks) {
			$scope.theStocks = theStocks;
			socket.syncUpdates('stock', $scope.theStocks);
		});

		$scope.addStock = function() {
			if($scope.newStock === '') {
				return;
			}
			$http.post('/api/stocks', { name: $scope.newStock });
			$scope.newStock = '';
		};

		$scope.deleteStock = function(stock) {
			$http.delete('/api/stocks/' + stock._id);
		};

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('stock');
		});
	});

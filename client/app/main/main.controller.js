'use strict';

angular.module('stockOverwatchApp')
	.controller('MainCtrl', function ($scope, $http, socket) {
		$scope.theStocks = [];
		$scope.series = ['AAPL', 'FB'];
		$scope.data = [
			[1,3,2,7,3,1],
			[3,2,7,3,1,1]
		];
		$scope.labels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
		$scope.options = {
			responsive: true,
			scaleShowGridLines : false,
			bezierCurve : false,
			pointDot : false
		};

		$http.get('/api/stocks').success(function(theStocks) {
			$scope.theStocks = theStocks;
			socket.syncUpdates('stock', $scope.theStocks);
		});

		$scope.addStock = function() {
			if($scope.newStock === '') {
				return;
			}
			$http.post('/api/stocks', { name: $scope.newStock.toUpperCase() });
			$scope.newStock = '';
		};

		$scope.deleteStock = function(stock) {
			$http.delete('/api/stocks/' + stock._id);
		};

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('stock');
		});
	});

'use strict';

angular.module('stockOverwatchApp')
	.controller('MainCtrl', function ($scope, $http, socket) {
		Date.prototype.yyyymmdd = function() {
			var yyyy = this.getFullYear().toString();
			var mm = (this.getMonth()+1).toString();
			var dd  = this.getDate().toString();
			return yyyy + '-' + (mm[1]?mm:'0'+mm[0]) + '-' + (dd[1]?dd:'0'+dd[0]);
		};

		$scope.theStocks = [];
		$scope.newStock = '';
		$scope.series = [];
		$scope.data = [];
		$scope.labels = [];
		$scope.options = {
			responsive: true,
			showScale: false,
			scaleShowGridLines : false,
			bezierCurve : false,
			pointDot : false
		};

		$scope.loadData = function() {
			var startDate = new Date();
			var endDate = new Date();

			startDate.setMonth(endDate.getMonth()-5);

			var startDateStr = startDate.yyyymmdd();
			var endDateStr = endDate.yyyymmdd();

			var symbols = $scope.theStocks.map(function(stock) {
				return stock.name;
			}).join('%22,%22');

			var stockURL = 'https://query.yahooapis.com/v1/public/' +
				'yql?q=select%20*%20from%20yahoo.finance.historicaldata%20' +
				'where%20symbol%20in%20(%22' + symbols + '%22)%20and%20' +
				'startDate%20%3D%20%22' + startDateStr + '%22%20and%20endDate%20%3D%20%22' + endDateStr + '%22' +
				'&format=json&diagnostics=true&env=http://datatables.org/alltables.env&format=json';

			$http.get(stockURL).success(function(res) {
				var data = res.query.results.quote;

				$scope.series = data.map(function(dataPoint) {
					return dataPoint.Symbol;
				}).filter(function(symbol, index, symbols) {
					return symbols.indexOf(symbol) === index;
				});

				$scope.labels = data.map(function(dataPoint) {
					return dataPoint.Date;
				}).filter(function(date, index, dates) {
					return dates.indexOf(date) === index;
				});

				$scope.data = $scope.series.map(function(symbol) {
					return data.filter(function(dataPoint) {
						return dataPoint.Symbol === symbol;
					}).map(function(dataPoint) {
						return dataPoint.Close;
					});
				});
			});
		};

		$http.get('/api/stocks').success(function(theStocks) {
			$scope.theStocks = theStocks;
			socket.syncUpdates('stock', $scope.theStocks, $scope.loadData);

			$scope.loadData();
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

'use strict';

angular.module('stockOverwatchApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'btford.socket-io',
	'ui.router',
	'ui.bootstrap',
	'chart.js'
])
	.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
		$urlRouterProvider
			.otherwise('/');

		$locationProvider.html5Mode(true);
	});

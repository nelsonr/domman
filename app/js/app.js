// Application configuration
window.config = loadConfig('config.json');

// Initialize Application
app = angular.module('app', [])
	.config(function($routeProvider) {
		$routeProvider
			.when('/new', {templateUrl:'./views/new.html', controller: 'NewController'})
			.when('/edit/:id', {templateUrl: './views/edit.html', controller: 'EditController'})
			.otherwise({redirectTo: '/new'});
	});

// Prevent application flash
preventFlash();

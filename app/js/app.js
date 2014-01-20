// Application configuration
window.config = loadConfig('./config.json');

// Initialize Application
app = angular.module('app', ['ngRoute']).config(function($routeProvider) {
	$routeProvider
		.when('/home', {templateUrl:'./views/domains-list.html', controller: 'DomainsController'})
		.when('/new', {templateUrl:'./views/new.html', controller: 'NewController'})
		.when('/edit/:id', {templateUrl: './views/edit.html', controller: 'EditController'})
		.otherwise({redirectTo: '/home'});
});

// Prevent application flash
preventFlash();

app.factory('MessageService', function($rootScope) {
	var service = {};

	service.message = function(message) {
		$rootScope.$broadcast('message', message);
	};

	return service;
});

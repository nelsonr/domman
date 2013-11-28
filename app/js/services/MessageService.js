app.factory('MessageService', function($rootScope) {
	var service = {};

	service.send = function(message) {
		$rootScope.$broadcast('message', message);
	};

	return service;
});

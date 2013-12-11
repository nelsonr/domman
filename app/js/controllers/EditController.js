app.controller('EditController', function($scope, $location, $routeParams, DomainsService, ApacheService, MessageService) {
	/**
	 * Clone the model object to prevent binding
	 * @param obj
	 * @returns {{}}
	 */
	function clone(obj) {
		var newObj = {};

		for(p in obj) {
			newObj[p] = obj[p];
		}

		return newObj;
	}

	$scope.domain = clone(DomainsService.get($routeParams.id));

	$scope.save = function() {
		if (DomainsService.update(clone($scope.domain))) {
			ApacheService.restart();
		}
	};

	$scope.remove = function() {
		DomainsService.remove($scope.domain.id);
		ApacheService.restart();
		$location.path('/new');
	};
});

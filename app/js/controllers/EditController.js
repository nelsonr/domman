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
		DomainsService.update(clone($scope.domain));
		MessageService.message('Domain saved');
		ApacheService.restart();
	};

	$scope.remove = function() {
		DomainsService.remove($scope.domain.id);
		ApacheService.restart()
		$location.path('/new');
	};

//	$scope.advancedView = {
//		text: 'Advanced view',
//		state: false
//	};

//	$scope.toggleAdvancedView = function() {
//		$scope.advancedView.state = !$scope.advancedView.state;
//		$scope.advancedView.text = $scope.advancedView.state ? 'Simple view' : 'Advanced view';
//	};
//
//	$scope.getAdvancedView = function() {
//	    return $scope.advancedView.state ? '' : 'hidden';
//	}
});

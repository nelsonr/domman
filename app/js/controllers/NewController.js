app.controller('NewController', function($scope, $location, DomainsService, ApacheService, MessageService) {
	$scope.domain = {};

	$scope.save = function() {
		var id = DomainsService.add($scope.domain);
		$location.path('/edit/' + id);

		// restart apache to apply configuration changes
		ApacheService.restart();
	}
});

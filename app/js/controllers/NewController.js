app.controller('NewController', function($scope, $location, DomainsService, ApacheService, MessageService) {
	$scope.domain = {};

	$scope.save = function() {
		var id = DomainsService.add($scope.domain);
		$location.path('/edit/' + id);

		MessageService.message('New domain added!');

		// restart apache to apply configuration changes
		ApacheService.restart();
	}
});

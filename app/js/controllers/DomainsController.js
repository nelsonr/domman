app.controller('DomainsController', function($scope, $location, DomainsService) {
	$scope.domains = DomainsService;

	$scope.edit = function(id) {
		$location.path('/edit/' + id);
	};

	$scope.new = function() {
	    $location.path('/new');
	};

	$scope.selected = function(id) {
		return ($location.path() == '/edit/' + id) ? 'selected' : false;
	};
});

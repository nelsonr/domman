app.controller('MenuController', function($scope, $location) {
	$scope.goto = function(location) {
	    $location.path(location);
	};

	$scope.isActive = function(path) {
	    return ($location.path().indexOf(path)) != -1 ? 'active' : false;
	}
});

app.controller('MenuController', function($scope, $location) {
	$scope.new = function() {
		$location.path('/new');
	};
});

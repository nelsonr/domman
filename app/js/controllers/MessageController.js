app.controller('MessageController', function($scope) {
	$scope.messages = [];

	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
			if(fn) {
				this.$apply(fn);
			} else {
				this.$apply();
			}
		}
	};

	$scope.$on('message', function(event, message) {
		$scope.messages.push(message);

		var t = setTimeout(function() {
			$scope.messages.shift();
			$scope.safeApply();
			clearTimeout(t);
		}, 2000);

		$scope.safeApply();
	});
});

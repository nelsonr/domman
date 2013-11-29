app.factory('ApacheService', function(MessageService) {
	var service = {};

	service.restart = function() {
		var apache = config.apache_bin;
		var args = ['-k', 'restart']; // restart arguments
		var exec = require('child_process').execFile;

		MessageService.send('Apache is restarting...');

		exec(apache, args, function(err, stdout, stderr) {
			MessageService.send('Apache is running.');
			console.info('APACHE: ' + stderr);
		});
	};

	return service;
});

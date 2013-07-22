app.factory('FileService', function() {
	var service = {};

	service.read = function(file) {
		var fs = require('fs');

		return fs.readFileSync(file).toString();
	};

	service.write = function(file, content) {
	    var fs = require('fs');

		fs.writeFile(file, content, function(err) {
			if(err) throw err;

			console.log('File ' + file + ' was written successfully!')
		});
	};

	service.append = function(file, content) {
		var fs = require('fs');

		fs.appendFile(file, content, function(err) {
			if(err) throw err;

			console.log('File ' + file + ' was written (append) successfully!');
		})
	};

	return service;
});
